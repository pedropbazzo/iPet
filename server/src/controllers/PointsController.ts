import knex from '../database/connection';
import { Request, Response } from 'express';
import hashed from '../config/multer'

class PointsController {

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points').join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        const serializedPoints = points.map(point =>{
            return {
                ...point,
                image_url: `https://ipet-uploads.s3.us-east-2.amazonaws.com/${point.image}`
            }
        })

        response.json({ serializedPoints });

    };

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: "Point not found." });
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        const serializedPoint = {
            ...point,
            image_url: `https://ipet-uploads.s3.us-east-2.amazonaws.com/${point.image}`
        
        };

        response.json({ serializedPoint, items });
    };

    async create(request: Request, response: Response) {

        const fileName = request.file.originalname;

        const finalName = `${hashed.hashed}-${hashed.time}-${fileName}`

        try {
            const {
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf,
                address,
                services,
                items,
                phone,
                plan,
                seller,
            } = request.body;


            const trx = await knex.transaction();

            const point = {
                image: finalName,
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                address,
                uf,
                services,
                phone,
                plan,
                seller,
                is_paid: true
            }

            const insertedIds = await trx("points").insert(point, 'id');

            const point_id = insertedIds[0];

            const pointItems = items
                .split(',')
                .map((item : string) => Number(item.trim()))
                .map((item_id: number) => {
                    return {
                        item_id,
                        point_id,
                    };
                })
            await trx("point_items").insert(pointItems);

            await trx.commit();

            return response.json({
                id: point_id,
                ...point
            });

        } catch (error) {
            response.json({
                error: 500,
                message: error.message
            });
        }
    }
};

export default PointsController;
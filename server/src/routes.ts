import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer'

import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const routes = express.Router();

const upload = multer(multerConfig);

const poinsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.post('/points',upload.single('image'), poinsController.create)
routes.get('/points',  poinsController.index)
routes.get('/points/:id', poinsController.show)

export default routes;
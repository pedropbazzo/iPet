import express from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.use('/items', express.static(path.resolve(__dirname, '..', 'items')));

app.use('/src/point_images', express.static(path.resolve(__dirname, '..', 'src', 'point_images')));

app.listen(process.env.PORT || 5432);
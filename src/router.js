import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionControler from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

import multer from 'multer';

import multerConfig from './config/multer';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/session', SessionControler.store);

//Rotas autenticadas
routes.use(authMiddleware);
routes.put('/users', UserController.update);

//upload de arquivos
routes.post('/files', upload.single('file'), FileController.store);

export default routes;

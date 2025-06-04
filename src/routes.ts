import express from 'express';
import multer from 'multer';
import cors from 'cors';
import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { MercadoPagoCreatePaymentController } from './controllers/mercadopago/mercagopago.create.controller';
import { MercadoPagoWebhookController } from './controllers/mercadopago/mercagopago-notification.notification';
import { PeopleController } from './controllers/people/people.controller';

const mercadoPagoCreatePaymentController = new MercadoPagoCreatePaymentController();
const webhookController = new MercadoPagoWebhookController();
const peopleController = new PeopleController();

export const router = Router();


router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

function logAndRegister(
  method: "get" | "post" | "put" | "patch" | "delete",
  path: string,
  ...handlers: RequestHandler[]
) {
  console.log(`[${method.toUpperCase()}] ${path}`);
  router[method](path, ...handlers);
}


router.post("/mercadopago", mercadoPagoCreatePaymentController.store)
router.post("/webhook/mercadopago", webhookController.handle)

logAndRegister("post", "/people/create", peopleController.create);
logAndRegister("get", "/people", peopleController.list);
logAndRegister("get", "/people/:id", peopleController.getById);
logAndRegister("put", "/people/:id", peopleController.update);
logAndRegister("delete", "/people/:id", peopleController.delete);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

router.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
}); 

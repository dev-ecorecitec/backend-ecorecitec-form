import { Router } from 'express';
import express from 'express';
import multer from 'multer';

import { MercadoPagoCreatePaymentController } from './controllers/mercadopago/mercagopago.create.controller';
import {  MercadoPagoWebhookController } from './controllers/mercadopago/mercagopago-notification.notification';

const mercadoPagoCreatePaymentController = new MercadoPagoCreatePaymentController();
const webhookController = new MercadoPagoWebhookController();
export const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

router.post("/mercadopago", mercadoPagoCreatePaymentController.store)
router.post("/webhook/mercadopago", webhookController.handle)

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

router.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
}); 



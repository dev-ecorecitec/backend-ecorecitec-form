"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const mercagopago_create_controller_1 = require("./controllers/mercadopago/mercagopago.create.controller");
const mercagopago_notification_notification_1 = require("./controllers/mercadopago/mercagopago-notification.notification");
const mercadoPagoCreatePaymentController = new mercagopago_create_controller_1.MercadoPagoCreatePaymentController();
exports.router = (0, express_1.Router)();
exports.router.use(express_2.default.json());
exports.router.use(express_2.default.urlencoded({ extended: true }));
exports.router.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
exports.router.post("/mercadopago", mercadoPagoCreatePaymentController.store);
exports.router.post("/webhook/mercagopago", mercagopago_notification_notification_1.MercadoPagoWebhook);
exports.router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
exports.router.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

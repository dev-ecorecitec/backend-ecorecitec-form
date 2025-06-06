"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const mercagopago_create_controller_1 = require("./controllers/mercadopago/mercagopago.create.controller");
const mercagopago_notification_notification_1 = require("./controllers/mercadopago/mercagopago-notification.notification");
const people_controller_1 = require("./controllers/people/people.controller");
const mercadoPagoCreatePaymentController = new mercagopago_create_controller_1.MercadoPagoCreatePaymentController();
const webhookController = new mercagopago_notification_notification_1.MercadoPagoWebhookController();
const peopleController = new people_controller_1.PeopleController();
exports.router = (0, express_2.Router)();
exports.router.use(express_1.default.json());
exports.router.use(express_1.default.urlencoded({ extended: true }));
exports.router.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
function logAndRegister(method, path, ...handlers) {
    console.log(`[${method.toUpperCase()}] ${path}`);
    exports.router[method](path, ...handlers);
}
exports.router.post("/mercadopago", mercadoPagoCreatePaymentController.store);
exports.router.post("/webhook/mercadopago", webhookController.handle);
logAndRegister("post", "/people/create", peopleController.create);
logAndRegister("get", "/people", peopleController.list);
logAndRegister("get", "/people/:id", peopleController.getById);
logAndRegister("put", "/people/:id", peopleController.update);
logAndRegister("delete", "/people/:id", peopleController.delete);
exports.router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
exports.router.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

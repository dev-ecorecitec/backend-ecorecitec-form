"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoWebhook = void 0;
const mercadopago_1 = require("mercadopago");
const MercadoPagoWebhook = async (req, res) => {
    var _a;
    try {
        const { type, data } = req.body;
        if (type === "payment") {
            const client = new mercadopago_1.MercadoPagoConfig({
                accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
            });
            const payment = new mercadopago_1.Payment(client);
            const paymentInfo = await payment.get({ id: data.id });
            const status = paymentInfo.status;
            const email = (_a = paymentInfo.payer) === null || _a === void 0 ? void 0 : _a.email;
            const amount = paymentInfo.transaction_amount;
            console.log(`Pagamento ${data.id} - Status: ${status} - Email: ${email} - Valor: ${amount}`);
            console.log("indo para o excel!");
        }
        // Responde para o Mercado Pago
        res.status(200).send("OK");
    }
    catch (error) {
        console.error("Erro no webhook:", error);
        res.status(500).send("Erro no webhook");
    }
};
exports.MercadoPagoWebhook = MercadoPagoWebhook;

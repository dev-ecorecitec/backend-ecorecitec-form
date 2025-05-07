"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoCreatePaymentController = void 0;
const mercadopago_1 = require("mercadopago");
const create_mercadopago_user_dto_1 = require("./dto/create-mercadopago-user.dto");
class MercadoPagoCreatePaymentController {
    constructor() {
        this.store = async (req, res) => {
            const result = create_mercadopago_user_dto_1.CreatePaymentDTO.safeParse(req.body);
            if (!result.success) {
                const fullErrorMessage = result.error.errors
                    .map((error) => error.message)
                    .join(", ");
                return res.status(400).json({ error: fullErrorMessage });
            }
            const { name, email, valor } = result.data;
            try {
                const client = new mercadopago_1.MercadoPagoConfig({
                    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || ""
                });
                const preference = new mercadopago_1.Preference(client);
                const response = await preference.create({
                    body: {
                        items: [
                            {
                                id: "inscrição",
                                title: `Pagamento para ${name}`,
                                quantity: 1,
                                unit_price: Number(valor),
                            },
                        ],
                        payer: {
                            name,
                            email,
                        },
                        notification_url: "https://angry-moose-try.loca.lt/webhook/mercagopago",
                        back_urls: {
                            success: "https://seusite.com/sucesso",
                            failure: "https://seusite.com/erro",
                        },
                        auto_return: "approved",
                    }
                });
                return res.status(200).json({ init_point: response.init_point });
            }
            catch (error) {
                console.error("Erro ao criar pagamento:", error);
                return res.status(500).json({ error: "Erro ao criar pagamento" });
            }
        };
    }
}
exports.MercadoPagoCreatePaymentController = MercadoPagoCreatePaymentController;

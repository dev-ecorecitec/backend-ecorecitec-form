"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoCreatePaymentController = void 0;
const mercadopago_1 = require("mercadopago");
const create_mercadopago_user_dto_1 = require("./dto/create-mercadopago-user.dto");
const save_to_excel_1 = require("../../services/save-to-excel");
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
            const { name, telefone, email, cpf, pais, cidade, linkedin, empresa, cargo, amount, } = result.data;
            let response;
            let pagamentoCriado = false;
            try {
                const client = new mercadopago_1.MercadoPagoConfig({
                    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
                });
                const preference = new mercadopago_1.Preference(client);
                response = await preference.create({
                    body: {
                        items: [
                            {
                                id: "inscrição",
                                title: "Pagamento",
                                quantity: 1,
                                unit_price: amount,
                            },
                        ],
                        notification_url: "https://bd79-179-97-232-217.ngrok-free.app/webhook/mercadopago",
                        back_urls: {
                            success: "https://seusite.com/sucesso",
                            failure: "https://seusite.com/erro",
                        },
                        auto_return: "approved",
                    },
                });
                pagamentoCriado = true;
                const dataToExcel = [
                    {
                        Nome: name,
                        Telefone: telefone,
                        Email: email,
                        CPF: cpf,
                        País: pais || "",
                        Cidade: cidade || "",
                        LinkedIn: linkedin || "",
                        Empresa: empresa || "",
                        Cargo: cargo || "",
                    },
                ];
                await (0, save_to_excel_1.saveToExcel)(dataToExcel);
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

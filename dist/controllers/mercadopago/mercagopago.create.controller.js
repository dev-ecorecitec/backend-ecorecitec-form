"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoCreatePaymentController = void 0;
const mercadopago_1 = require("mercadopago");
const create_mercadopago_user_dto_1 = require("./dto/create-mercadopago-user.dto");
class MercadoPagoCreatePaymentController {
    constructor() {
        this.store = async (req, res) => {
            console.log("Recebendo dados do formulário:", req.body);
            const result = create_mercadopago_user_dto_1.CreatePaymentDTO.safeParse(req.body);
            if (!result.success) {
                const fullErrorMessage = result.error.errors
                    .map((error) => error.message)
                    .join(", ");
                console.error("Erro na validação dos dados:", fullErrorMessage);
                return res.status(400).json({ error: fullErrorMessage });
            }
            const { name, telefone, email, cpf, pais, cidade, linkedin, empresa, cargo, amount, participarSelecaoMindset, disponibilidadeHorarioTeste, indicacao, expectativas, participant_type } = result.data;
            let response;
            try {
                console.log("Iniciando criação do pagamento no Mercado Pago");
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
                                unit_price: amount || 0,
                            },
                        ],
                        notification_url: `${process.env.API_URL}/webhook/mercadopago`,
                        back_urls: {
                            success: "https://eco-recitec.com.br/sucess-payment.html",
                            failure: "https://eco-recitec.com.br/error-payment.html",
                        },
                        auto_return: "approved",
                        metadata: {
                            name,
                            telefone,
                            email,
                            cpf,
                            pais,
                            cidade,
                            linkedin,
                            empresa,
                            cargo,
                            participarSelecaoMindset,
                            disponibilidadeHorarioTeste,
                            participant_type,
                            ...(indicacao && { indicacao }),
                            ...(expectativas && { expectativas }),
                        }
                    },
                });
                console.log("Pagamento criado com sucesso no Mercado Pago");
                return res.status(200).json({ init_point: response.init_point });
            }
            catch (error) {
                console.error("Erro ao processar pagamento:", error);
                return res.status(500).json({ error: "Erro ao criar pagamento" });
            }
        };
    }
}
exports.MercadoPagoCreatePaymentController = MercadoPagoCreatePaymentController;

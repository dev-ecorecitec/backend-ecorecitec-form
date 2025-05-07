import { Request, Response } from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { CreatePaymentDTO } from "./dto/create-mercadopago-user.dto";
import { saveToExcel } from "../../services/save-to-excel";

export class MercadoPagoCreatePaymentController {
  store = async (req: Request, res: Response) => {
    const result = CreatePaymentDTO.safeParse(req.body);
    
    if (!result.success) {
      const fullErrorMessage = result.error.errors
        .map((error) => error.message)
        .join(", ");
      return res.status(400).json({ error: fullErrorMessage });
    }

    const {
      name,
      telefone,
      email,
      cpf,
      pais,
      cidade,
      linkedin,
      empresa,
      cargo,
      amount, // Capturando o valor do pagamento
    } = result.data;

    try {
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
      });

      const preference = new Preference(client);

      const response = await preference.create({
        body: {
          items: [
            {
              id: "inscrição",
              title: "Pagamento",
              quantity: 1,
              unit_price: amount, // Valor recebido do body
            },
          ],
          notification_url: "https://9a91-179-97-232-155.ngrok-free.app/webhook/mercadopago",
          back_urls: {
            success: "https://seusite.com/sucesso",
            failure: "https://seusite.com/erro",
          },
          auto_return: "approved",
        },
      });

      // Dados para a planilha Excel (Removido o amount)
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

      await saveToExcel(dataToExcel);

      return res.status(200).json({ init_point: response.init_point });
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      return res.status(500).json({ error: "Erro ao criar pagamento" });
    }
  };
}

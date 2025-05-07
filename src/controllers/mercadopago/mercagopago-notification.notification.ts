import { Request, Response } from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";

export class MercadoPagoWebhookController {
  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Webhook recebido:", req.body);

      const { type, data } = req.body;

      if (type === "payment" && data?.id) {
        const client = new MercadoPagoConfig({
          accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
        });

        const payment = new Payment(client);
        const paymentInfo = await payment.get({ id: data.id });

        const status = paymentInfo.status;
        const email = paymentInfo.payer?.email;
        const amount = paymentInfo.transaction_amount;

        console.log(`Pagamento ${data.id} - Status: ${status} - Email: ${email} - Valor: ${amount}`);
        console.log("indo para o excel!");
      } else {
        console.warn("Evento ignorado ou sem ID:", req.body);
      }

      res.status(200).send("OK");
    } catch (error) {
      console.error("Erro no webhook:", error);
      res.status(500).send("Erro no webhook");
    }
  };
}

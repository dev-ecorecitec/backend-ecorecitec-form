import { Request, Response } from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { CreatePaymentDTO } from "./dto/create-mercadopago-user.dto";

export class MercadoPagoCreatePaymentController {
  store = async (req: Request, res: Response) => {
    console.log("Recebendo dados do formulário:", req.body);
    
    const result = CreatePaymentDTO.safeParse(req.body);

    if (!result.success) {
      const fullErrorMessage = result.error.errors
        .map((error) => error.message)
        .join(", ");
      console.error("Erro na validação dos dados:", fullErrorMessage);
      return res.status(400).json({ error: fullErrorMessage });
    }

    const {
      nome,
      telefone,
      email,
      cpf,
      pais,
      cidade,
      linkedin,
      empresa,
      cargo,
      amount,
      participar_teste,
      disp_teste,
      indicacao,
      expectativas,
      participant_type,
      router,
    } = result.data;

    let response;

    try {
      console.log("Iniciando criação do pagamento no Mercado Pago");
      
      const webhookUrl = `${process.env.RENDER_URL}/webhook/mercadopago`;
      console.log("URL do webhook configurada:", webhookUrl);
      
      if (!process.env.RENDER_URL) {
        console.warn("⚠️  RENDER_URL não está definida! O webhook pode não funcionar.");
      }
      
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
      });

      const preference = new Preference(client);

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
          notification_url: webhookUrl,
          back_urls: {
            success: "https://eco-recitec.com.br/sucess-payment.html",
            failure: "https://eco-recitec.com.br/error-payment.html",
          },
          auto_return: "approved",
          metadata: {
            nome,
            telefone,
            email,
            cpf,
            pais,
            cidade,
            linkedin,
            empresa,
            cargo,
            participar_teste,
            disp_teste,
            participant_type,
            ...(indicacao && { indicacao }),
            ...(expectativas && { expectativas }),
            router,
          }
          
        },
      });

      console.log("Pagamento criado com sucesso no Mercado Pago");
      console.log("ID da preferência:", response.id);
      return res.status(200).json({ init_point: response.init_point });
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      return res.status(500).json({ error: "Erro ao criar pagamento" });
    }
  };
}

import { Request, Response } from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";
import nodemailer from "nodemailer";
import { prisma } from "../../utils/prisma";

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
        const name = paymentInfo.payer?.first_name || "Usuário";
        const amount = paymentInfo.transaction_amount;
        const metadata = paymentInfo.metadata;

        console.log(`Pagamento ${data.id} - Status: ${status} - Email: ${email} - Valor: ${amount}`);

        if (status === "approved" && email && metadata) {
          console.log("Pagamento aprovado, salvando dados no banco de dados...");
          
          try {

            await prisma.people.create({
              data: {
                name: metadata.name,
                email: metadata.email,
                telefone: metadata.telefone,
                cpf: metadata.cpf,
                pais: metadata.pais || "Brasil",
                cidade: metadata.cidade || "Não informado",
                linkedin: metadata.linkedin || "Não informado",
                empresa: metadata.empresa || "Não informado",
                cargo: metadata.cargo || "Não informado",
                participarSelecaoMindset: metadata.participarSelecaoMindset || "Não informado",
                disponibilidadeHorarioTeste: metadata.disponibilidadeHorarioTeste || "Não informado",
                indicacao: metadata.indicacao || "",
                expectativas: metadata.expectativas || "",
                participant_type: metadata.participant_type || "PAID"
              }
            });
            console.log("Dados salvos com sucesso no banco de dados");

            // Configuração do transporter do nodemailer
            const transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST,
              port: Number(process.env.SMTP_PORT) || 587,
              secure: false,
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              },
            });

            const mailOptions = {
              from: process.env.SMTP_FROM || '"Equipe" Ecorecitec',
              to: email,
              subject: "Confirmação de inscrição e pagamento",
              text: `Olá ${name}, agradecemos a sua inscrição no congresso internacional Circular Tech Skills, Etapa 2, presencial em Salvador. Uma experiência única com palestras, networking e participação em um Ecossistema Circular constituído de Indústrias, Startups, Governos, Cooperativas, ONGs e Meio Acadêmico. Aguardamos você em um ambiente propício ao debate esclarecedor e negócios circulares. Equipe Circular Techs Skills.`,
              html: `
              <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
              <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="pt">
              <head>
              <title></title>
              <meta charset="UTF-8" />
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="x-apple-disable-message-reformatting" content="" />
              <meta content="target-densitydpi=device-dpi" name="viewport" />
              <meta content="true" name="HandheldFriendly" />
              <meta content="width=device-width" name="viewport" />
              <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
              <style type="text/css">
              table { border-collapse: separate; table-layout: fixed; mso-table-lspace: 0pt; mso-table-rspace: 0pt }
              table td { border-collapse: collapse }
              .ExternalClass { width: 100% }
              .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100% }
              body, a, li, p, h1, h2, h3 { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
              html { -webkit-text-size-adjust: none !important }
              body, #innerTable { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale }
              #innerTable img+div { display: none; display: none !important }
              img { Margin: 0; padding: 0; -ms-interpolation-mode: bicubic }
              h1, h2, h3, p, a { line-height: inherit; overflow-wrap: normal; white-space: normal; word-break: break-word }
              a { text-decoration: none }
              h1, h2, h3, p { min-width: 100%!important; width: 100%!important; max-width: 100%!important; display: inline-block!important; border: 0; padding: 0; margin: 0 }
              a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important }
              u + #body a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; }
              a[href^="mailto"], a[href^="tel"], a[href^="sms"] { color: inherit; text-decoration: none }
              </style>
              <style type="text/css">
              @media (min-width: 481px) { .hd { display: none!important } }
              </style>
              <style type="text/css">
              @media (max-width: 480px) {
              .hm { display: none!important }
              .t40,.t45,.t50,.t55,.t59{vertical-align:top!important}.t26{mso-line-height-alt:0px!important;line-height:0!important;display:none!important}.t27{padding-left:30px!important;padding-bottom:40px!important;padding-right:30px!important}.t6{padding-bottom:20px!important}.t5{line-height:28px!important;font-size:26px!important;letter-spacing:-1.04px!important}.t81{padding:40px 30px!important}.t64{padding-bottom:36px!important}.t60{text-align:center!important}.t38,.t43,.t48,.t53{display:revert!important}.t40,.t45,.t50,.t55{width:57px!important}.t59{width:24px!important}.t1{padding-bottom:50px!important}.t3{width:80px!important}
              }
              </style>
              <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;800&amp;display=swap" rel="stylesheet" type="text/css" />
              </head>
              <body id="body" class="t87" style="min-width:100%;Margin:0px;padding:0px;background-color:#242424;"><div class="t86" style="background-color:#242424;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td class="t85" style="font-size:0;line-height:0;mso-line-height-rule:exactly;background-color:#242424;" valign="top" align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" id="innerTable"><tr><td><div class="t26" style="mso-line-height-rule:exactly;mso-line-height-alt:45px;line-height:45px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
              <table class="t30" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="600" class="t29" style="width:600px;">
              <table class="t28" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t27" style="background-color:#F8F8F8;padding:0 50px 60px 50px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td align="left">
              <table class="t4" role="presentation" cellpadding="0" cellspacing="0" style="Margin-right:auto;"><tr><td width="130" class="t3" style="width:130px;">
              <table class="t2" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t1" style="padding:0 0 60px 0;"><div style="font-size:0px;"><img class="t0" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="130" height="130" alt="" src="https://eco-recitec.com.br/images/page-2-event/image-removebg-preview.png"/></div></td></tr></table>
              </td></tr></table>
              </td></tr><tr><td align="center">
              <table class="t9" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="500" class="t8" style="width:600px;">
              <table class="t7" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t6" style="padding:0 0 15px 0;"><h1 class="t5" style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:26px;font-weight:400;font-style:normal;font-size:24px;text-decoration:none;text-transform:none;direction:ltr;color:#333333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:1px;">${name}, obrigado pela sua inscrição.</h1></td></tr></table>
              </td></tr></table>
              </td></tr><tr><td align="center">
              <table class="t14" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="500" class="t13" style="width:600px;">
              <table class="t12" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t11" style="padding:0 0 22px 0;"><p class="t10" style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:16px;text-decoration:none;text-transform:none;direction:ltr;color:#333333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px;">Olá, agradecemos a sua inscrição no congresso internacional Circular Tech Skills, Etapa 2, presencial em Salvador. Uma experiência única com palestras, networking e participação em um Ecossistema Circular constituído de Indústrias, Startups, Governos, Cooperativas, ONGs e Meio Acadêmico.&nbsp;</p></td></tr></table>
              </td></tr></table>
              </td></tr><tr><td align="center">
              <table class="t19" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="500" class="t18" style="width:600px;">
              <table class="t17" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t16" style="padding:0 0 22px 0;"><p class="t15" style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:16px;text-decoration:none;text-transform:none;direction:ltr;color:#333333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px;">Aguardamos você em um ambiente propício ao debate esclarecedor e negócios circulares.</p></td></tr></table>
              </td></tr></table>
              </td></tr><tr><td align="center">
              <table class="t25" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="500" class="t24" style="width:600px;">
              <table class="t23" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t22" style="padding:0 0 22px 0;"><p class="t21" style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:700;font-style:normal;font-size:16px;text-decoration:none;text-transform:none;direction:ltr;color:#333333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px;">Equipe Circular Techs Skills.</p></td></tr></table>
              </td></tr></table>
              </td></tr></table></td></tr></table>
              </td></tr></table>
              </td></tr><tr><td align="center">
              <table class="t84" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="600" class="t83" style="width:600px;">
              <table class="t82" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t81" style="background-color:#242424;padding:48px 50px 48px 50px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td align="center">
              <table class="t35" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="500" class="t34" style="width:600px;">
              <table class="t33" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t32"><p class="t31" style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:800;font-style:normal;font-size:18px;text-decoration:none;text-transform:none;letter-spacing:-0.9px;direction:ltr;color:#757575;text-align:left;mso-line-height-rule:exactly;mso-text-raise:1px;">Para saber mais sobre nossa plataforma nos siga:</p></td></tr></table>
              </td></tr></table>
              </td></tr><tr><td align="center">
              <table class="t67" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="500" class="t66" style="width:800px;">
              <table class="t65" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t64" style="padding:10px 0 44px 0;"><div class="t63" style="width:100%;text-align:center;"><div class="t62" style="display:inline-block;"><table class="t61" role="presentation" cellpadding="0" cellspacing="0" align="center" valign="top">
              <tr class="t60"><td></td><td class="t40" width="57" valign="top">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t39" style="width:100%;"><tr><td class="t37"><div style="font-size:0px;"><img class="t36" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://0ddb8d20-8eb0-4138-9d7e-f87fa9e4cb77.b-cdn.net/e/d04cc4d7-4dad-4698-8919-2a8faaf50c50/55d7ab20-d0f2-435b-9f44-f161f64dc774.png"/></div></td><td class="t38" style="width:33px;" width="33"></td></tr></table>
              </td><td class="t45" width="57" valign="top">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t44" style="width:100%;"><tr><td class="t42"><div style="font-size:0px;"><img class="t41" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://0ddb8d20-8eb0-4138-9d7e-f87fa9e4cb77.b-cdn.net/e/d04cc4d7-4dad-4698-8919-2a8faaf50c50/86a541cc-e849-4cbe-8ba3-ca347731e1c1.png"/></div></td><td class="t43" style="width:33px;" width="33"></td></tr></table>
              </td><td class="t50" width="57" valign="top">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t49" style="width:100%;"><tr><td class="t47"><div style="font-size:0px;"><img class="t46" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://0ddb8d20-8eb0-4138-9d7e-f87fa9e4cb77.b-cdn.net/e/d04cc4d7-4dad-4698-8919-2a8faaf50c50/63b929bc-5f53-42f4-a4f7-4a0887fe74d5.png"/></div></td><td class="t48" style="width:33px;" width="33"></td></tr></table>
              </td><td class="t55" width="57" valign="top">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t54" style="width:100%;"><tr><td class="t52"><div style="font-size:0px;"><img class="t51" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://0ddb8d20-8eb0-4138-9d7e-f87fa9e4cb77.b-cdn.net/e/d04cc4d7-4dad-4698-8919-2a8faaf50c50/e6f8fa64-2cda-4b25-a8bc-4a2e602233bc.png"/></div></td><td class="t53" style="width:33px;" width="33"></td></tr></table>
              </td><td class="t59" width="24" valign="top">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t58" style="width:100%;"><tr><td class="t57"><div style="font-size:0px;"><img class="t56" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://0ddb8d20-8eb0-4138-9d7e-f87fa9e4cb77.b-cdn.net/e/d04cc4d7-4dad-4698-8919-2a8faaf50c50/51d302f9-7c27-45ca-b4b3-0957acec4186.png"/></div></td></tr></table>
              </td>
              <td></td></tr>
              </table></div></div></td></tr></table>
              </td></tr></table>
              </td></tr><tr><td align="center">
              <table class="t72" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="500" class="t71" style="width:600px;">
              <table class="t70" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t69"><p class="t68" style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:12px;text-decoration:none;text-transform:none;direction:ltr;color:#888888;text-align:left;mso-line-height-rule:exactly;mso-text-raise:3px;">4019 Waterview Lane, Santa Fe, NM, New Mexico 87500</p></td></tr></table>
              </td></tr></table>
              </td></tr><tr><td align="center">
              <table class="t80" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="500" class="t79" style="width:600px;">
              <table class="t78" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t77"><p class="t76" style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:12px;text-decoration:none;text-transform:none;direction:ltr;color:#888888;text-align:left;mso-line-height-rule:exactly;mso-text-raise:3px;"><a class="t73" href="https://tabular.email" style="margin:0;Margin:0;font-weight:700;font-style:normal;text-decoration:none;direction:ltr;color:#0000FF;mso-line-height-rule:exactly;" target="_blank">Unsubscribe</a>&nbsp; •&nbsp; <a class="t74" href="https://tabular.email" style="margin:0;Margin:0;font-weight:700;font-style:normal;text-decoration:none;direction:ltr;color:#0000FF;mso-line-height-rule:exactly;" target="_blank">Privacy policy</a>&nbsp; •&nbsp; <a class="t75" href="https://tabular.email" style="margin:0;Margin:0;font-weight:700;font-style:normal;text-decoration:none;direction:ltr;color:#878787;mso-line-height-rule:exactly;" target="_blank">Contact us</a></p></td></tr></table>
              </td></tr></table>
              </td></tr></table></td></tr></table>
              </td></tr></table></div><div class="gmail-fix" style="display: none; white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div></body>
              </html>
              `,
            };

            try {
              await transporter.sendMail(mailOptions);
              console.log("E-mail de confirmação enviado para:", email);
            } catch (mailError) {
              console.error("Erro ao enviar e-mail:", mailError);
            }
          } catch (dbError) {
            console.error("Erro ao salvar no banco de dados:", dbError);
          }
        }
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

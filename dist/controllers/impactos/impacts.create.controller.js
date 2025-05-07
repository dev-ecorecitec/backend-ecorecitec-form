"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactsCreateController = void 0;
const prisma_1 = require("../../utils/prisma");
const nodemailer = __importStar(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const create_impact_dto_1 = require("./dto/create-impact.dto");
class ImpactsCreateController {
    async store(req, res) {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.authToken;
        if (!token) {
            return res.status(401).json({ error: "Token não encontrado." });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            const userId = decoded.id;
            const createImpactDTO = create_impact_dto_1.CreateImpactDTO.safeParse(req.body);
            if (!createImpactDTO.success) {
                const fullErrorMessage = createImpactDTO.error.errors
                    .map((error) => error.message)
                    .join(", ");
                return res.status(400).json({ error: fullErrorMessage });
            }
            const newImpact = await prisma_1.prisma.impacts.create({
                data: {
                    ...createImpactDTO.data,
                    date: new Date(),
                },
            });
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }
            const RECIPIENT_EMAILS = process.env.AUTHORIZED_EMAILS
                ? process.env.AUTHORIZED_EMAILS.split(",")
                : [];
            const transporter = nodemailer.createTransport({
                host: "mail.privateemail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "vitor@ligacolaborativa.site",
                    pass: process.env.PASSWORD_EMAIL,
                },
            });
            const emailHtml = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Novo Impacto Criado</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #d3d3d3;">
                <table
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                >
                <tr>
                    <td align="center" style="padding: 20px;">
                    <table
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="background-color: #ffffff; padding: 20px;"
                    >
                        <tr>
                        <td
                            align="center"
                            style="padding: 40px 20px; font-family: Arial, sans-serif; color: #333333;"
                        >
                            <img
                            src="https://rclimaticas-fileupload.s3.sa-east-1.amazonaws.com/logoLC-DRqUmzjb.png"
                            width="100"
                            alt="Logo"
                            style="display: block;"
                            />
                            <h2 style="color: #4A90E2; font-size: 28px;">
                            Olá Ligador, novo Impacto criado!
                            </h2>
                            <p
                            style="font-size: 25px; line-height: 1.6; text-align: center;"
                            >
                            Assunto: ${createImpactDTO.data.subject}<br />
                            Urgência: ${createImpactDTO.data.urgency}<br />
                            Localidade: ${createImpactDTO.data.locality}<br />
                            Suporte: ${createImpactDTO.data.support}<br />
                            Comunidade Afetada: ${createImpactDTO.data.affectedCommunity}<br />
                            Biomas: ${createImpactDTO.data.biomes}<br />
                            Situação: ${createImpactDTO.data.situation}<br />
                            Contribuição: ${createImpactDTO.data.contribution}<br />
                            Nome do Usuário: ${user.username}<br />
                            E-mail do Usuário: ${user.email}<br />
                            </p>
                        </td>
                        </tr>
                        <tr>
                        <td
                            align="center"
                            style="padding: 40px 20px; font-family: Arial, sans-serif; color: #333333;"
                        >
                            <p
                            style="font-size: 25px; line-height: 1.6; text-align: center;"
                            >
                            Atenciosamente, <br />
                            Equipe da Liga.
                            </p>
                        </td>
                        </tr>
                        <tr>
                        <td
                            align="center"
                            style="padding: 20px; font-family: Arial, sans-serif; color: #777777; font-size: 16px;"
                        >
                            <p>
                            &copy; 2025 Liga Colaborativa dos Povos. Todos os direitos
                            reservados.
                            </p>
                            <p>
                            <a
                                href="https://www.instagram.com/aliga.on/"
                                style="margin: 0 10px;"
                            >
                                <img
                                src="https://img.icons8.com/?size=100&id=g7SBGFwja0xa&format=png&color=000000"
                                width="30"
                                alt="Instagram"
                                style="display: inline-block;"
                                />
                            </a>
                            <a
                                href="https://www.youtube.com/@ligacolaborativa"
                                style="margin: 0 10px;"
                            >
                                <img
                                src="https://img.icons8.com/?size=100&id=37325&format=png&color=000000"
                                width="30"
                                alt="YouTube"
                                style="display: inline-block;"
                                />
                            </a>
                            </p>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
            </body>
            </html>
            `;
            for (const email of RECIPIENT_EMAILS) {
                let mailOptions = {
                    from: "contato@ligacolaborativa.site",
                    to: email,
                    subject: "Novo Impacto Criado",
                    html: emailHtml,
                };
                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`E-mail enviado para: ${email}`);
                }
                catch (error) {
                    console.error(`Erro ao enviar e-mail para: ${email}`, error);
                }
            }
            res.status(201).json(newImpact);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao criar o impacto." });
        }
    }
}
exports.ImpactsCreateController = ImpactsCreateController;

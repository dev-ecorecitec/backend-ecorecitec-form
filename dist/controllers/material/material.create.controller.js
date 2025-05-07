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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialCreateController = void 0;
const prisma_1 = require("../../utils/prisma");
const nodemailer = __importStar(require("nodemailer"));
const create_material_dto_1 = require("./dto/create-material.dto");
class MaterialCreateController {
    async store(req, res) {
        const result = create_material_dto_1.CreateMaterialSchemaDTO.safeParse(req.body);
        if (!result.success) {
            const fullErrorMessage = result.error.errors
                .map((error) => error.message)
                .join(", ");
            return res.status(400).json({ error: fullErrorMessage });
        }
        try {
            const newMaterial = await prisma_1.prisma.material.create({
                data: {
                    ...result.data,
                    date: new Date(),
                },
            });
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "vitorsilva@aluno.ufrb.edu.br",
                    pass: process.env.PASSWORD_EMAIL,
                },
            });
            let mailOptions = {
                from: "r.climaticas@gmail.com",
                to: "rafael@gamba.org.br",
                subject: "📚 Novo Artigo Enviado para Análise.",
                text: `
                Um Artigo foi criado com os seguintes detalhes:
                Nome do usuário: ${result.data.name}
                Email do Usuário: ${result.data.email}
                Tipo de Publicação: ${result.data.publicationType}
                Descrição: ${result.data.description}
                Assunto: ${result.data.subjectType}
                Link do Artigo: ${result.data.fileUrl}
                Data: ${new Date().toISOString()}
                `,
            };
            await transporter.sendMail(mailOptions);
            res.status(201).json(newMaterial);
        }
        catch (error) {
            console.error("Erro ao criar o material:", error);
            res.status(500).json({ error: "Erro ao criar o material." });
        }
    }
}
exports.MaterialCreateController = MaterialCreateController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentDTO = void 0;
const zod_1 = require("zod");
exports.CreatePaymentDTO = zod_1.z.object({
    nome: zod_1.z
        .string()
        .min(3, "Digite seu nome completo como consta em seus documentos oficiais. Este nome aparecerá no certificado do evento.")
        .refine((nome) => nome.trim().split(" ").length >= 2, "O nome deve conter pelo menos nome e sobrenome"),
    telefone: zod_1.z
        .string()
        .regex(/^\d{10,15}$/, "O telefone deve ter entre 10 e 15 dígitos. Exemplo: (XX) XXXXX-XXXX"),
    email: zod_1.z
        .string()
        .email("Informe um email válido que você acessa regularmente. Este email será usado para enviar seu certificado.")
        .transform((email) => email.toLowerCase().trim()),
    pais: zod_1.z.string().optional(),
    cidade: zod_1.z.string().optional(),
    cpf: zod_1.z
        .string()
        .regex(/^\d{11}$/, "O CPF deve conter exatamente 11 números. Exemplo: XXX.XXX.XXX-XX"),
    linkedin: zod_1.z.string().url("URL do LinkedIn inválida. Exemplo: https://linkedin.com/in/seu-perfil").optional(),
    empresa: zod_1.z.string().optional(),
    cargo: zod_1.z.string().optional(),
    participar_teste: zod_1.z.string().optional(),
    disp_teste: zod_1.z.string().optional(),
    indicacao: zod_1.z.string().optional(),
    expectativas: zod_1.z.string().optional(),
    amount: zod_1.z.number().positive("O valor deve ser um número positivo").optional(),
    participant_type: zod_1.z.string().optional(),
    router: zod_1.z.string().optional(),
});

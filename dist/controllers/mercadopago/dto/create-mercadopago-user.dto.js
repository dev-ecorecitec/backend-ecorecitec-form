"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentDTO = void 0;
const zod_1 = require("zod");
exports.CreatePaymentDTO = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, "O nome precisa ter pelo menos 3 caracteres")
        .refine((name) => name.trim().split(" ").length >= 2, "O nome deve conter pelo menos nome e sobrenome"),
    email: zod_1.z
        .string()
        .email("Email inválido")
        .transform((email) => email.toLowerCase().trim()),
    telefone: zod_1.z
        .string()
        .regex(/^\d{10,15}$/, "O telefone deve ter entre 10 e 15 dígitos"),
    cpf: zod_1.z
        .string()
        .regex(/^\d{11}$/, "O CPF deve conter exatamente 11 números"),
    pais: zod_1.z.string().optional(),
    cidade: zod_1.z.string().optional(),
    linkedin: zod_1.z.string().url("URL do LinkedIn inválida").optional(),
    empresa: zod_1.z.string().optional(),
    cargo: zod_1.z.string().optional(),
    amount: zod_1.z.number().positive("O valor deve ser um número positivo"),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentDTO = void 0;
const zod_1 = require("zod");
exports.CreatePaymentDTO = zod_1.z.object({
    name: zod_1.z.string().min(3, "O nome precisa ter pelo menos 3 caracteres"),
    email: zod_1.z.string().email("Email inválido"),
    valor: zod_1.z.number().positive("O valor precisa ser um número positivo"),
});

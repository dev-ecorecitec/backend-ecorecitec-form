"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserRequestDTO = void 0;
const zod_1 = require("zod");
exports.RegisterUserRequestDTO = zod_1.z.object({
    email: zod_1.z.string().email("Email inválido"),
    password: zod_1.z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    name: zod_1.z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
});

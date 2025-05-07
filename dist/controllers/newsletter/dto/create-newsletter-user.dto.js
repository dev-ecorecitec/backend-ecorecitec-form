"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNewsletterUserDTO = void 0;
const zod_1 = require("zod");
exports.CreateNewsletterUserDTO = zod_1.z.object({
    name: zod_1.z.string().min(3, "O nome precisa ter mais de 3 caracteres"),
    email: zod_1.z.string().email("Email inválido"),
});

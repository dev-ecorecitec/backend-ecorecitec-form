"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMaterialSchemaDTO = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CreateMaterialSchemaDTO = zod_1.default.object({
    name: zod_1.default.string().min(1, "Nome é obrigatório"),
    email: zod_1.default.string().email("Email inválido"),
    publicationType: zod_1.default.string().min(1, "Tipo de publicação é obrigatório"),
    subjectType: zod_1.default.string().min(1, "Assunto é obrigatório"),
    fileUrl: zod_1.default.string().url("URL do arquivo inválida"),
    description: zod_1.default
        .string()
        .max(280, "A descrição não pode ter mais que 280 caracteres"),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateImpactDTO = void 0;
const zod_1 = require("zod");
exports.CreateImpactDTO = zod_1.z.object({
    subject: zod_1.z.string().min(1, { message: "Assunto é obrigatório" }),
    urgency: zod_1.z.string().min(1, { message: "Urgência é obrigatória" }),
    locality: zod_1.z.string().min(1, { message: "Localidade é obrigatória" }),
    support: zod_1.z.string().min(1, { message: "Suporte é obrigatório" }),
    affectedCommunity: zod_1.z.array(zod_1.z.string()).min(1, {
        message: "Pelo menos uma comunidade afetada deve ser selecionada",
    }),
    biomes: zod_1.z
        .array(zod_1.z.string())
        .min(1, { message: "Pelo menos um bioma deve ser selecionado" }),
    situation: zod_1.z.string().min(1, { message: "Situação é obrigatória" }),
    contribution: zod_1.z.string().min(1, { message: "Contribuição é obrigatória" }),
    date: zod_1.z.string({ message: "Data inválida ou indefinida" }).refine((data) => {
        const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        return timestampRegex.test(data);
    }, {
        message: "Data deve estar no formato: YYYY-MM-DDTHH:mm:ss.sssZ",
    }),
    userId: zod_1.z.number({ required_error: "ID do usuário é obrigatório" }),
    validated: zod_1.z.number().optional(),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateImpactDTO = void 0;
const zod_1 = require("zod");
const create_impact_dto_1 = require("./create-impact.dto");
// Usa a lógica do utility type Partial<> do typescript para converter o DTO de criação de impacto para um de atualização de impacto
exports.UpdateImpactDTO = zod_1.z.object(Object.fromEntries(Object.entries(create_impact_dto_1.CreateImpactDTO.shape).map(([key, value]) => [
    key,
    value.optional(),
])));

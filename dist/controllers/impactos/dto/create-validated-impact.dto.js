"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateValidatedImpactDTO = void 0;
const zod_1 = require("zod");
exports.CreateValidatedImpactDTO = zod_1.z.object({
    subject: zod_1.z.string(),
    urgency: zod_1.z.string(),
    locality: zod_1.z.string(),
    support: zod_1.z.string(),
    affectedCommunity: zod_1.z.array(zod_1.z.string()),
    biomes: zod_1.z.array(zod_1.z.string()),
    situation: zod_1.z.string(),
    contribution: zod_1.z.string(),
    date: zod_1.z.date(),
    userId: zod_1.z.number()
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = void 0;
const zod_1 = require("zod");
exports.UpdateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email().optional(),
    username: zod_1.z.string().optional(),
    name: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    whatsapp: zod_1.z.string().optional(),
    gender: zod_1.z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    instagram: zod_1.z.string().optional(),
    twitter: zod_1.z.string().optional(),
    linkedin: zod_1.z.string().optional(),
    facebook: zod_1.z.string().optional(),
    areaOfInterest: zod_1.z.array(zod_1.z.string()).optional(),
    contributionAxis: zod_1.z.array(zod_1.z.string()).optional(),
    weeklyAvailability: zod_1.z.number().optional(),
    themesBiomes: zod_1.z.array(zod_1.z.string()).optional(),
    themesCommunities: zod_1.z.array(zod_1.z.string()).optional(),
    imageBase64: zod_1.z.string().optional(),
    roles: zod_1.z.array(zod_1.z.string()).optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    organization: zod_1.z.string().optional(),
    peoples: zod_1.z.array(zod_1.z.string()).optional(),
    metamaskAddress: zod_1.z.string().optional(),
});

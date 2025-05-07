"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMaterialDTO = void 0;
const zod_1 = require("zod");
const create_material_dto_1 = require("./create-material.dto");
exports.UpdateMaterialDTO = zod_1.z.object(Object.fromEntries(Object.entries(create_material_dto_1.CreateMaterialSchemaDTO.shape).map(([key, value]) => [
    key,
    value.optional(),
])));

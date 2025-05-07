"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleLoginDTO = void 0;
const zod_1 = require("zod");
exports.GoogleLoginDTO = zod_1.z.object({
    tokenGoogle: zod_1.z.string().min(1, "Token do Google é necessário!"),
});

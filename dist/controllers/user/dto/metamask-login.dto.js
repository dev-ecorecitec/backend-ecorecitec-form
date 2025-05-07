"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetamaskLoginDTO = void 0;
const zod_1 = require("zod");
exports.MetamaskLoginDTO = zod_1.z
    .object({
    metamaskAddress: zod_1.z
        .string()
        .min(42, "Endereço de carteira inválido")
        .optional(),
    address: zod_1.z.string().min(42, "Endereço de carteira inválido").optional(),
})
    .refine((data) => {
    if (data.metamaskAddress &&
        !/^0x[a-fA-F0-9]{40}$/.test(data.metamaskAddress)) {
        return false;
    }
    if (data.address && !/^0x[a-fA-F0-9]{40}$/.test(data.address)) {
        return false;
    }
    return true;
}, { message: "Endereço de carteira inválido!" });

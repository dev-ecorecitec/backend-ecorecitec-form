"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleLoginController = void 0;
const prisma_1 = require("../../utils/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const bcrypt = __importStar(require("bcrypt"));
const google_login_dto_1 = require("./dto/google-login.dto");
dotenv_1.default.config();
class GoogleLoginController {
    constructor() {
        this.authorizedEmails = process.env.AUTHORIZED_EMAILS
            ? process.env.AUTHORIZED_EMAILS.split(",")
            : [];
        this.authenticate = this.authenticate.bind(this);
    }
    async authenticate(req, res) {
        const googleLoginDTO = google_login_dto_1.GoogleLoginDTO.safeParse(req.body);
        if (!googleLoginDTO.success) {
            const fullErrorMessage = googleLoginDTO.error.errors.map((error) => error.message);
            return res.status(400).json({ error: fullErrorMessage.join(", ") });
        }
        const { tokenGoogle } = googleLoginDTO.data;
        try {
            const userInfoResponse = await axios_1.default.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenGoogle}`);
            const { email, name, picture } = userInfoResponse.data;
            let user = await prisma_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                const encryptedAPIPassword = await bcrypt.hash(process.env.API_PASSWORD, 8);
                user = await prisma_1.prisma.user.create({
                    data: {
                        email: email || "",
                        username: name || "Usuário do Google",
                        imageBase64: picture || "",
                        password: encryptedAPIPassword,
                        metamaskAddress: null,
                    },
                });
            }
            const role = this.authorizedEmails.includes(email) ? "admin" : "user";
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: role }, process.env.SECRET_KEY, { expiresIn: "1d" });
            res.cookie("authToken", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000, // 24 horas
            });
            const userWithToken = {
                ...user,
                token,
                role,
            };
            return res.json({
                message: "Login bem-sucedido com Google!",
                user: userWithToken,
            });
        }
        catch (error) {
            console.error("Erro na autenticação com Google:", error);
            return res.status(500).json({ error: "Erro ao autenticar com Google." });
        }
    }
}
exports.GoogleLoginController = GoogleLoginController;

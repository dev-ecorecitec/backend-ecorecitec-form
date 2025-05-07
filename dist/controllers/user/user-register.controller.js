"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterController = void 0;
const prisma_1 = require("../../utils/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const register_user_dto_1 = require("./dto/register-user.dto");
class UserRegisterController {
    async store(req, res) {
        const registerUserDTO = register_user_dto_1.RegisterUserRequestDTO.safeParse(req.body);
        if (!registerUserDTO.success) {
            const fullErrorMessage = registerUserDTO.error.errors.map((error) => error.message);
            return res.status(400).json({ error: fullErrorMessage.join(", ") });
        }
        const { email, password, name } = registerUserDTO.data;
        const userByEmail = await prisma_1.prisma.user.count({ where: { email } });
        if (userByEmail) {
            return res.status(400).json({ error: "E-mail já está em uso!" });
        }
        const hash_password = await bcryptjs_1.default.hash(password, 8);
        let username = name.toLowerCase().replace(/\s+/g, "_");
        let uniqueUsername = username;
        const existentUser = await prisma_1.prisma.user.findUnique({
            where: { username: uniqueUsername },
        });
        if (existentUser) {
            // conta pessoas com mesmo nome de usuário no banco de dados
            const usersWithSameUsername = await prisma_1.prisma.user.count({
                where: {
                    username: {
                        startsWith: username,
                    },
                },
            });
            uniqueUsername = `${username}${usersWithSameUsername + 1}`;
        }
        const user = await prisma_1.prisma.user.create({
            data: {
                email,
                username: uniqueUsername,
                password: hash_password,
                name,
                metamaskAddress: null,
            },
        });
        return res.status(201).json({ user });
    }
}
exports.UserRegisterController = UserRegisterController;

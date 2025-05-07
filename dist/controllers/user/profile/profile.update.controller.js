"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileUpdateController = void 0;
const prisma_1 = require("../../../utils/prisma");
const update_profile_dto_1 = require("../dto/update-profile.dto");
class ProfileUpdateController {
    async update(req, res) {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        const updateUserDTO = update_profile_dto_1.UpdateUserSchema.safeParse(req.body);
        if (!updateUserDTO.success) {
            const fullErrorMessage = updateUserDTO.error.errors.map((error) => error.message);
            return res.status(400).json({ error: fullErrorMessage.join(", ") });
        }
        try {
            const updatedUser = await prisma_1.prisma.user.update({
                where: { id: parseInt(userId) },
                data: {
                    ...updateUserDTO.data,
                },
            });
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error("Erro ao atualizar os dados do usuário:", error);
            res.status(500).json({ error: "Erro ao atualizar os dados do usuário." });
        }
    }
}
exports.ProfileUpdateController = ProfileUpdateController;

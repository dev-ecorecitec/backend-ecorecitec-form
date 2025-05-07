"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialUpdateController = void 0;
const prisma_1 = require("../../utils/prisma");
const update_material_dto_1 = require("./dto/update-material.dto");
class MaterialUpdateController {
    async update(req, res) {
        const materialId = parseInt(req.params.id);
        const result = update_material_dto_1.UpdateMaterialDTO.safeParse(req.body);
        if (!result.success) {
            const fullErrorMessage = result.error.errors
                .map((error) => error.message)
                .join(", ");
            return res.status(400).json({ error: fullErrorMessage });
        }
        try {
            const updatedMaterial = await prisma_1.prisma.material.update({
                where: { id: materialId },
                data: {
                    ...result.data,
                },
            });
            res.json(updatedMaterial);
        }
        catch (error) {
            res.status(500).json({ error: "Erro ao atualizar o material." });
        }
    }
}
exports.MaterialUpdateController = MaterialUpdateController;

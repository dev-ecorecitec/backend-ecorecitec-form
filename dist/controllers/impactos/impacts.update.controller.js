"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactsUpdateController = void 0;
const prisma_1 = require("../../utils/prisma");
const update_impact_dto_1 = require("./dto/update-impact.dto");
class ImpactsUpdateController {
    async update(req, res) {
        const { id } = req.params;
        const updateImpactDTO = update_impact_dto_1.UpdateImpactDTO.safeParse(req.body);
        if (!updateImpactDTO.success) {
            const fullErrorMessage = updateImpactDTO.error.errors
                .map((error) => error.message)
                .join(", ");
            return res.status(400).json({ error: fullErrorMessage });
        }
        try {
            const existingImpact = await prisma_1.prisma.impacts.findUnique({
                where: { id: Number(id) },
            });
            if (!existingImpact) {
                return res.status(404).json({ message: "Impacto não encontrado." });
            }
            const updatedImpact = await prisma_1.prisma.impacts.update({
                where: { id: Number(id) },
                data: {
                    ...updateImpactDTO.data,
                    date: new Date(),
                },
            });
            res.status(200).json({
                message: "Impacto atualizado com sucesso.",
                impact: updatedImpact,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao atualizar o impacto." });
        }
    }
}
exports.ImpactsUpdateController = ImpactsUpdateController;

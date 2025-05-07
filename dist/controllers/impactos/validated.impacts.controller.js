"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatedImpactsController = void 0;
const prisma_1 = require("../../utils/prisma");
const create_validated_impact_dto_1 = require("./dto/create-validated-impact.dto");
class ValidatedImpactsController {
    async store(req, res) {
        const createValidatedImpactDTO = create_validated_impact_dto_1.CreateValidatedImpactDTO.safeParse(req.body);
        if (!createValidatedImpactDTO.success) {
            const fullErrorMessage = createValidatedImpactDTO.error.errors
                .map((error) => error.message)
                .join(", ");
            return res.status(400).json({ error: fullErrorMessage });
        }
        try {
            const impactValidated = await prisma_1.prisma.validatedImpacts.create({
                data: {
                    ...createValidatedImpactDTO.data,
                    date: new Date(createValidatedImpactDTO.data.date),
                },
            });
            return res.status(201).json(impactValidated);
        }
        catch (error) {
            console.error("Erro ao processar a requisição ou validar impacto:", error);
            return res.status(500).json({ error: "Erro ao processar a requisição." });
        }
    }
}
exports.ValidatedImpactsController = ValidatedImpactsController;

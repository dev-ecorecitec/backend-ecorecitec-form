"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterDeleteController = void 0;
const prisma_1 = require("../../utils/prisma");
class NewsletterDeleteController {
    constructor() {
        this.deleteAllEmails = async (req, res) => {
            try {
                const existentEmails = await prisma_1.prisma.newsletter.count();
                if (!existentEmails) {
                    return res
                        .status(404)
                        .json({ message: "Nenhum e-mail encontrado para exclusão." });
                }
                await prisma_1.prisma.newsletter.deleteMany();
                return res
                    .status(200)
                    .json({ message: "Todos os e-mails foram removidos da whitelist." });
            }
            catch (error) {
                console.error("Erro ao apagar os e-mails da whitelist:", error);
                return res.status(500).json({ error: "Erro ao processar a requisição." });
            }
        };
    }
}
exports.NewsletterDeleteController = NewsletterDeleteController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeopleController = void 0;
const prisma_1 = require("../../utils/prisma");
const dotenv_1 = __importDefault(require("dotenv"));
const create_people_dto_1 = require("./dto/create-people.dto");
dotenv_1.default.config();
class PeopleController {
    async create(req, res) {
        const result = create_people_dto_1.CreatePeopleSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.format() });
        }
        try {
            // Verifica se já existe um email cadastrado
            const existingEmail = await prisma_1.prisma.people.findUnique({
                where: { email: result.data.email }
            });
            if (existingEmail) {
                return res.status(400).json({ error: "Este email já está cadastrado" });
            }
            const people = await prisma_1.prisma.people.create({
                data: result.data,
            });
            return res.status(201).json(people);
        }
        catch (error) {
            console.error("Erro ao criar pessoa:", error);
            return res.status(500).json({ error: "Erro ao criar pessoa" });
        }
    }
    async list(req, res) {
        try {
            const people = await prisma_1.prisma.people.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return res.status(200).json(people);
        }
        catch (error) {
            console.error("Erro ao listar pessoas:", error);
            return res.status(500).json({ error: "Erro ao listar pessoas" });
        }
    }
    async getById(req, res) {
        const { id } = req.params;
        try {
            const person = await prisma_1.prisma.people.findUnique({
                where: { id: Number(id) },
            });
            if (!person) {
                return res.status(404).json({ error: "Pessoa não encontrada" });
            }
            return res.status(200).json(person);
        }
        catch (error) {
            console.error("Erro ao buscar pessoa:", error);
            return res.status(500).json({ error: "Erro ao buscar pessoa" });
        }
    }
    async update(req, res) {
        const { id } = req.params;
        const result = create_people_dto_1.CreatePeopleSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.format() });
        }
        try {
            const existingPerson = await prisma_1.prisma.people.findUnique({
                where: { id: Number(id) }
            });
            if (!existingPerson) {
                return res.status(404).json({ error: "Pessoa não encontrada" });
            }
            if (result.data.email !== existingPerson.email) {
                const emailInUse = await prisma_1.prisma.people.findUnique({
                    where: { email: result.data.email }
                });
                if (emailInUse) {
                    return res.status(400).json({ error: "Este email já está em uso" });
                }
            }
            const updatedPerson = await prisma_1.prisma.people.update({
                where: { id: Number(id) },
                data: result.data,
            });
            return res.status(200).json(updatedPerson);
        }
        catch (error) {
            console.error("Erro ao atualizar pessoa:", error);
            return res.status(500).json({ error: "Erro ao atualizar pessoa" });
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            const existingPerson = await prisma_1.prisma.people.findUnique({
                where: { id: Number(id) }
            });
            if (!existingPerson) {
                return res.status(404).json({ error: "Pessoa não encontrada" });
            }
            await prisma_1.prisma.people.delete({
                where: { id: Number(id) },
            });
            return res.status(200).json({ message: "Pessoa excluída com sucesso" });
        }
        catch (error) {
            console.error("Erro ao excluir pessoa:", error);
            return res.status(500).json({ error: "Erro ao excluir pessoa" });
        }
    }
}
exports.PeopleController = PeopleController;

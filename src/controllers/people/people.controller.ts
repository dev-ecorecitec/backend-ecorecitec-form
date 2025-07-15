import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import dotenv from "dotenv";
import { CreatePeopleSchema } from "./dto/create-people.dto";
import { saveToExcel } from "../../services/save-to-excel";

dotenv.config();

export class PeopleController {
  async create(req: Request, res: Response) {
    const result = CreatePeopleSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.format() });
    }

    try {
      // Verifica se já existe um email cadastrado
      const existingEmail = await prisma.people.findUnique({
        where: { email: result.data.email }
      });

      if (existingEmail) {
        return res.status(400).json({ error: "Este email já está cadastrado" });
      }

      const people = await prisma.people.create({
        data: result.data,
      });

      // Adiciona a data da inscrição do usuario:
      const excelData = [{
        Nome: people.name,
        Telefone: people.telefone,
        Email: people.email,
        CPF: people.cpf,
        País: people.pais,
        Cidade: people.cidade,
        LinkedIn: people.linkedin,
        Empresa: people.empresa,
        Cargo: people.cargo,
        "Teste gratuito do método de mindset": people.participarSelecaoMindset,
        "Disponibilidade de horário para o teste": people.disponibilidadeHorarioTeste,
        Indicação: people.indicacao || "",
        Expectativas: people.expectativas || "",
        "Data de inscrição": new Date().toLocaleString("pt-BR", { timeZone: "America/Bahia" })
      }];

      await saveToExcel(excelData);

      return res.status(201).json(people);
    } catch (error) {
      console.error("Erro ao criar pessoa:", error);
      return res.status(500).json({ error: "Erro ao criar pessoa" });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const people = await prisma.people.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      return res.status(200).json(people);
    } catch (error) {
      console.error("Erro ao listar pessoas:", error);
      return res.status(500).json({ error: "Erro ao listar pessoas" });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const person = await prisma.people.findUnique({
        where: { id: Number(id) },
      });

      if (!person) {
        return res.status(404).json({ error: "Pessoa não encontrada" });
      }

      return res.status(200).json(person);
    } catch (error) {
      console.error("Erro ao buscar pessoa:", error);
      return res.status(500).json({ error: "Erro ao buscar pessoa" });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const result = CreatePeopleSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.format() });
    }

    try {
      const existingPerson = await prisma.people.findUnique({
        where: { id: Number(id) }
      });

      if (!existingPerson) {
        return res.status(404).json({ error: "Pessoa não encontrada" });
      }

      if (result.data.email !== existingPerson.email) {
        const emailInUse = await prisma.people.findUnique({
          where: { email: result.data.email }
        });

        if (emailInUse) {
          return res.status(400).json({ error: "Este email já está em uso" });
        }
      }

      const updatedPerson = await prisma.people.update({
        where: { id: Number(id) },
        data: result.data,
      });

      return res.status(200).json(updatedPerson);
    } catch (error) {
      console.error("Erro ao atualizar pessoa:", error);
      return res.status(500).json({ error: "Erro ao atualizar pessoa" });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const existingPerson = await prisma.people.findUnique({
        where: { id: Number(id) }
      });

      if (!existingPerson) {
        return res.status(404).json({ error: "Pessoa não encontrada" });
      }

      await prisma.people.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({ message: "Pessoa excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir pessoa:", error);
      return res.status(500).json({ error: "Erro ao excluir pessoa" });
    }
  }
}
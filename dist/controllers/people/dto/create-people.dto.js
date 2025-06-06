"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePeopleSchema = void 0;
const zod_1 = require("zod");
exports.CreatePeopleSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Nome é obrigatório"),
    email: zod_1.z.string()
        .email("Email inválido")
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Formato de email inválido"),
    telefone: zod_1.z.string().min(10, "O telefone deve ter entre 10 e 15 dígitos. Exemplo: (XX) XXXXX-XXXX").max(15),
    cpf: zod_1.z.string()
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato 000.000.000-00"),
    pais: zod_1.z.string().min(1, "País é obrigatório"),
    cidade: zod_1.z.string().min(1, "Cidade é obrigatória"),
    linkedin: zod_1.z.string()
        .regex(/^https?:\/\/(www\.)?linkedin\.com\/.*$/i, "URL do LinkedIn inválida"),
    empresa: zod_1.z.string().min(1, "Empresa é obrigatória"),
    cargo: zod_1.z.string().min(1, "Cargo é obrigatório"),
    participarSelecaoMindset: zod_1.z.string().min(1, "Informe se gostaria de participar da seleção para o teste gratuito do método de mindset."),
    disponibilidadeHorarioTeste: zod_1.z.string().min(1, "Informe se pode disponibilizar um horário de 15 min para fazer o teste."),
    indicacao: zod_1.z.string().optional(),
    expectativas: zod_1.z.string().optional(),
    participant_type: zod_1.z.string().min(1, "Tipo de participante é obrigatório")
});

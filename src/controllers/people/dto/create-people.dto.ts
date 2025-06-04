import { z } from "zod";

export const CreatePeopleSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string()
    .email("Email inválido")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Formato de email inválido"
    ),
  telefone: z.string().min(10, "O telefone deve ter entre 10 e 15 dígitos. Exemplo: (XX) XXXXX-XXXX").max(15),
  cpf: z.string()
    .regex(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      "CPF deve estar no formato 000.000.000-00"
    ),
  pais: z.string().min(1, "País é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  linkedin: z.string()
    .regex(
      /^https?:\/\/(www\.)?linkedin\.com\/.*$/i,
      "URL do LinkedIn inválida"
    ),
  empresa: z.string().min(1, "Empresa é obrigatória"),
  cargo: z.string().min(1, "Cargo é obrigatório"),
  participarSelecaoMindset: z.enum(["Sim", "Não"], {
    errorMap: () => ({ message: "Informe se gostaria de participar da seleção para o teste gratuito do método de mindset." })
  }),
  disponibilidadeHorarioTeste: z.enum(["Sim", "Não"], {
    errorMap: () => ({ message: "Informe se pode disponibilizar um horário de 15 min para fazer o teste." })
  }),
  indicacao: z.string().optional(),
  expectativas: z.string().optional(),
  participant_type: z.string().min(1, "Tipo de participante é obrigatório")
});

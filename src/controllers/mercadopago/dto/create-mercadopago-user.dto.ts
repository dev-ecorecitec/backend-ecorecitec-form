import { z } from "zod";

export const CreatePaymentDTO = z.object({
  name: z
    .string()
    .min(3, "Digite seu nome completo como consta em seus documentos oficiais. Este nome aparecerá no certificado do evento.")
    .refine(
      (name) => name.trim().split(" ").length >= 2,
      "O nome deve conter pelo menos nome e sobrenome"
    ),
  email: z
    .string()
    .email("Informe um email válido que você acessa regularmente. Este email será usado para enviar seu certificado.")
    .transform((email) => email.toLowerCase().trim()),
  telefone: z
    .string()
    .regex(/^\d{10,15}$/, "O telefone deve ter entre 10 e 15 dígitos. Exemplo: (XX) XXXXX-XXXX"),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "O CPF deve conter exatamente 11 números. Exemplo: XXX.XXX.XXX-XX"),
  pais: z.string().optional(),
  cidade: z.string().optional(),
  linkedin: z.string().url("URL do LinkedIn inválida. Exemplo: https://linkedin.com/in/seu-perfil").optional(),
  empresa: z.string().optional(),
  cargo: z.string().optional(),
  participarSelecaoMindset: z.enum(["Sim", "Não"], {
    required_error: "Informe se gostaria de participar da seleção para o teste gratuito do método de mindset.",
    invalid_type_error: "Valor inválido para a seleção do teste gratuito do método de mindset.",
  }),
  disponibilidadeHorarioTeste: z.enum(["Sim", "Não"], {
    required_error: "Informe se pode disponibilizar um horário de 15 min para fazer o teste.",
    invalid_type_error: "Valor inválido para a disponibilidade de horário.",
  }),
  indicacao: z.string().optional(),
  expectativas: z.string().optional(),
  amount: z.number().positive("O valor deve ser um número positivo").optional(),
});

export type CreatePaymentDTOType = z.infer<typeof CreatePaymentDTO>;
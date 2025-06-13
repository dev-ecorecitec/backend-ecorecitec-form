import { z } from "zod";

export const CreatePaymentDTO = z.object({
  nome: z
    .string()
    .min(3, "Digite seu nome completo como consta em seus documentos oficiais. Este nome aparecerá no certificado do evento.")
    .refine(
      (nome) => nome.trim().split(" ").length >= 2,
      "O nome deve conter pelo menos nome e sobrenome"
    ),
  telefone: z
    .string()
    .regex(/^\d{10,15}$/, "O telefone deve ter entre 10 e 15 dígitos. Exemplo: (XX) XXXXX-XXXX"),
  email: z
    .string()
    .email("Informe um email válido que você acessa regularmente. Este email será usado para enviar seu certificado.")
    .transform((email) => email.toLowerCase().trim()),
  pais: z.string().optional(),
  cidade: z.string().optional(),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "O CPF deve conter exatamente 11 números. Exemplo: XXX.XXX.XXX-XX"),
  linkedin: z.string().url("URL do LinkedIn inválida. Exemplo: https://linkedin.com/in/seu-perfil").optional(),
  empresa: z.string().optional(),
  cargo: z.string().optional(),
  participar_teste: z.string().optional(),
  disp_teste: z.string().optional(),
  indicacao: z.string().optional(),
  expectativas: z.string().optional(),
  amount: z.number().positive("O valor deve ser um número positivo").optional(),
  participant_type: z.string().optional(),
  router: z.string().optional(),
});

export type CreatePaymentDTOType = z.infer<typeof CreatePaymentDTO>;
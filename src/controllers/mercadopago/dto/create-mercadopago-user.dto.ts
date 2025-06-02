import { z } from "zod";

export const CreatePaymentDTO = z.object({
  name: z
    .string()
    .min(3, "O nome precisa ter pelo menos 3 caracteres")
    .refine(
      (name) => name.trim().split(" ").length >= 2,
      "O nome deve conter pelo menos nome e sobrenome"
    ),
  email: z
    .string()
    .email("Email inválido")
    .transform((email) => email.toLowerCase().trim()),
  telefone: z
    .string()
    .regex(/^\d{10,15}$/, "O telefone deve ter entre 10 e 15 dígitos"),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "O CPF deve conter exatamente 11 números"),
  pais: z.string().optional(),
  cidade: z.string().optional(),
  linkedin: z.string().url("URL do LinkedIn inválida").optional(),
  empresa: z.string().optional(),
  cargo: z.string().optional(),
  amount: z.number().positive("O valor deve ser um número positivo"),
});

export type CreatePaymentDTOType = z.infer<typeof CreatePaymentDTO>;
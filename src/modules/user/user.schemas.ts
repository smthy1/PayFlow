import { z } from 'zod';
import type { Request } from 'express';

export const createUserSchema = z.object({
    name: z.string()
        .min(4, 'O nome deve ter pelo menos 4 caracteres')
        .max(20, 'O nome deve ter no máximo 20 caracteres'),
    email: z.email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
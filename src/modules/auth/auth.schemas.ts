import { z } from 'zod';

export const registerUserSchema = z.object({
    name: z.string()
        .min(4, 'O nome deve ter pelo menos 4 caracteres')
        .max(20, 'O nome deve ter no máximo 20 caracteres'),
    email: z.email({ error: 'Formato de email inválido' }).nonempty({ error: 'Formato de email inválido' }),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export const loginUserSchema = z.object({
    email: z.email({ error: 'Formato de email inválido' }).nonempty({ error: 'Campo de email obrigatório' }),
    password: z.string().nonempty({ error: 'Campo de senha obrigatório' })
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
import { z } from 'zod';

export const registerUserSchema = z.object({
    name: z.string({ error: 'Formato inválido' })
        .trim()
        .min(4, 'O nome deve ter pelo menos 4 caracteres')
        .max(30, 'O nome deve ter no máximo 30 caracteres'),
        
    email: z.email({ error: 'Formato de email inválido' })
        .trim()
        .toLowerCase(),

    password: z.string({ error: 'Formato inválido' })
        .min(6, 'A senha deve ter no mínimo 6 caracteres')
        .max(40, 'A senha deve ter no máximo 50 caracteres')
        .refine(pass => !pass.includes(' '), { error: 'A senha não pode conter espaços' })
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\[\]\/\\]).*$/,
            'A senha deve conter ao menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial'
        )
});

export const loginUserSchema = z.object({
    email: z.email({ error: 'Formato de email inválido' }).trim(),
    password: z.string().min(1, 'Campo de senha obrigatório')
});

export const authResponseSchema = z.object({
    message: z.string(),
});


export const forgotPasswordSchema = z.object({
    email: z.email({ error: 'Formato de email inválido' })
        .trim()
        .toLowerCase(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type ForgotPasswordUserInput = z.infer<typeof forgotPasswordSchema>;
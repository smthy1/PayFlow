import { z } from 'zod';

const emailToResetPasswordSchema = z.object({
    email: z.email({ error: 'Formato de email inválido' })
        .trim()
        .toLowerCase(),
    resetLink: z.string().nonempty('Não pode faltar o reset link')
});

export type EmailToResetPassword = z.infer<typeof emailToResetPasswordSchema>;
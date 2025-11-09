import { z } from 'zod';
import { id } from 'zod/locales';

export const depositSchema = z.object({
    amount: z.number()
        .positive('O valor deve ser maior que zero')
        .max(999999999, 'Valor muito alto')
        .refine((num) => Number.isInteger(num * 100), 'Máximo de duas casas decimais'),
    toUserId: z.string({ error: 'Formado de id inválido' })
});


export const depositResponseSchema = z.object({
    message: z.string()
});


export type DepositInput = z.infer<typeof depositSchema>;
import { z } from 'zod';
import { id } from 'zod/locales';

export const getUserBalanceSchema = z.object({
    id: z.string().nonempty()
});

export const getUserBalanceResponseSchema = z.object({
    balance: z.number()
});


export type GetUserBalanceInput = z.infer<typeof getUserBalanceSchema>;
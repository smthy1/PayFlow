import { z } from 'zod';

export const getUserBalanceSchema = z.object({
    id: z.string().nonempty()
});

export const getUserBalanceResponseSchema = z.object({
    balance: z.string()
});


export type GetUserBalanceInput = z.infer<typeof getUserBalanceSchema>;

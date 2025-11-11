import { z } from 'zod';

export const depositSchema = z.object({
    amount: z.number()
        .positive('O valor deve ser maior que zero')
        .max(999999999, 'Valor muito alto')
        .refine((num) => Number.isInteger(num * 100), 'Máximo de duas casas decimais')
});


export const depositResponseSchema = z.object({
    message: z.string()
});


export const withdrawalDataSchema = z.object({
    withdrawalAmount: z.number(),
    id: z.string()
});


export const withdrawalDataToControllerSchema = z.object({
    withdrawalAmount: z.number()
})



export const transferSchema = z.object({
    fromUserId: z.string(),
    toUserEmail: z.email(),
    transferAmount: z.number()
});

export const transferToControllerSchema = z.object({
    toUserEmail: z.email(),
    transferAmount: z.number()
})


export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawalData = z.infer<typeof withdrawalDataSchema>;
export type WithdrawalDataToController = z.infer<typeof withdrawalDataToControllerSchema>;
export type TransferData = z.infer<typeof transferSchema>;
export type TransferToController = z.infer<typeof transferToControllerSchema>;
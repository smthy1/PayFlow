import { z } from 'zod';

export const depositSchema = z.object({
    amount: z.number()
        .positive('O valor deve ser maior que zero')
        .max(999999999, 'Valor muito alto')
        .refine((num) => {
            const str = num.toString();
            const decimal = (str.split('.')[1] || "").length;
            return decimal <= 2;
        }, 'Máximo de duas casas decimais')
});


export const depositResponseSchema = z.object({
  message: z.string(),
  transactionDetails: z.object({
        type: z.string(),
        amount: z.string(),
        id: z.string(),
        createdAt: z.date(),
        fromUserId: z.string().nullable(),
        toUserId: z.string().nullable(),
    }),
  newUserBalance: z.string()
});


export const withdrawalResponseSchema = z.object({
  message: z.string(),
  transactionDetails: z.object({
        type: z.string(),
        amount: z.string(),
        id: z.string(),
        createdAt: z.date(),
        fromUserId: z.string().nullable(),
        toUserId: z.string().nullable(),
    }),
  newUserBalance: z.string()
});

export const withdrawalDataSchema = z.object({
    withdrawalAmount: z.number(),
    id: z.string()
});

export const withdrawalDataToControllerSchema = z.object({
    withdrawalAmount: z.number()
        .positive('O valor deve ser maior que zero')
        .max(999999999, 'Valor muito alto')
        .refine((num) => {
            const str = num.toString();
            const decimal = (str.split('.')[1] || "").length;
            return decimal <= 2;
        }, 'Máximo de duas casas decimais')
});

export const withdrawalErrorResponseSchema = z.object({
    error: z.string()
});


export const transferSchema = z.object({
    fromUserId: z.string(),
    toUserEmail: z.email(),
    transferAmount: z.number()
});

export const transferSchemaToController = z.object({
    toUserEmail: z.email(),
    transferAmount: z.number()
        .positive('O valor deve ser maior que zero')
        .max(999999999, 'Valor muito alto')
        .refine((num) => {
            const str = num.toString();
            const decimal = (str.split('.')[1] || "").length;
            return decimal <= 2;
        }, 'Máximo de duas casas decimais')
});

export const transferResponseSchema = z.object({
    message: z.string(),
    transactionDetails: z.object({
        type: z.string(),
        amount: z.string(),
        id: z.string(),
        createdAt: z.date(),
        fromUserId: z.string().nullable(),
        toUserId: z.string().nullable(),
    })
});


export type DepositInput = z.infer<typeof depositSchema>;
export type DepositResponse = z.infer<typeof depositResponseSchema>;

export type WithdrawalData = z.infer<typeof withdrawalDataSchema>;
export type WithdrawalDataToController = z.infer<typeof withdrawalDataToControllerSchema>;
export type WithdrawalError = z.infer<typeof withdrawalErrorResponseSchema>;

export type TransferData = z.infer<typeof transferSchema>;
export type TransferToController = z.infer<typeof transferSchemaToController>;
export type SuccessfulTransferResponse = z.infer<typeof transferResponseSchema>;
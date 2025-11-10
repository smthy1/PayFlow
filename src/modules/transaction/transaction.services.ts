import prisma from "../prisma/prisma.services.js";
import type { DepositInput } from "./transaction.schemas.js";
import { convertToCents, convertCentsToBRL } from "../shared/conversion.js";


async function deposit (userInputData: DepositInput, userId: string) {
    try {
        const amount = userInputData.amount;
        const convertedAmount = convertToCents(amount);
        
        const deposit = await prisma.$transaction(async (tx) => {
            
            const user = await tx.user.findUnique({ where: { id: userId }, select: { id: true, balance: true } });
            if (!user) return { error: "Usuário não encontrado" };

            const createTransaction = await tx.transaction.create({
                data: {
                    amount: convertedAmount,
                    type: 'DEPOSIT',
                    toUserId: userId
                }
            });
            
            const updateUserBalance = await tx.user.update({
                where: { id: userId },
                data: {
                    balance: { increment: convertedAmount }
                }
            });

            const newUserBalanceConverted = convertCentsToBRL(updateUserBalance.balance)
            return { message: "Depósito realizado", deposit: createTransaction, user: { newBalance: newUserBalanceConverted } }
        });

        return { message: deposit.message, deposit: deposit.deposit, user: deposit.user };
    } catch (err) {
        return { unexpectedError: err };
    } 
}


export { deposit };
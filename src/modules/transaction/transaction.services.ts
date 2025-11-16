import prisma from "../prisma/prisma.services.js";
import type { DepositInput, TransferData, WithdrawalData } from "./transaction.schemas.js";
import { convertToCents, convertCentsToBRL } from "../shared/conversion.js";
import { Prisma } from "@prisma/client";

async function deposit (userInputData: DepositInput, userId: string) {
    try {
        const amount = userInputData.amount;
        const convertedAmount = convertToCents(amount);
        
        const deposit = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            
            const user = await tx.user.findUnique({ where: { id: userId }, select: { balance: true } });
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

            const newUserBalanceConverted = convertCentsToBRL(updateUserBalance.balance);

            const transactionDetails = {
                type: createTransaction.type,
                amount:`R$ ${newUserBalanceConverted}`,
                id: createTransaction.id,
                createdAt: createTransaction.createdAt,
                fromUserId: createTransaction.fromUserId,
                toUserId: createTransaction.toUserId
            };
            
            return { message: "Depósito realizado", transactionDetails: transactionDetails, newBalance: `R$ ${newUserBalanceConverted}` }
        });

        if(deposit.error) return deposit;

        return { message: deposit.message, transactionDetails: deposit.transactionDetails, newUserBalance: deposit.newBalance };
    } catch (err) {
        return { unexpectedError: err };
    } 
}


async function withdraw(withdrawalData: WithdrawalData) {
    try {
        const { withdrawalAmount , id } = withdrawalData;
        
        const convertedWithdrawal = convertToCents(withdrawalAmount);
        
        const transaction = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            
            const user = await tx.user.findUnique({ where: { id: id }, select: {  balance: true } });
            
            if (!user) return { error: "Usuário não encontrado" };
            if (user.balance < convertedWithdrawal) return { error: "Saldo insuficiente para realizar a transação" };

            const createTransaction = await tx.transaction.create({
                data: {
                    amount: convertedWithdrawal,
                    type: 'WITHDRAW',
                    fromUserId: id
                }
            });

            const updateUserBalance = await tx.user.update({
                where: { id: id },
                data: {
                    balance: { decrement: convertedWithdrawal }
                }
            });

            const newUserBalanceConverted = convertCentsToBRL(updateUserBalance.balance);
            
            const transactionDetails = {
                type: createTransaction.type,
                amount:`R$ ${newUserBalanceConverted}`,
                id: createTransaction.id,
                createdAt: createTransaction.createdAt,
                fromUserId: createTransaction.fromUserId,
                toUserId: createTransaction.toUserId
            };

            return { message: "Saque realizado",  transactionDetails: transactionDetails, newBalance: `R$ ${newUserBalanceConverted}`  };
        });

        if (transaction.error) return transaction;

        return { message: transaction.message, transactionDetails: transaction.transactionDetails, newUserBalance: transaction.newBalance };
    } catch (err) {
        return { unexpectedError: err };
    }
}


async function transfer(transferData: TransferData) {
    const { fromUserId, toUserEmail, transferAmount } = transferData;
    
    const convertedToCentsTransferAmount = convertToCents(transferAmount);

    const transaction = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        
        const fromUser = await tx.user.findUnique({ where: { id: fromUserId }, select: {  balance: true } });
        const toUser = await tx.user.findUnique({ where: { email: toUserEmail }, select: { id: true, balance: true } });
            
        if (!fromUser || !toUser) return { error: "Usuários não encontrados" };

        if (fromUserId === toUser.id) return { error: "Transferências para a própria conta não são permitidas" };

        if (fromUser.balance < convertedToCentsTransferAmount) return { error: "Saldo insuficiente para realizar a transação" };

        const transfer = await tx.transaction.create({
            data:  {
                amount: convertedToCentsTransferAmount,
                fromUserId: fromUserId,
                toUserId: toUser.id,
                type: 'TRANSFER'
            }
        });

        await tx.user.update({
            where: {id: fromUserId},
            data: {
                balance: { decrement: convertedToCentsTransferAmount }
            }
        });

        await tx.user.update({
            where: {id: toUser.id },
            data: {
                balance: { increment: convertedToCentsTransferAmount }
            }
        });

        const treatedTransferAmount = transferAmount.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        const transactionDetails = {
            type: transfer.type,
            amount:`R$ ${treatedTransferAmount}`,
            id: transfer.id,
            createdAt: transfer.createdAt,
            fromUserId: transfer.fromUserId,
            toUserId: transfer.toUserId
        };

        return { message: "Transferência realizada", transactionDetails: transactionDetails };

    });
    if(!transaction.message) return { error: transaction.error };
    
    return { message: transaction.message, transactionDetails: transaction.transactionDetails };
}


export { deposit, withdraw, transfer };
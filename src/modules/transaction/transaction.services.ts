import prisma from "../prisma/prisma.services.js";
import type { DepositInput, TransferData, WithdrawalData } from "./transaction.schemas.js";
import { convertToCents, convertCentsToBRL } from "../shared/conversion.js";
import { Prisma } from "@prisma/client";
import { setCacheUserBalance } from "../cache/cache.balance.js";

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
            
            const newUserBalanceToCache = updateUserBalance.balance;
            const newUserBalanceConverted = convertCentsToBRL(updateUserBalance.balance);

            const transactionDetails = {
                type: createTransaction.type,
                amount:`R$ ${newUserBalanceConverted}`,
                id: createTransaction.id,
                createdAt: createTransaction.createdAt,
                fromUserId: createTransaction.fromUserId,
                toUserId: createTransaction.toUserId
            };
            
            return { 
                message: "Depósito realizado", transactionDetails: transactionDetails, newBalance: newUserBalanceConverted, balanceToCache: newUserBalanceToCache 
            }
        });

        if(deposit.error) return deposit;

        setCacheUserBalance({ userId: userId, balance: deposit.balanceToCache! });

        return { message: deposit.message, transactionDetails: deposit.transactionDetails, newUserBalance: `R$ ${deposit.newBalance}` };
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
            
            const newUserBalanceToCache = updateUserBalance.balance;
            const newUserBalanceConverted = convertCentsToBRL(updateUserBalance.balance);
            
            const transactionDetails = {
                type: createTransaction.type,
                amount:`R$ ${newUserBalanceConverted}`,
                id: createTransaction.id,
                createdAt: createTransaction.createdAt,
                fromUserId: createTransaction.fromUserId,
                toUserId: createTransaction.toUserId
            };

            return { 
                message: "Saque realizado",  transactionDetails: transactionDetails, newBalance: newUserBalanceConverted, balanceToCache: newUserBalanceToCache 
            };
        });

        if (transaction.error) return transaction;

        setCacheUserBalance({ userId: id, balance: transaction.balanceToCache! });
        return { message: transaction.message, transactionDetails: transaction.transactionDetails, newUserBalance: `R$ ${transaction.newBalance}` };
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

        const updateFromUserBalance = await tx.user.update({
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

        return { 
            message: "Transferência realizada", transactionDetails: transactionDetails, newFromUserBalance: updateFromUserBalance.balance 
        };
    });

    if(!transaction.message) return { error: transaction.error };
    
    setCacheUserBalance({ userId: fromUserId, balance: transaction.newFromUserBalance });
    return { message: transaction.message, transactionDetails: transaction.transactionDetails };
}


export { deposit, withdraw, transfer };
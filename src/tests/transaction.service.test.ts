import { describe, beforeAll, afterAll, expect, test } from '@jest/globals';
import { deposit, transfer, withdraw } from '../modules/transaction/transaction.services.js';
import prisma from '../modules/prisma/prisma.services.js';
import { type DepositResponse, type SuccessfulTransferResponse, type WithdrawalError } from '../modules/transaction/transaction.schemas.js';

let user1: any;
let user2: any;


beforeAll(async () => {
    user1 = await prisma.user.create({
        data: { name: "teste1", email: "teste1@gmail.com", password: "Senha@1234", balance: 0 }
    });

    user2 = await prisma.user.create({
        data: { name: "teste2", email: "teste2@gmail.com", password: "Senha@1234", balance: 0 }
    });
});

afterAll(async () => {
    await prisma.transaction.deleteMany({ 
        where: { 
            OR: [
                { fromUserId: user1.id },
                { fromUserId: user2.id },
                { toUserId: user1.id },
                { toUserId: user2.id }
            ]
        } 
    });
    
    await prisma.user.deleteMany({ where: { id: { in: [user1.id, user2.id] } } });
    await prisma.$disconnect();
});


describe("Sistema de pagamentos", () => {
    
    test("Deve fazer depósito de R$ 15,00", async () => {
        
        const depositResult = await deposit({ amount: 15.00 }, user1.id) as DepositResponse;

        expect(depositResult.message).toBe("Depósito realizado");
        expect(depositResult.transactionDetails.amount).toBe("R$ 15,00");
    });

    test("Não permite sacar mais que o saldo atual", async () => {
        const withdrawResult = await withdraw({ withdrawalAmount: 50.00, id: user1.id }) as WithdrawalError;

        expect(withdrawResult.error).toBe("Saldo insuficiente para realizar a transação");
    });

    test("transfere R$ 5,00 entre usuários", async () => {       
    
        const transferResult = await transfer({ fromUserId: user1.id , toUserEmail: user2.email, transferAmount: 5.00 }) as SuccessfulTransferResponse;

        expect(transferResult.message).toBe("Transferência realizada");
        
        const u1 = await prisma.user.findUnique({ where: { id: user1.id } });
        const u2 = await prisma.user.findUnique({ where: { id: user2.id } });

        expect(u1?.balance).toBe(1000n);
        expect(u2?.balance).toBe(500n);
    });
});
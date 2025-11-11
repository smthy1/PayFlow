import type { FastifyReply, FastifyRequest } from "fastify";
import * as TransactionServices from './transaction.services.js';
import type { DepositInput, TransferToController, WithdrawalDataToController } from "./transaction.schemas.js";


const deposit = async (req: FastifyRequest<{ Body: DepositInput }>, reply: FastifyReply) => {
    try {
        const amount = req.body;
        const userId = req.user!.id;
        
        const depositResult = await TransactionServices.deposit({ amount: amount.amount },  userId );
        
        if(!depositResult.message) return reply.status(400).send({ error: depositResult });

        return reply.status(200).send({ message: "Depósito realizado" });
    } catch (err) {
        return reply.status(500).send({ error: err });
    }
};

const withdraw = async (req: FastifyRequest<{ Body: WithdrawalDataToController }>, reply: FastifyReply) => {
    try {
        const withdrawalAmount = req.body.withdrawalAmount;
        const userId = req.user!.id;

        if (!withdrawalAmount) return reply.status(400).send({ error: "Necessário informar a quantia a ser sacada" });

        const withdrawal = await TransactionServices.withdraw({ id: userId, withdrawalAmount: withdrawalAmount });
        
        if (!withdrawal.message) return reply.status(400).send(withdrawal);

        return reply.status(200).send({ message: "Saque realizado" });
    } catch (err) {
        return reply.status(500).send({ error: "Erro do servidor: ", err });
    }
};


const transfer = async(req: FastifyRequest<{ Body: TransferToController }>, reply: FastifyReply) => {
    try {
        const { toUserEmail, transferAmount } = req.body;
        const fromUserId = req.user!.id;

        if(!toUserEmail || !transferAmount) return reply.status(400).send(
            { error: "Informações necessárias para transferência: Email do recebedor e quantidade a ser transferida" }
        );

        const transfer = await TransactionServices.transfer({ fromUserId: fromUserId, toUserEmail: toUserEmail, transferAmount: transferAmount });
        if (!transfer.message) return reply.status(400).send(transfer);

        return reply.status(200).send(transfer);
    } catch (err) {
        return reply.status(500).send({ error: "Erro do servidor: ", err });
    }
};


export { deposit, withdraw, transfer }
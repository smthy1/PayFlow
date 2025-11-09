import type { FastifyRequest, FastifyReply } from "fastify";
import * as TransactionServices from './transaction.services.js';
import type { DepositInput } from "./transaction.schemas.js";


const deposit = async (req: FastifyRequest<{ Body: DepositInput }>, reply: FastifyReply) => {
    try {
        const { amount, toUserId } = req.body;
        
        const depositResult = await TransactionServices.depositService({ amount: amount, toUserId: toUserId });
        
        if(!depositResult.message) return reply.status(400).send({ error: depositResult });

        return reply.status(200).send({ message: "Depósito realizado" });
    } catch (err) {
        return reply.status(500).send({ error: err });
    }
};


export { deposit }
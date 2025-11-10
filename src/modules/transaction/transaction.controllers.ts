import type { FastifyReply, FastifyRequest } from "fastify";
import * as TransactionServices from './transaction.services.js';
import type { DepositInput } from "./transaction.schemas.js";


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


export { deposit }
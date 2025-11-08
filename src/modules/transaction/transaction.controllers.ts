import type { FastifyRequest, FastifyReply } from "fastify";
import * as TransactionServices from './transaction.services.js';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { depositSchema } from "./transaction.schemas.js";


const deposit = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const parsed = depositSchema.safeParse(req.body);
        if(!parsed.success) {
            const errors = z.treeifyError(parsed.error);
            return reply.status(400).send({ error: "Formato de dados inválidos", details: errors });
        }

        
        const depositResult = await TransactionServices.depositService(parsed.data);
        if(!depositResult.message) return reply.status(400).send({ error: depositResult });

        return reply.status(200).send({ message: "Depósito realizado", data: depositResult });
    } catch (err) {
        return reply.status(500).send({ error: err });
    }
};


export { deposit }
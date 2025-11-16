import type { FastifyRequest, FastifyReply } from "fastify";
import * as UserServices from "./user.services.js";


const getUserBalance = async(req: FastifyRequest, reply: FastifyReply) => {
    try {
        const getBalance = await UserServices.getUserBalance(req.user!.id);
        if (!getBalance.balance) return reply.status(400).send(getBalance);

        return reply.status(200).send(getBalance);
    } catch (err) {
        return reply.status(500).send({ error: "Erro: " + err });
    }
};



export { getUserBalance };
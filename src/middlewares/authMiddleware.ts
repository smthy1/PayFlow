import 'dotenv/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { JWTPayload } from '../modules/shared/JWTPayloadInterface.js';
import jwt from 'jsonwebtoken';



export const authToken = async (req: FastifyRequest, reply: FastifyReply) => {
    const signedToken = req.cookies.token;


    if (!signedToken) return reply.status(401).send({ error: "Token não fornecido" });
    
    const unsignedCookie = req.unsignCookie(signedToken);
        
    if (!unsignedCookie.valid) return reply.status(401).send({ error: "Cookie inválido" });
        
    const token = unsignedCookie.value;

    try {
        const key = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, key) as JWTPayload;

        req.user = decoded;
    } catch (err) {
        return reply.status(401).send({ error: `Token inválido ${err}` });
    }
};


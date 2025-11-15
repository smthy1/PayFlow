import type { FastifyReply, FastifyRequest } from 'fastify';
import type { JWTPayload } from '../modules/shared/JWTPayloadInterface.js';
import jwt from 'jsonwebtoken'
import 'dotenv/config'


export const authToken = async (req: FastifyRequest, res: FastifyReply) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) return res.status(401).send({ error: "Token não fornecido" });

    const [scheme, token] = authHeader.split(' ');

    if (!token || scheme !== "Bearer") return res.status(401).send({ error: "Token malformado" });

    try {
        const key = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, key) as JWTPayload;

        req.user = decoded;
    } catch (err) {
        return res.status(401).send({ error: err });
    }
};


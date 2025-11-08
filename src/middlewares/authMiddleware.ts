import type { FastifyReply } from 'fastify';
import type { AuthRequest, JWTPayload } from '../modules/auth/auth.types.js';
import jwt from 'jsonwebtoken'
import 'dotenv/config'


export const authToken = async (req: AuthRequest, res: FastifyReply) => {
    console.log("Entrando no middleware");
    const authHeader = req.headers.authorization;

    if(!authHeader) return res.status(401).send({ error: "Token não fornecido" });

    const [scheme, token] = authHeader.split(' ');

    if (!token || scheme !== "Bearer") return res.status(401).send({ error: "Token malformado" });

    try {
        const key = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, key) as JWTPayload;

        req.user = decoded;
    } catch (err) {
        console.error("Erro ao verificar token: ", err);
        return res.status(401).send({ error: err });
    }

    console.log("Middleware terminou")

};


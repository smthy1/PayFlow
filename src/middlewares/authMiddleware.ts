import jwt from 'jsonwebtoken'
import type { Response, NextFunction } from 'express'
import type { AuthRequest, JWTPayload } from '../types/auth.types.js';
import 'dotenv/config'

const authToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) return res.status(401).json({ error: "Token não fornecido" });

    const [scheme, token] = authHeader.split(' ');

    if (!token || scheme !== "Bearer") return res.status(401).json({ error: "Token malformado" });

    try {
        const key = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, key) as JWTPayload;

        req.user = decoded;
        
        next();
    } catch (err) {
        return res.status(401).json({ error: err });
    }

};

export default authToken;
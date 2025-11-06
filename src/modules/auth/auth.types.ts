import type { FastifyRequest } from "fastify";


export interface JWTPayload {
    id: string;
    name: string;
}

export interface AuthRequest extends FastifyRequest {
    user?: JWTPayload
}

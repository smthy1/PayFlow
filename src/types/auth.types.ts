import type { Request } from "express";

export interface JWTPayload {
    id: string;
    name: string;
}


export type AuthRequest = Request & {
    user: JWTPayload;
}
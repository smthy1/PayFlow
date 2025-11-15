import "fastify";
import type { JWTPayload } from "./JWTPayloadInterface.ts";

declare module "fastify" {
    interface FastifyRequest {
        user?: JWTPayload;
    }
}
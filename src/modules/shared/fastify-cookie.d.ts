import "fastify"

declare module "fastify" {
    interface FastifyRequest {
        cookies: {
            token?: string;
            [key: string]: string | undefined;
        }
    }
}
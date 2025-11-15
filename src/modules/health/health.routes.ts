import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authToken } from "../../middlewares/authMiddleware.js";
import { type HealthCheck, healthCheckSchema  } from "./health.schemas.js";



const  healthRoutes = async (app: FastifyInstance) => {
    app.get('/', 
        {
            schema: {
                description: "Health check",
                tags: ['health'],
                response: { 200: 'ok' }
            }
        }, 
        async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            return reply.status(200).send({ status: 'ok' });
        } catch (err) {
            return reply.status(500).send({ error: err });
        }
    });
    
    app.post<{ Body: HealthCheck }>(
        '/test', 
        {
            preHandler: [authToken],
            schema: {
                description: "Health check with login",
                tags: ['auth'],
                body: healthCheckSchema,
                response: { 200: healthCheckSchema }
            }
        }, 
        async (req: FastifyRequest<{ Body: HealthCheck }>, reply) => {
        try {
            const { content } = req.body;

            return reply.status(200).send({ content: `Hello ${content}` });
        } catch (err) {
            return reply.status(500).send({ error: err });
        }
    });
};

export default healthRoutes
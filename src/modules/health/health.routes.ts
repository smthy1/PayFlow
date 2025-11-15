import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authToken } from "../../middlewares/authMiddleware.js";

interface HealthCheck {
    content: string
}

const  healthRoutes = async (app: FastifyInstance) => {
    app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            return reply.status(200).send({ status: 'ok' });
        } catch (err) {
            return reply.status(500).send({ error: err });
        }
    });
    
    app.post<{ Body: HealthCheck }>('/test', { preHandler: [authToken] }, async (req: FastifyRequest<{ Body: HealthCheck }>, reply) => {
        try {
            const { content } = req.body;

            return reply.status(200).send({ content: `Hello ${content}` });
        } catch (err) {
            return reply.status(500).send({ error: err });
        }
    });
};

export default healthRoutes
import type { FastifyInstance, FastifyRequest } from "fastify";
import authToken from "../../middlewares/authMiddleware.js";

interface HealthCheck {
    content: string
}

const  healthRoutes = async (app: FastifyInstance) => {
        app.post('/', { preHandler: authToken }, async (req: FastifyRequest<{ Body: HealthCheck }>, reply) => {
        try {
            const { content } = req.body;

            return reply.status(200).send({ content: `Hello ${content}` });
        } catch (err) {
            return reply.status(500).send({ error: err });
        }
    })
};

export default healthRoutes
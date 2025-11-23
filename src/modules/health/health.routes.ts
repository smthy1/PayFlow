import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { healthCheckResponseSchema  } from "./health.schemas.js";


const  healthRoutes = async (app: FastifyInstance) => {
    app.get('/', 
        {
            schema: {
                description: "Health check",
                tags: ['health'],
                response: { 200: healthCheckResponseSchema }
            }
        }, 
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                return reply.status(200).send({ status: "ok" });
            } catch (err) {
                return reply.status(500).send({ error: err });
            }
        }
    );
};

export default healthRoutes;
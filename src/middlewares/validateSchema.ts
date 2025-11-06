import { ZodType } from 'zod';
import type { FastifyRequest, FastifyReply } from 'fastify';

const validateSchema = (schema: ZodType) => (req: FastifyRequest, res: FastifyReply) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
        return res.status(400).send({ error: result.error });
    }
    
    req.body = result.data;
}

export default validateSchema
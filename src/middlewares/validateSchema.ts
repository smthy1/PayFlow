import { z } from 'zod';
import type { FastifyRequest, FastifyReply } from 'fastify';

export const validateSchema = (schema: z.ZodObject<any>) => {
    return async (req: FastifyRequest, res: FastifyReply) => {
        const result = schema.safeParse(req.body);
        
        if (!result.success) {
            const errors = z.treeifyError(result.error);
            return res.status(400).send({ error:"Dados inválidos", details: errors});
        }
        console.log("Validação OK")
        req.body = result.data;
    };
};
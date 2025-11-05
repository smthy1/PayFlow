import { ZodType } from 'zod';
import type { Request, Response, NextFunction } from 'express';

const validateSchema = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    
    req.body = result.data;
    next();
}

export default validateSchema
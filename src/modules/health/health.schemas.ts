import { z } from 'zod';

export const healthCheckSchema = z.object({
    content: z.string()
});

export const healthCheckResponseSchema = z.object({
    status: z.string()
});

export type HealthCheck = z.infer<typeof healthCheckSchema>;
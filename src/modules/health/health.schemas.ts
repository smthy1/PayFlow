import { z } from 'zod';

export const healthCheckSchema = z.object({
    content: z.string()
});

export type HealthCheck = z.infer<typeof healthCheckSchema>;
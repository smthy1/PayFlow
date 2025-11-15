import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import authRoutes from "./modules/auth/auth.routes.js";
import healthRoutes from "./modules/health/health.routes.js";
import transactionRoutes from "./modules/transaction/transaction.routes.js";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import userRoutes from "./modules/user/user.routes.js";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: '*' });


app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "PayFlow",
            version: "1.0.0",
            description: "API de pagamentos"
        },
        components: { 
            securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } }
        }
    },
    transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
});


await app.register(import ('@fastify/rate-limit'));

app.register(authRoutes, { prefix: '/auth' });
app.register(transactionRoutes, { prefix: '/transactions' });
app.register(healthRoutes, { prefix: '/health' });
app.register(userRoutes, { prefix:'/user' });


export default app;
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import authRoutes from "./modules/auth/auth.routes.js";
import healthRoutes from "./modules/health/health.routes.js";
import transactionRoutes from "./modules/transaction/transaction.routes.js";
import { authToken } from "./middlewares/authMiddleware.js";

const app = fastify();

app.register(authRoutes, { prefix: '/auth' });


app.register(transactionRoutes, { prefix: '/' });
app.register(healthRoutes, { prefix: '/health' });


app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "PayFlow",
            version: "1.0.0",
        }
    }
});

app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
});



export default app;
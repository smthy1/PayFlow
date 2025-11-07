import type { FastifyInstance } from "fastify";
import { registerController } from "./auth.controllers.js";
import { loginController } from "./auth.controllers.js";
import { loginUserSchema, registerUserSchema } from "./auth.schemas.js";

const authRoutes = async (app: FastifyInstance) => {
    app.post('/register', { schema: registerUserSchema }, registerController),
    app.post('/login', { schema: loginUserSchema },loginController)
};


export default authRoutes;
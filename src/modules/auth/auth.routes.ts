import type { FastifyInstance } from "fastify";
import * as AuthControllers from './auth.controllers.js';
import { loginUserSchema, registerUserSchema } from "./auth.schemas.js";

const authRoutes = async (app: FastifyInstance) => {
    app.post('/register', { schema: registerUserSchema }, AuthControllers.register),
    app.post('/login', { schema: loginUserSchema },AuthControllers.login)
};


export default authRoutes;
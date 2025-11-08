import type { FastifyInstance } from "fastify";
import * as AuthControllers from './auth.controllers.js';
import { loginUserSchema, registerUserSchema, type RegisterUserInput, type LoginUserInput } from "./auth.schemas.js";
import { validateSchema } from "../../middlewares/validateSchema.js";

const authRoutes = async (app: FastifyInstance) => {
    app.post<{ Body: RegisterUserInput }>(
        '/register', 
        { preHandler: validateSchema(registerUserSchema) }, 
        AuthControllers.register
    );
    
    app.post<{ Body: LoginUserInput }>(
        '/login', 
        { preHandler: validateSchema(loginUserSchema) }, 
        AuthControllers.login
    );
};


export default authRoutes;
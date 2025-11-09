import type { FastifyTypedInstance } from '../shared/FastifyTypedInstance.js';
import * as AuthControllers from './auth.controllers.js';
import { loginUserSchema, registerUserSchema, authResponseSchema, type RegisterUserInput, type LoginUserInput } from "./auth.schemas.js";
import { validateSchema } from "../../middlewares/validateSchema.js";


const authRoutes = async (app: FastifyTypedInstance) => {
    app.post<{ Body: RegisterUserInput }>(
        '/register', 
        { 
            preHandler: validateSchema(registerUserSchema),
            schema: {
                description: 'Cria novo usuário',
                tags: ['auth'],
                body: registerUserSchema,
                response: { 201: authResponseSchema}
            }
        }, 
        AuthControllers.register
    );
    
    app.post<{ Body: LoginUserInput }>(
        '/login', 
        { 
            preHandler: validateSchema(loginUserSchema),
            schema: {
                description: 'Login de usuário',
                tags: ['auth'],
                body: loginUserSchema,
                response: { 200: authResponseSchema }
            }
        }, 
        AuthControllers.login
    );
};


export default authRoutes;
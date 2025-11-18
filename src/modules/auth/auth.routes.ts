import type { FastifyTypedInstance } from '../shared/FastifyTypedInstance.js';
import * as AuthControllers from './auth.controllers.js';
import { loginUserSchema, registerUserSchema, authResponseSchema, type RegisterUserInput, type LoginUserInput, forgotPasswordResponseSchema, type ForgotPasswordUserInput } from "./auth.schemas.js";
import { validateSchema } from "../../middlewares/validateSchema.js";
import { basicRateLimit } from '../../middlewares/rateLimit.js';
import { authToken } from '../../middlewares/authMiddleware.js';


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
            },
            config: {
                rateLimit: basicRateLimit
            }
        }, 
        AuthControllers.login
    );

    app.post<{Body: ForgotPasswordUserInput}>(
        '/forgot-password',
        {
            preHandler: [authToken],
            schema: {
                description: 'Envio de email pra reset de senha',
                tags: ['auth'],
                response: { 200: forgotPasswordResponseSchema }
            }
        },
        AuthControllers.forgotPassword
    );
};


export default authRoutes;
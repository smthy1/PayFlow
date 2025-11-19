import type { FastifyTypedInstance } from '../shared/FastifyTypedInstance.js';
import * as AuthControllers from './auth.controllers.js';
import { loginUserSchema, registerUserSchema, authResponseSchema, type RegisterUserInput, 
    type LoginUserInput, forgotPasswordResponseSchema,  type ForgotPasswordUserInput, forgotPasswordSchema, 
    resetPasswordSchema, type ResetPasswordUserInput, type ResetPasswordQueryParams 
} from "./auth.schemas.js";
import { validateSchema } from "../../middlewares/validateSchema.js";
import { basicRateLimit } from '../../middlewares/rateLimit.js';


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
            preHandler: validateSchema(forgotPasswordSchema),
            schema: {
                description: 'Envio de email pra reset de senha',
                tags: ['auth'],
                response: { 200: forgotPasswordResponseSchema }
            }
        },
        AuthControllers.forgotPassword
    );

    app.patch<{ Body: ResetPasswordUserInput, Querystring: ResetPasswordQueryParams }>(
        '/reset-password',
        {
            preHandler: validateSchema(resetPasswordSchema),
            schema: {
                description: 'Reset de senha',
                tags: ['auth'],

            }
        },
        AuthControllers.resetPassword
    );
};


export default authRoutes;
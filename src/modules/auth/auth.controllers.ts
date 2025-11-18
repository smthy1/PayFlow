import type { FastifyRequest, FastifyReply } from "fastify";
import * as AuthService from "./auth.services.js";
import type { RegisterUserInput, LoginUserInput, ForgotPasswordUserInput } from "./auth.schemas.js";
import jwt from 'jsonwebtoken';

const register = async (req: FastifyRequest<{ Body: RegisterUserInput }>, reply: FastifyReply) => {
    try {
        const { name, email, password } = req.body;

        const registerUserResult = await AuthService.registerUser({ name: name, email: email, password: password });

        if(registerUserResult.error || registerUserResult.unexpectedError) return reply.status(400).send(registerUserResult);

        const accessToken = registerUserResult.accessToken!;

        reply.setCookie("token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            signed: true,
            maxAge: 2 * 60 * 60 * 1000
        });

        return reply.status(201).send({ message: registerUserResult.message });
    } catch (err) {
        return reply.status(500).send({ error: "Erro interno no servidor: " + err });
    }
};

const login = async(req: FastifyRequest<{ Body: LoginUserInput }>, reply: FastifyReply) => {
    const { email, password } = req.body;
    try {
        

        const loginUserResult = await AuthService.loginUser({ email: email, password: password });
        
        if(loginUserResult.error || loginUserResult.unexpectedError) return reply.status(400).send(loginUserResult);
        
        const accessToken = loginUserResult.accessToken!;

        reply.setCookie("token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            signed: true,
            maxAge: 2 * 60 * 60 * 1000
        });
        
        return reply.status(200).send({ message: loginUserResult.message });
    } catch (err) {
        return reply.status(500).send({ error: "Erro interno no servidor: " + err });
    }
};

const forgotPassword = async(req: FastifyRequest<{ Body: ForgotPasswordUserInput }>, reply: FastifyReply) => {
    const { email } = req.body;
    
    try {
        await AuthService.fogortPassword({ email: email });
        return reply.status(200).send({ message: "Caso for um email válido, o link será enviado" });
    } catch (err) {
        return { error: `Erro interno no servidor ${err}` };
    }
};
export { register, login, forgotPassword };
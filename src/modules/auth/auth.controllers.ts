import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from 'zod';
import * as AuthService from "./auth.services.js";
import type { RegisterUserInput, LoginUserInput } from "./auth.schemas.js";
import jwt from 'jsonwebtoken';

const register = async (req: FastifyRequest<{ Body: RegisterUserInput }>, reply: FastifyReply) => {
    try {
        const { name, email, password } = req.body;

        const registerUserResult = await AuthService.registerUser({ name: name, email: email, password: password });

        if(registerUserResult.error || registerUserResult.unexpectedError) return reply.status(400).send(registerUserResult);

        const newUser = registerUserResult.user;
        const key = process.env.JWT_SECRET as string;
        
        const accessToken = jwt.sign({
            id: newUser?.id,
            name: newUser?.name
        }, key, { expiresIn: '2h' });

        return reply.status(201).send({ message: "Usuário registrado", token: accessToken });
    } catch (err) {
        return reply.status(500).send({ error: "Erro interno no servidor: " + err });
    }
}

const login = async(req: FastifyRequest<{ Body: LoginUserInput }>, reply: FastifyReply) => {
    try {
        const { email, password } = req.body;

        const loginUserResult = await AuthService.loginUser({ email: email, password: password });
        
        if(loginUserResult.error || loginUserResult.unexpectedError) return reply.status(400).send(loginUserResult);
        
        const user = loginUserResult.user;
        const key = process.env.JWT_SECRET as string;

        const accessToken = jwt.sign({
            id: user?.id,
            name: user?.name,
        }, key, { expiresIn: '2h' });
        
        return reply.status(200).send({ message: "Usuário autenticado", token: accessToken });
    } catch (err) {
        return reply.status(500).send({ error: "Erro interno no servidor: " + err });
    }
};

export { register, login }
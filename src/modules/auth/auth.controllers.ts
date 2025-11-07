import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from 'zod'
import * as AuthServices from './auth.services.js';
import { registerUserSchema, loginUserSchema, type RegisterUserInput, type LoginUserInput } from "./auth.schemas.js";
import jwt from 'jsonwebtoken'

const registerController = async (req: FastifyRequest<{ Body: RegisterUserInput }>, reply: FastifyReply) => {
    try {
        const parsed = registerUserSchema.safeParse(req.body);
        if(!parsed.success) {
            const errors = z.treeifyError(parsed.error);
            return reply.status(400).send({ error: "Formato de dados inválidos", details: errors });
        }


        const { name, email, password }: RegisterUserInput = parsed.data;
        const registerUserResult = await AuthServices.registerUser({ name: name, email: email, password: password });

        if(registerUserResult.error || registerUserResult.unexpectedError) return reply.status(400).send(registerUserResult);

        const newUser = registerUserResult.user;
        const key = process.env.JWT_SECRET as string;
        
        const accessToken = jwt.sign({
            id: newUser?.id,
            name: newUser?.name
        }, key, { expiresIn: '2h' });

        return reply.status(201).send({ message: "Usuário registrado", token: accessToken });
    } catch (err) {
        return reply.status(500).send({ error: err });
    }
}

const loginController = async(req: FastifyRequest<{ Body: LoginUserInput }>, reply: FastifyReply) => {
    try {
        const parsed = loginUserSchema.safeParse(req.body);

        if (!parsed.success) {
            const errors = z.treeifyError(parsed.error);
            return reply.status(400).send({ error: "Forma de dados inválidos", details: errors });
        }

        const { email, password } = parsed.data;
        const loginUserResult = await AuthServices.loginUser({ email: email, password: password });
        
        if(loginUserResult.error || loginUserResult.unexpectedError) return reply.status(400).send(loginUserResult);
        const user = loginUserResult.user;
        const key = process.env.JWT_SECRET as string;

        const accessToken = jwt.sign({
            id: user?.id,
            name: user?.name,
        }, key, { expiresIn: '2h' });
        
        return reply.status(200).send({ message: "Usuário autenticado", token: accessToken });
    } catch (err) {
        return reply.status(500).send({ error: err });
    }
};

export { registerController, loginController }
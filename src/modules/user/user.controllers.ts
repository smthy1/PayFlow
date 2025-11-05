import type { Response, Request } from "express";
import * as userServices from "./user.services.js";
import type { CreateUserInput } from "./user.schemas.js";
import jwt from 'jsonwebtoken';


const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password }: CreateUserInput = req.body;

        const createUserResult = await userServices.createUser({ name: name, email: email, password: password });

        if(createUserResult.error || createUserResult.unexpectedError) return res.status(400).json(createUserResult);

        const newUser = createUserResult.user;
        const key = process.env.JWT_SECRET as string;
        
        const accessToken = jwt.sign({
            id: newUser?.id,
            name: newUser?.name
        }, key, { expiresIn: '2h' });

        return res.status(201).json({ message: "Usuário registrado", token: accessToken });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}


export { createUser }
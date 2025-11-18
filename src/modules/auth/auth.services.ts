import  prisma from "../prisma/prisma.services.js";
import type { RegisterUserInput, LoginUserInput, ForgotPasswordUserInput } from "./auth.schemas.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

async function registerUser(userData: RegisterUserInput) {
    try {   
        const existingEmail = await prisma.user.findUnique({
            where: { email: userData.email }
        });
        
        if (existingEmail) {
            return { error: "Email já cadastrado" };
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const createUser = await prisma.user.create({ 
            data: { ...userData, password: hashedPassword } 
        });

        const name = createUser.name;
        const key = process.env.JWT_SECRET as string;
        
        const accessToken = jwt.sign({
            id: createUser.id,
            name: name
        }, key, { expiresIn: '2h' });

        return { message: "Usuário registrado e autenticado", accessToken: accessToken };
    } catch (err) {
        return { unexpectedError: err };
    }
}

async function loginUser(userData: LoginUserInput) {
    try {
        const { email, password } = userData;

        const findUserByEmail = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!findUserByEmail) return { error: "Credenciais inválidas" };
        const userPassword = findUserByEmail.password;

        const comparePassword = await bcrypt.compare(password, userPassword);
        if (!comparePassword) return { error: "Credenciais inválidas" };
        
        const name = findUserByEmail.name;
        const key = process.env.JWT_SECRET as string;

        const accessToken = jwt.sign({
            id: findUserByEmail.id,
            name: name,
        }, key, { expiresIn: '2h' });

        return { message: "Usuário autenticado", accessToken: accessToken };

    } catch (err) {
        return { unexpectedError: err };
    }
}

async function fogortPassword(userData: ForgotPasswordUserInput) {
    const { email } = userData;

    try {
        const findEmail = await prisma.user.findUnique({ where: { email: email } });
        if(!findEmail) return { error: "Email do usuário não encontrado" };

        
    } catch (err) {
        return { unexpectedError: err };
    }
}

export { registerUser, loginUser, fogortPassword } ;
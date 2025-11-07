import prisma from "../prisma/prisma.services.js";
import type { RegisterUserInput, LoginUserInput } from "./auth.schemas.js";
import bcrypt from 'bcrypt';
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

        return { message: "Usuário registrado", user: createUser };
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

        return { message: "Credenciais válidas", user: { id: findUserByEmail.id, name: findUserByEmail.name } };

    } catch (err) {
        return { unexpectedError: err };
    }
}

export { registerUser, loginUser }
import prisma from "../prisma/prisma.services.js";
import type { CreateUserInput } from "./user.schemas.js";
import bcrypt from 'bcrypt';
import 'dotenv/config'

async function createUser(userData: CreateUserInput) {
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



export { createUser }
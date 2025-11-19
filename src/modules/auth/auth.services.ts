import  prisma from "../prisma/prisma.services.js";
import type { RegisterUserInput, LoginUserInput, ForgotPasswordUserInput, ResetPasswordUserInput, ResetPasswordQueryParams } from "./auth.schemas.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { sendEmailToResetPassword } from "../email/send-email.service.js";


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

async function fogortPassword(userEmail: ForgotPasswordUserInput) {
    const email = userEmail.email;
    
    try {
        const findUser = await prisma.user.findUnique({ where: { email: email } });

        if(!findUser) return { error: "Email do usuário não encontrado" };

        const resetPasswordSecret = process.env.JWT_RESET_PASSWORD_SECRET as string;
        const token = jwt.sign({ 
            id: findUser.id,
        }, resetPasswordSecret, { expiresIn: '30m'});

        const url = process.env.RENDER_URL as string;
        await sendEmailToResetPassword({ email: email, resetLink: `${url}auth/reset-password/${token}` });
    } catch (err) {
        return { unexpectedError: err };
    }
}


async function resetPassword(userInput: ResetPasswordUserInput, queryParamToken: ResetPasswordQueryParams) {
    const { newPassword, confirmPassword } = userInput;

    if(newPassword !== confirmPassword) return { error: "As senhas devem ser iguais" };

    const { token } = queryParamToken;
    const key = process.env.JWT_RESET_PASSWORD_SECRET as string;

    try {
        const decodedUserId = jwt.verify(token, key) as { id: string };
        const findUser = await prisma.user.findUnique({ where: { id: decodedUserId.id } });

        if (!findUser) return { error: "Id inválido" };

        await prisma.user.update({ 
            where: { id: findUser.id },
            data: { password: newPassword }
        });

        return { message: "Senha atualizada" };
    } catch (err) {
        return { unexpectedError: `Erro inesperado: ${err}` };
    }
}


export { registerUser, loginUser, fogortPassword, resetPassword };
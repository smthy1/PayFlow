import prisma from "../prisma/prisma.services.js";
import { convertCentsToBRL } from "../shared/conversion.js";


async function getUserBalance(userId: string) {
    try {
        const getBalance = await prisma.user.findUnique({ where: { id: userId }, select: { balance: true }  });
        if (!getBalance) return { error: "Usuário não encontrado" };

        const convertedBalance = convertCentsToBRL(getBalance.balance);
        return { balance: convertedBalance };
    } catch (err) {
        return { unexpectedError: err };
    }
}


export { getUserBalance }

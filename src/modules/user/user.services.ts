import { getCacheUserBalance, setCacheUserBalance } from "../cache/cache.balance.js";
import prisma from "../prisma/prisma.services.js";
import { convertCentsToBRL } from "../shared/conversion.js";


async function getUserBalance(userId: string) {
    try {
        const getCache = getCacheUserBalance(userId);
        
        if (getCache !== undefined){
            const converted = convertCentsToBRL(getCache.balance).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            return { balance: `R$ ${converted}` };
        }

        const getBalance = await prisma.user.findUnique({ where: { id: userId }, select: { balance: true }  });
        if (!getBalance) return { error: "Usuário não encontrado" };

        
        setCacheUserBalance({userId: userId, balance: getBalance.balance });

        const convertedBalance = convertCentsToBRL(getBalance.balance)
            .toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        return { balance: `R$ ${convertedBalance}` };
    } catch (err) {
        return { unexpectedError: err };
    }
}


export { getUserBalance };

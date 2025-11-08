import prisma from "../prisma/prisma.services.js";
import type { DepositInput } from "./transactions.schemas.js";
import { convertToCents, convertCentsToBRL } from "../shared/conversion.js";


async function depositService (transactionData: DepositInput) {
    try {
        const { amount, toUserId } = transactionData;
        const convertedAmount = convertToCents(amount);
        
        const deposit = await prisma.transaction.create({
            data: {
                amount: convertedAmount,
                type: "DEPOSIT",
                toUserId: toUserId
            }
        });

        return { message: "Depósito realizado", details: deposit };
    } catch (err) {
        return { unexpectedError: err };
    } 
}

console.log(await depositService({ amount: 2000, toUserId: '1cf0f1af-aa57-450e-8598-8c8fb40c9372', }));

export { depositService };
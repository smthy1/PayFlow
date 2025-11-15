import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

prisma.$connect().catch((err)=> {
    console.error('Prisma connection failed: ', err);
    process.exit(1);
});

export default prisma;
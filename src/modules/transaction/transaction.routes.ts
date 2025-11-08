import type { FastifyInstance } from 'fastify';
import * as TransactionControllers from './transaction.controllers.js';
import { depositSchema, type DepositInput } from './transaction.schemas.js';
import { authToken } from '../../middlewares/authMiddleware.js';
import  { validateSchema } from '../../middlewares/validateSchema.js';

const transactionRoutes = async (app: FastifyInstance) => {
  app.post<{Body: DepositInput }>(
    '/deposit',
    {
      preHandler: [ authToken,validateSchema(depositSchema)],
    },
    TransactionControllers.deposit
  );

  
};

export default transactionRoutes;

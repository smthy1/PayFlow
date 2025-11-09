import type { FastifyTypedInstance } from '../shared/FastifyTypedInstance.js';
import * as TransactionControllers from './transaction.controllers.js';
import { depositSchema, depositResponseSchema, type DepositInput } from './transaction.schemas.js';
import { authToken } from '../../middlewares/authMiddleware.js';
import  { validateSchema } from '../../middlewares/validateSchema.js';

const transactionRoutes = async (app: FastifyTypedInstance) => {
  app.post<{Body: DepositInput }>(
    '/deposit',
    {
      preHandler: [ authToken, validateSchema(depositSchema)],
      schema: {
        description: 'Deposit',
        tags: ['transactions'],
        body: depositSchema,
        response: { 200: depositResponseSchema }
      }
    },
    TransactionControllers.deposit
  );
};

export default transactionRoutes;

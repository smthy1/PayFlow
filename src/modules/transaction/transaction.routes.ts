import type { FastifyTypedInstance } from '../shared/FastifyTypedInstance.js';
import * as TransactionControllers from './transaction.controllers.js';
import { depositSchema, depositResponseSchema, withdrawalDataToControllerSchema, 
  type DepositInput, type WithdrawalDataToController, 
  transferToControllerSchema,
  type TransferToController,
  withdrawalResponseSchema,
  transferResponseSchema
} from './transaction.schemas.js';
import { authToken } from '../../middlewares/authMiddleware.js';
import  { validateSchema } from '../../middlewares/validateSchema.js';


const transactionRoutes = async (app: FastifyTypedInstance) => {
  app.post<{ Body: DepositInput }>(
    '/deposit',
    {
      preHandler: [authToken, validateSchema(depositSchema)],
      schema: {
        description: 'Deposit',
        tags: ['transactions'],
        body: depositSchema,
        response: { 200: depositResponseSchema }
      }
    },
    TransactionControllers.deposit
  );

  app.post<{ Body: WithdrawalDataToController }>(
    '/withdraw',
    {
      preHandler: [authToken, validateSchema(withdrawalDataToControllerSchema)],
      schema: {
        description: 'Withdraw',
        tags: ['transactions'],
        body: withdrawalDataToControllerSchema,
        response: { 200: withdrawalResponseSchema }

      }
    },
    TransactionControllers.withdraw
  );

  app.post<{ Body: TransferToController }>(
    '/transfer',
    {
      preHandler: [authToken, validateSchema(transferToControllerSchema)],
      schema: {
        description: 'Transfer',
        tags: ['transactions'],
        body: transferToControllerSchema,
        response: { 200: transferResponseSchema }
      }
    },
    TransactionControllers.transfer
  )
};

export default transactionRoutes;

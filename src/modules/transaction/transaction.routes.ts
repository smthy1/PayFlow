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
import { basicRateLimit } from '../../middlewares/rateLimit.js';


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
      },
      config: {
        rateLimit: basicRateLimit
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

      },
      config: {
        rateLimit: basicRateLimit
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
      },
      config: {
        rateLimit: basicRateLimit
      }
    },
    TransactionControllers.transfer
  );
};

export default transactionRoutes;

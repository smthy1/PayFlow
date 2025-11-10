import * as UserControllers from './user.controllers.js'
import type { FastifyTypedInstance } from '../shared/FastifyTypedInstance.js'
import { validateSchema } from '../../middlewares/validateSchema.js'
import { getUserBalanceResponseSchema, getUserBalanceSchema, type GetUserBalanceInput } from './user.schemas.js'
import { authToken } from '../../middlewares/authMiddleware.js'


const userRoutes = async (app: FastifyTypedInstance) => {
    app.get(
        '/balance',
        {
            preHandler: [authToken],
            schema: {
                description: 'Retorna saldo do usuário',
                tags: ['user'],
                response: { 200: getUserBalanceResponseSchema }
            }
        },
        UserControllers.getUserBalance
    );
}


export default userRoutes;
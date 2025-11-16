import * as UserControllers from './user.controllers.js'
import type { FastifyTypedInstance } from '../shared/FastifyTypedInstance.js'
import { getUserBalanceResponseSchema } from './user.schemas.js'
import { authToken } from '../../middlewares/authMiddleware.js'
import { basicRateLimit } from '../../middlewares/rateLimit.js'


const userRoutes = async (app: FastifyTypedInstance) => {
    app.get(
        '/balance',
        {
            preHandler: [authToken],
            schema: {
                description: 'Consulta o saldo do usuário',
                tags: ['user'],
                response: { 200: getUserBalanceResponseSchema }
            },
            config: {
                rateLimit: basicRateLimit
            }
        },
        UserControllers.getUserBalance
    );
}


export default userRoutes;
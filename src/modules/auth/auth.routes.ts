import type { FastifyInstance } from "fastify";
import authToken from "../../middlewares/authMiddleware.js";
import { registerController } from "./auth.controllers.js";
import type { RegisterUserInput } from "./auth.schemas.js";

const authRoutes = async (app: FastifyInstance) => {
    app.post<{ Body: RegisterUserInput }>('/users', registerController)
};


export default authRoutes
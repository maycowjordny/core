import { FastifyInstance } from "fastify";
import { SessionCreateController } from "../controllers/session/session-create-controller";

const sessionController = new SessionCreateController();

export async function sessionRoutes(app: FastifyInstance) {
    app.post("/", sessionController.create);
}

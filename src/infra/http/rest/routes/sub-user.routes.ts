import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middleware/verify-jwt";
import { verifyUserType } from "../../middleware/verify-user-type";
import { CreateSubUserController } from "../controllers/sub-user/create-sub-user-controller";

const subUserController = new CreateSubUserController();

export async function subUserRoutes(app: FastifyInstance) {
    app.post("/add", { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.ADMIN])] },
        subUserController.create);
}

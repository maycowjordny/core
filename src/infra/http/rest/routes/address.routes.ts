import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middleware/verify-jwt";
import { verifyUserType } from "../../middleware/verify-user-type";
import { UpdateAddressController } from "../controllers/address/update-address-controller";

const updateAddressController = new UpdateAddressController();

export async function addressRoutes(app: FastifyInstance) {
    app.put("/:id",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.ADMIN])] },
        updateAddressController.update);
}


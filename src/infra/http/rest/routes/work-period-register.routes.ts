import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middleware/verify-jwt";
import { verifyUserType } from "../../middleware/verify-user-type";
import { WorkPeriodRegisterCreateController } from "../controllers/work-period-register/create-work-period-register-controller";
import { WorkPeriodRegisterUpdateController } from "../controllers/work-period-register/update-work-period-register-controller";

const createWorkPeriodRegisterController = new WorkPeriodRegisterCreateController();
const updateWorkPeriodRegisterController = new WorkPeriodRegisterUpdateController();

export async function workPeriodRegisterRoutes(app: FastifyInstance) {
    app.post("/", { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.EMPLOYEE, [UserRoleEnum.BASIC])] },
        createWorkPeriodRegisterController.create);
    app.put("/:id", { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.EMPLOYEE, [UserRoleEnum.BASIC])] },
        updateWorkPeriodRegisterController.update);
}

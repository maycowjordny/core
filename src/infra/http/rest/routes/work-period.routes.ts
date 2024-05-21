import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middleware/verify-jwt";
import { verifyUserType } from "../../middleware/verify-user-type";
import { WorkPeriodCreateController } from "../controllers/work-period/create-work-period-controller";
import { FindManyWorkPeriodByCompanyIdController } from "../controllers/work-period/find-many-work-period-by-company-id-controller";
import { WorkPeriodUpdateController } from "../controllers/work-period/update-work-period-controller";

const createWorkPeriodController = new WorkPeriodCreateController();
const updateWorkPeriodController = new WorkPeriodUpdateController();
const findManyWorkPeriodByCompanyIdController = new FindManyWorkPeriodByCompanyIdController();

export async function workPeriodRoutes(app: FastifyInstance) {
    app.post("/add", { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        createWorkPeriodController.create);
    app.get("/", { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        findManyWorkPeriodByCompanyIdController.find);
    app.put("/:codWorkPeriod", { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        updateWorkPeriodController.update);

}

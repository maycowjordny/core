import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middleware/verify-jwt";
import { verifyUserType } from "../../middleware/verify-user-type";
import { EmployeeCreateController } from "../controllers/employee/create-employee-controller";
import { EmployeeDeactivateController } from "../controllers/employee/deactivate-employee-controller";
import { DetermineEmployeePaySummaryController } from "../controllers/employee/determine-employee-pay-summary-controller";
import { FetchEmployeeByNameOrCpfController } from "../controllers/employee/fetch-employee-by-name-or-cpf-controller";
import { FindManyEmployeeByCompanyIdController } from "../controllers/employee/find-many-employee-by-company-id-controller";
import { EmployeeUpdateController } from "../controllers/employee/update-employee-controller";

const createEmployeeController = new EmployeeCreateController();
const updateEmployeeController = new EmployeeUpdateController();
const deactivateEmployeeController = new EmployeeDeactivateController();
const findManyEmployeeByCompanyIdController = new FindManyEmployeeByCompanyIdController();
const fetchEmployeeByNameOrCpfController = new FetchEmployeeByNameOrCpfController();
const determineEmployeePaySummaryController = new DetermineEmployeePaySummaryController();

export async function employeeRoutes(app: FastifyInstance) {
    app.post("/add",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        createEmployeeController.create);
    app.get("/search",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        fetchEmployeeByNameOrCpfController.fetch);
    app.get("/",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        findManyEmployeeByCompanyIdController.find);
    app.put("/:id",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        updateEmployeeController.update);
    app.put("/deactivate/:id",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        deactivateEmployeeController.deactivate);
    app.get("/summary-salary/:employeeId",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        determineEmployeePaySummaryController.summarise);
}

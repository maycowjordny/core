import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middleware/verify-jwt";
import { verifyUserType } from "../../middleware/verify-user-type";
import { CompanyCreateController } from "../controllers/company/create-company-controller";
import { CompanyUpdateController } from "../controllers/company/update-company-controller";

const createCompanyController = new CompanyCreateController();
const updateCompanyController = new CompanyUpdateController();

export async function companyRoutes(app: FastifyInstance) {
    app.post("/add", createCompanyController.create);
    app.put("/:id",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.ADMIN])] },
        updateCompanyController.update);
}

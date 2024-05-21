import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middleware/verify-jwt";
import { verifyUserType } from "../../middleware/verify-user-type";
import { CreateAbsenceController } from "../controllers/absence/create-absence-controller";
import { DeleteAbsenceController } from "../controllers/absence/delete-absence-controller";
import { FindManyAbsenceByCompanyIdController } from "../controllers/absence/find-many-absence-by-company-id-controller";
import { UpdateAbsenceController } from "../controllers/absence/update-absence-controller";
import { CreateAttachmentController } from "../controllers/attachment/create-attachment-controller";
import { DeleteAttachmentController } from "../controllers/attachment/delete-attachment-controller";

const createAbsenceController = new CreateAbsenceController();
const updateAbsenceController = new UpdateAbsenceController();
const deleteAbsenceController = new DeleteAbsenceController();
const findManyAbsenceByCompanyIdController = new FindManyAbsenceByCompanyIdController();
const createAttachmentController = new CreateAttachmentController();
const deleteAttachmentController = new DeleteAttachmentController();

export async function absenceRoutes(app: FastifyInstance) {
    app.post("/add",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        createAbsenceController.create);
    app.put("/:id",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        updateAbsenceController.update);
    app.delete("/:id",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        deleteAbsenceController.delete);
    app.get("/",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        findManyAbsenceByCompanyIdController.find);
    app.post("/:absenceId/attachment",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        createAttachmentController.create);
    app.delete("/attachment/:attachmentId",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.BASIC, UserRoleEnum.ADMIN])] },
        deleteAttachmentController.delete);
}


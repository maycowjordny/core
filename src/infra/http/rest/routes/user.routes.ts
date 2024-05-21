import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middleware/verify-jwt";
import { verifyUserType } from "../../middleware/verify-user-type";
import { ValidateConfirmationCodeController } from "../controllers/company/validate-confirmation-code-controller";
import { ForgotPasswordController } from "../controllers/user/forgot-password-controller";
import { ResetPasswordController } from "../controllers/user/reset-password-controller";
import { UserUpdateController } from "../controllers/user/update-user-controller";

const updateUserController = new UserUpdateController();
const validateConfirmationCodeController = new ValidateConfirmationCodeController();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

export async function userRoutes(app: FastifyInstance) {
    app.put("/:id",
        { onRequest: [verifyJwt, verifyUserType(UserTypesEnum.COMPANY, [UserRoleEnum.ADMIN])] }, updateUserController.update);
    app.patch("/activate-account", validateConfirmationCodeController.validate);
    app.post("/forgot-password", forgotPasswordController.forgotPassword);
    app.patch("/reset-password", resetPasswordController.resetPassword);
}

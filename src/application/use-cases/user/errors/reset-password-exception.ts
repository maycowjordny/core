import { UseCaseError } from "@/application/errors/use-case-errors";

export class ResetPasswordException extends UseCaseError {
    constructor(err: string) {
        super(`Cannot reset password with error: ${err && err}`);
        this.name = "ResetPasswordException";
    }
}

import { UseCaseError } from "@/application/errors/use-case-errors";

export class ForgotPasswordException extends UseCaseError {
    constructor(err: string) {
        super(`Cannot forgot password with error: ${err && err}`);
        this.name = "ForgotPasswordException";
    }
}

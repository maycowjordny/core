import { DomainError } from "@/core/domain/errors/domain-error";

export class ValidateConfirmationCodeException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot validade confirmation code with error: '${error ? error : "generic"}'.`);
        this.name = "ValidateCodeConfirmationException";
    }
}

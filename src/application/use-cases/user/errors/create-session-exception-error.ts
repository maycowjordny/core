import { DomainError } from "@/core/domain/errors/domain-error";

export class ValidatePasswordException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot create session with error: '${error ? error : "generic"}'.`);
        this.name = "CreateSessionException";
    }
}

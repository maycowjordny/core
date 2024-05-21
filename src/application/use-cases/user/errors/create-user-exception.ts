import { DomainError } from "@/core/domain/errors/domain-error";

export class CreateUserException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot create user with error: '${error ? error : "generic"}'.`);
        this.name = "CreateUserException";
    }
}

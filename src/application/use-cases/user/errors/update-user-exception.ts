import { DomainError } from "@/core/domain/errors/domain-error";

export class UpdateUserException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot update user with error: '${error ? error : "generic"}'.`);
        this.name = "UpdateUserException";
    }
}

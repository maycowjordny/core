import { DomainError } from "@/core/domain/errors/domain-error";

export class CreateAbsenceException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot create absence with error: '${error ? error : "generic"}'.`);
        this.name = "CreateAbsenceException";
    }
}

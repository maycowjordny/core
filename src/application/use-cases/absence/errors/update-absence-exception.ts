import { DomainError } from "@/core/domain/errors/domain-error";

export class UpdateAbsenceException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot update absence with error: '${error ? error : "generic"}'.`);
        this.name = "UpdateAbsenceException";
    }
}

import { DomainError } from "@/core/domain/errors/domain-error";

export class DeleteAbsenceException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot delete absence with error: '${error ? error : "generic"}'.`);
        this.name = "DeleteAbsenceException";
    }
}

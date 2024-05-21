import { DomainError } from "@/core/domain/errors/domain-error";

export class UpdateEmployeeException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot update employee with error: '${error ? error : "generic"}'.`);
        this.name = "UpdateEmployeeException";
    }
}

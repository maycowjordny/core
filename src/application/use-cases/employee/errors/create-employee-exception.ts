import { DomainError } from "@/core/domain/errors/domain-error";

export class CreateEmployeeException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot create employee with error: '${error ? error : "generic"}'.`);
        this.name = "CreateEmployeeException";
    }
}

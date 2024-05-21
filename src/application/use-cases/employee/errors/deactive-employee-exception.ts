import { DomainError } from "@/core/domain/errors/domain-error";

export class DeactivateEmployeeException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot deactive employee with error: '${error ? error : "generic"}'.`);
        this.name = "DeactiveEmployeeException";
    }
}

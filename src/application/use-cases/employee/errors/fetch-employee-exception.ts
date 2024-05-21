import { DomainError } from "@/core/domain/errors/domain-error";

export class FetchEmployeeException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot fetch employee with error: '${error ? error : "generic"}'.`);
        this.name = "FetchEmployeeException";
    }
}

import { DomainError } from "@/core/domain/errors/domain-error";

export class CreateCompanyException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot create company with error: '${error ? error : "generic"}'.`);
        this.name = "CreateCompanyException";
    }
}

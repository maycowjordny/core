import { DomainError } from "@/core/domain/errors/domain-error";

export class UpdateCompanyException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot update company with error: '${error ? error : "generic"}'.`);
        this.name = "UpdateCompanyException";
    }
}

import { DomainError } from "@/core/domain/errors/domain-error";

export class DeleteWorkPeriodException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot delete workperiod with error: '${error ? error : "generic"}'.`);
        this.name = "DeleteWorkPeriodException";
    }
}

import { DomainError } from "@/core/domain/errors/domain-error";

export class DetermineEmployeePaySummaryException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot determine employee pay summary with error: '${error ? error : "generic"}'.`);
        this.name = "DetermineEmployeePaySummaryException";
    }
}

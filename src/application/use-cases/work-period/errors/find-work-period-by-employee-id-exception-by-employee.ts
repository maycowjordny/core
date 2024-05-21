import { DomainError } from "@/core/domain/errors/domain-error";

export class FindWorkPeriodByEmployeeIdAndTimeWindowException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot list work period with error: '${error ? error : "generic"}'.`
        );
        this.name = "FindWorkPeriodByEmployeeIdAndTimeWindowException";
    }
}

import { DomainError } from "@/core/domain/errors/domain-error";

export class FetchWorkPeriodException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot fetch work period with error: '${error ? error : "generic"
            }'.`
        );
        this.name = "FetchWorkPeriodException";
    }
}

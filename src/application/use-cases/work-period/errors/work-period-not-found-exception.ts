import { DomainError } from "@/core/domain/errors/domain-error";

export class WorkPeriodNotFoundException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot work period with error: '${error ? error : "generic"}'.`
        );
        this.name = "WorkPeriodNotFoundException";
    }
}

import { DomainError } from "@/core/domain/errors/domain-error";

export class CreateExtraWorkPeriodException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot create extra work period with error: '${error ? error : "generic"
            }'.`
        );
        this.name = "CreateExtraWorkPeriodException";
    }
}

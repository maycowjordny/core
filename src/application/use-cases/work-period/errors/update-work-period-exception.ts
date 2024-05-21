import { DomainError } from "@/core/domain/errors/domain-error";

export class UpdateWorkPeriodException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot update work period with error: '${error ? error : "generic"}'.`
        );
        this.name = "UpdateWorkPeriodException";
    }
}

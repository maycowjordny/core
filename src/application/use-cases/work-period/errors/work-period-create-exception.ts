import { DomainError } from "@/core/domain/errors/domain-error";

export class CreateWorkPeriodException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot create  work period with error: '${error ? error : "generic"}'.`
        );
        this.name = "CreateWorkPeriodException";
    }
}

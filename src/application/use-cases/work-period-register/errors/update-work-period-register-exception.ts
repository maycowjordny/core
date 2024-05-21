import { DomainError } from "@/core/domain/errors/domain-error";

export class UpdateWorkPeriodRegisterException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot update  work period register with error: '${error ? error : "generic"
            }'.`
        );
        this.name = "updateWorkPeriodRegisterException";
    }
}

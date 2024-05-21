import { DomainError } from "@/core/domain/errors/domain-error";

export class CreateWorkPeriodRegisterException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot create  work period register with error: '${error ? error : "generic"
            }'.`
        );
        this.name = "CreateWorkPeriodRegisterException";
    }
}

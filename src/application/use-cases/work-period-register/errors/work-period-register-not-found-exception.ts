import { DomainError } from "@/core/domain/errors/domain-error";

export class WorkPeriodRegisterNotFoundException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot work period register with error: '${error ? error : "generic"}'.`
        );
        this.name = "WorkPeriodRegisterNotFoundException";
    }
}

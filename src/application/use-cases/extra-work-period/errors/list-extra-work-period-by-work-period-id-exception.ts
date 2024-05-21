import { DomainError } from "@/core/domain/errors/domain-error";

export class ListExtraWorkPeriodByWorkPeriodIdException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot list extra work period with error: '${error ? error : "generic"
            }'.`
        );
        this.name = "ListExtraWorkPeriodByWorkPeriodIdException";
    }
}

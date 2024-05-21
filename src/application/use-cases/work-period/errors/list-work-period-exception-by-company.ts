import { DomainError } from "@/core/domain/errors/domain-error";

export class FindManyWorkPeriodByCompanyIdException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot find many work period by companyId with error: '${error ? error : "generic"}'.`
        );
        this.name = "FindManyWorkPeriodByCompanyIdException";
    }
}

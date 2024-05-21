import { DomainError } from "@/core/domain/errors/domain-error";

export class FindAbsenceByCompanyIdException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot find absence by companyId with error: '${error ? error : "generic"}'.`);
        this.name = "FindAbsenceByCompanyIdException";
    }
}

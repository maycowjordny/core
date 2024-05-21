import { DomainError } from "@/core/domain/errors/domain-error";

export class FindManyEmployeeByCompanyIdException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot find many employee by companyId with error: '${error ? error : "generic"}'.`);
        this.name = "FindManyEmployeeByCompanyIdException";
    }
}

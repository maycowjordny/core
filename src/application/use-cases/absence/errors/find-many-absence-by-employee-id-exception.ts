import { DomainError } from "@/core/domain/errors/domain-error";

export class FindAbsenceByEmployeeIdException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot find absence by EmployeeId with error: '${error ? error : "generic"}'.`);
        this.name = "FindAbsenceByEmployeeIdException";
    }
}

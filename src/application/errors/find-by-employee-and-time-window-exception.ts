import { DomainError } from "@/core/domain/errors/domain-error";

export class FindByEmployeeAndTimeWindowException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot find by employee and time window with error: '${error ? error : "generic"
            }'.`
        );
        this.name = "findByEmployeeAndTimeWindowException";
    }
}

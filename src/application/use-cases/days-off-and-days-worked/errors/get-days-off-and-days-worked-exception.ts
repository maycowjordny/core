import { DomainError } from "@/core/domain/errors/domain-error";

export class GetDaysOffAndDaysWorkedException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot get days off and days worked with error: '${error ? error : "generic"}'.`
        );
        this.name = " GetDaysOffAndDaysWorkedException";
    }
}

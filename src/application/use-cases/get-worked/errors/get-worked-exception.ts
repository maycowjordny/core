import { DomainError } from "@/core/domain/errors/domain-error";

export class GetHoursWorkedException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot get hours worked with error: '${error ? error : "generic"
            }'.`
        );
        this.name = "GetHoursWorkedException";
    }
}

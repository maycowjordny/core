import { DomainError } from "@/core/domain/errors/domain-error";

export class AbsenceNotFoundException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot found  absence with error: '${error ? error : "generic"}'.`);
        this.name = "AbsenceNotFoundException";
    }
}

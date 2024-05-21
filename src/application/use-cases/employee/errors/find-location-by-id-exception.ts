import { DomainError } from "@/core/domain/errors/domain-error";

export class FindLocationByIdException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot findLocationById  with error: '${error ? error : "generic"}'.`);
        this.name = "FindLocationByIdException";
    }
}

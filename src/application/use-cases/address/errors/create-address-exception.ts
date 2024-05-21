import { DomainError } from "@/core/domain/errors/domain-error";

export class CreateAddressException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot create address with error: '${error ? error : "generic"}'.`);
        this.name = "CreateAddressException";
    }
}

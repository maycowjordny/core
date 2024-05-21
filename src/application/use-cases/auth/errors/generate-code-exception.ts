import { DomainError } from "@/core/domain/errors/domain-error";

export class SendEmailException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot generate code with error: '${error ? error : "generic"}'.`);
        this.name = "SendEmailException";
    }
}

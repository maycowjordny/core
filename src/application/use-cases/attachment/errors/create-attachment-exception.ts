import { DomainError } from "@/core/domain/errors/domain-error";

export class CreateAttachmentException extends Error implements DomainError {
    constructor(error?: any) {
        super(`Cannot create attachment with error: '${error ?? "generic"}'.`);
        this.name = "CreateAttachmentException";
    }
}

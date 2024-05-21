import { DomainError } from "@/core/domain/errors/domain-error";

export class UpdateAttachmentException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot update attachment with error: '${error ? error : "generic"}'.`);
        this.name = "UpdateAttachmentException";
    }
}

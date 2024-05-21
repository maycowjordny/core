import { DomainError } from "@/core/domain/errors/domain-error";

export class DeleteAttachmentException extends Error implements DomainError {
    constructor(error?: any) {
        super(`Cannot delete attachment with error: '${error ?? "generic"}'.`);
        this.name = "DeleteAttachmentException";
    }
}

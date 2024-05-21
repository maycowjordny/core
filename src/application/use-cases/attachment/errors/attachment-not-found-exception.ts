import { DomainError } from "@/core/domain/errors/domain-error";

export class AttachmentNotFoundException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Attachment not found with error: '${error ? error : "generic"}'.`);
        this.name = "AttachmentNotFoundException";
    }
}

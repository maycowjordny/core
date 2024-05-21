import { DomainError } from "@/core/domain/errors/domain-error";

export class FindAttachmentByIdException extends Error implements DomainError {
    constructor(error?: any) {
        super(`Cannot find attachment by id with error: '${error ?? "generic"}'.`);
        this.name = "FindAttachmentByIdException";
    }
}

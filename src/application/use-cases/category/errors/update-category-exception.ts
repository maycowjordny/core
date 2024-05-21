import { DomainError } from "@/core/domain/errors/domain-error";

export class UpdateCategoryException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot update category with error: '${error ? error : "generic"}'.`);
        this.name = "UpdateCategoryException";
    }
}

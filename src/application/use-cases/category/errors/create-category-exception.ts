import { DomainError } from "@/core/domain/errors/domain-error";

export class CreateCategoryException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot create category with error: '${error ? error : "generic"}'.`);
        this.name = "CreateCategoryException";
    }
}

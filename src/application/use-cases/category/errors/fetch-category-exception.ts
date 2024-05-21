import { DomainError } from "@/core/domain/errors/domain-error";

export class FetchCategoryException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot fetch category with error: '${error ? error : "generic"}'.`);
        this.name = "FetchCategoryException";
    }
}

import { DomainError } from "@/core/domain/errors/domain-error";

export class CategoryAlreadyExistException extends Error implements DomainError {
    constructor() {
        super("Category already exist");
        this.name = "CategoryAlreadyExistException";
    }
}

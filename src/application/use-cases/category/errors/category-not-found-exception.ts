import { DomainError } from "@/core/domain/errors/domain-error";

export class CategoryNotFoundException extends Error implements DomainError {
    constructor() {
        super("Category not found");
        this.name = "CategoryNotFoundException";
    }
}

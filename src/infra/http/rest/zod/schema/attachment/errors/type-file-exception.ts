import { DomainError } from "@/core/domain/errors/domain-error";

export class TypeFileException extends Error implements DomainError {
    constructor() {
        super("Unsupported file type");
        this.name = "TypeFileException";
    }
}

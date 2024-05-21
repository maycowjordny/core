import { DomainError } from "@/core/domain/errors/domain-error";

export class MaxSizeFileException extends Error implements DomainError {
    constructor() {
        super("File size exceeds allowed limit");
        this.name = "MaxSizeFileException";
    }
}

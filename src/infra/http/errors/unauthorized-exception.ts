import { DomainError } from "@/core/domain/errors/domain-error";

export class UnauthorizedException extends Error implements DomainError {
    constructor() {
        super("Unauthorized.");
        this.name = "Unauthorized";
    }
}

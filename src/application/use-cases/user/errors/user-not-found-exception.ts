import { DomainError } from "@/core/domain/errors/domain-error";

export class UserNotFoundException extends Error implements DomainError {
    constructor() {
        super("User not found");
        this.name = "UserNotFoundException";
    }
}

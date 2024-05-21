import { DomainError } from "@/core/domain/errors/domain-error";

export class GenerateTokenException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot generate token with error: '${error ? error : "generic"}'.`);
        this.name = "CreateGenerateTokenException";
    }
}

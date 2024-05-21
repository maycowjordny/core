import { DomainError } from "@/core/domain/errors/domain-error";

export class makeTimeTrackException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot make time track with error: '${error ? error : "generic"
            }'.`
        );
        this.name = "makeTimeTrackException";
    }
}

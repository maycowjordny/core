import { DomainError } from "@/core/domain/errors/domain-error";

export class ExtraWorkPeriodNotFoundException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot found extra work period with error: '${error ? error : "generic"
            }'.`
        );
        this.name = "ExtraWorkPeriodNotFoundException";
    }
}

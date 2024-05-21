
import { DomainError } from "@/core/domain/errors/domain-error";

export class FindWorkPeriodByCodWorkPeriodAndDayException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot find workperiod with error: '${error ? error : "generic"}'.`);
        this.name = "FindWorkPeriodByCodWorkPeriodAndDayException";
    }
}


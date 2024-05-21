import { DomainError } from "@/core/domain/errors/domain-error";

export class SummariseEmployeeSalaryException extends Error implements DomainError {
    constructor(error?: string) {
        super(
            `Cannot create summarise employee salary with error: '${error ? error : "generic"}'.`
        );
        this.name = "SummariseEmployeeSalaryException";
    }
}

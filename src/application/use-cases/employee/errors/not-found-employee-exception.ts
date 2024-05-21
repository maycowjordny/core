import { DomainError } from "@/core/domain/errors/domain-error";

export class EmployeeNotFoundException extends Error implements DomainError {
    constructor() {
        super("Employee not found");
        this.name = "EmployeeNotFoundException";
    }
}

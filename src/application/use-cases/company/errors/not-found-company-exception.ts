import { DomainError } from "@/core/domain/errors/domain-error";

export class CompanyNotFoundException extends Error implements DomainError {
    constructor() {
        super("Company not found");
        this.name = "CompanyNotFoundException";
    }
}

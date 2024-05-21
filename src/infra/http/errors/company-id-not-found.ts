import { DomainError } from "@/core/domain/errors/domain-error";

export class CompanyIdNotFoundException extends Error implements DomainError {
    constructor() {
        super("CompanyId not found");
        this.name = "CompanyNotFoundException";
    }
}

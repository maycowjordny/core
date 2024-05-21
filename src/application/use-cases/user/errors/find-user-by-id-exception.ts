import { UseCaseError } from "@/application/errors/use-case-errors";

export class FindUserbyIdException extends UseCaseError {
    constructor(err: string) {
        super(`Cannot list User with error: ${err && err}`);
        this.name = "ListPetException";
    }
}

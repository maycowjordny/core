import { InMemoryUserRepository } from "@/infra/database/in-memory-repository/in-memory-user-repository";
import { makeFakeUser } from "test/factories/user-factory";
import { beforeEach, describe, expect, it } from "vitest";
import { FindUserByEmailAndConfirmationCodeUseCase } from "./find-user-by-email-and-confirmation-code";

describe("FindUserByEmailAndConfirmationCodeUseCase", () => {
    let usersRepository: InMemoryUserRepository;
    let findUserByEmailAndConfirmationCodeUseCase: FindUserByEmailAndConfirmationCodeUseCase;
    beforeEach(() => {
        usersRepository = new InMemoryUserRepository();
        findUserByEmailAndConfirmationCodeUseCase = new FindUserByEmailAndConfirmationCodeUseCase(usersRepository);
    });

    it("should be able to find an user by email and condfirmation code", async () => {
        const user = makeFakeUser({
            id: "userId-01",
            email: "test@gmail.com",
            confirmationCode: "999999"
        });

        usersRepository.create(user);

        const output = await findUserByEmailAndConfirmationCodeUseCase.execute({
            confirmationCode: user.confirmationCode!,
            email: user.email
        });

        const response = {
            id: "userId-01",
            email: "test@gmail.com",
            confirmationCode: "999999"
        };

        expect(output).toMatchObject(response);
    });

    it("should returning null when email not found", async () => {
        const user = makeFakeUser({
            id: "userId-01",
            email: "test@gmail.com",
            confirmationCode: "999999"
        });

        const output = await findUserByEmailAndConfirmationCodeUseCase.execute({
            confirmationCode: user.confirmationCode!,
            email: user.email
        });

        expect(output).toBeNull;
    });
});

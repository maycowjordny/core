import { InMemoryUserRepository } from "@/infra/database/in-memory-repository/in-memory-user-repository";
import { makeFakeUser } from "test/factories/user-factory";
import { beforeEach, describe, expect, it } from "vitest";
import { FindUserByEmailAndResetTokenUseCase } from "./find-user-by-email-and-reset-token-code";

describe("FindUserByEmailAndResetTokenUseCase", () => {
    let usersRepository: InMemoryUserRepository;
    let findUserByEmailAndResetTokenUseCase: FindUserByEmailAndResetTokenUseCase;
    beforeEach(() => {
        usersRepository = new InMemoryUserRepository();
        findUserByEmailAndResetTokenUseCase = new FindUserByEmailAndResetTokenUseCase(usersRepository);
    });

    it("should be able to find an user by email and condfirmation code", async () => {
        const user = makeFakeUser({
            id: "userId-01",
            email: "test@gmail.com",
            resetToken: "999999"
        });

        usersRepository.create(user);

        const output = await findUserByEmailAndResetTokenUseCase.execute({
            resetToken: user.resetToken!,
            email: user.email
        });

        const response = {
            id: "userId-01",
            email: "test@gmail.com",
            resetToken: "999999"
        };

        expect(output).toMatchObject(response);
    });

    it("should returning null when email not found", async () => {
        const user = makeFakeUser({
            id: "userId-01",
            email: "test@gmail.com",
            resetToken: "999999"
        });

        const output = await findUserByEmailAndResetTokenUseCase.execute({
            resetToken: user.resetToken!,
            email: user.email
        });

        expect(output).toBeNull;
    });
});

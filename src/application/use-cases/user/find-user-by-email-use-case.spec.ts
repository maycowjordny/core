import { InMemoryUserRepository } from "@/infra/database/in-memory-repository/in-memory-user-repository";
import { makeFakeUser } from "test/factories/user-factory";
import { beforeEach, describe, expect, it } from "vitest";
import { FindUserByEmailUseCase } from "./find-user-by-email-use-case";

describe("FindUserByEmailUseCase", () => {
    let usersRepository: InMemoryUserRepository;
    let findByEmailUserUseCase: FindUserByEmailUseCase;
    beforeEach(() => {
        usersRepository = new InMemoryUserRepository();
        findByEmailUserUseCase = new FindUserByEmailUseCase(usersRepository);
    });

    it("should be able to find an user by email", async () => {
        const user = makeFakeUser({
            id: "userId-1",
            email: "test@gmail.com",
        });

        usersRepository.create(user);

        const output = await findByEmailUserUseCase.execute(user.email);

        const response = {
            id: "userId-1",
            email: "test@gmail.com",
        };

        expect(output).toMatchObject(response);
    });

    it("should returning null when email not found", async () => {
        const user = makeFakeUser({ email: "test@gmail.com" });

        const output = await findByEmailUserUseCase.execute(user.email);

        expect(output).toBeNull;
    });
});

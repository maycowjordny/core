import { UpdateUserProps } from "@/domain/interfaces/user";
import { InMemoryUserRepository } from "@/infra/database/in-memory-repository/in-memory-user-repository";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { makeFakeUser } from "test/factories/user-factory";
import { userRepositoryMock } from "test/mock/user-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { UpdateUserException } from "./errors/update-user-exception";
import { UserNotFoundException } from "./errors/user-not-found-exception";
import { UpdateUserUseCase } from "./update-user-use-case";

describe("UpdateUserUseCase", () => {
    let usersRepository: InMemoryUserRepository;
    let updateUserUseCase: UpdateUserUseCase;

    beforeEach(() => {
        usersRepository = new InMemoryUserRepository();
        updateUserUseCase = new UpdateUserUseCase(usersRepository);
    });

    it("should be able to update an user", async () => {
        const user = makeFakeUser();

        const response: UpdateUserProps = {
            id: user.id!,
            email: user.email,
            name: user.name,
            password: user.password,
        };

        usersRepository.create(user);

        const output = await updateUserUseCase.execute(response);

        expect(output).toMatchObject(response);
    });

    it("cannot update an user when generic error", async () => {
        userRepositoryMock.update.mockRejectedValue(new Error());

        const updateUserUseCase = new UpdateUserUseCase(userRepositoryMock);

        const user = makeFakeUser();

        await expect(updateUserUseCase.execute({ ...user.props, id: user.id! })).rejects.toThrow(
            UpdateUserException
        );
    });

    it("cannot update an user when prisma not found error", async () => {
        userRepositoryMock.update.mockRejectedValue({
            code: PRISMA_NOT_FOUND_EXCEPTION,
        });

        const updateUserUseCase = new UpdateUserUseCase(userRepositoryMock);

        const user = makeFakeUser();

        await expect(updateUserUseCase.execute({ ...user.props, id: user.id! })).rejects.toThrow(
            UserNotFoundException
        );
    });
});

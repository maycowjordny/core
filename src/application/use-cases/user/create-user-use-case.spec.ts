import { beforeEach, describe, expect, it } from "vitest";
import { CreateUserUseCase } from "./create-user-use-case";
import { InMemoryUserRepository } from "@/infra/database/in-memory-repository/in-memory-user-repository";
import { makeFakeUser } from "test/factories/user-factory";
import { PRISMA_UNIQUE_KEY_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { CreateUserEmailException } from "./errors/create-user-email-exception";
import { CreateUserException } from "./errors/create-user-exception";
import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { userRepositoryMock } from "test/mock/user-mock";

describe("CreateUseCase", () => {
    let usersRepository: InMemoryUserRepository;
    let userUseCase: CreateUserUseCase;

    beforeEach(() => {
        usersRepository = new InMemoryUserRepository();
        userUseCase = new CreateUserUseCase(usersRepository);
    });

    it("should be able to create user", async () => {
        const user = makeFakeUser();
        const output = await userUseCase.execute(user);

        expect(output).toMatchObject({
            id: expect.any(String),
            name: output.name,
            email: output.email,
            password: output.password,
            type: UserTypesEnum.COMPANY,
            role: UserRoleEnum.BASIC,
        });
    });

    it("should be create an user of COMPANY type", async () => {
        const user = makeFakeUser({ type: UserTypesEnum.COMPANY });
        const output = await userUseCase.execute(user);

        expect(output).toMatchObject({
            id: expect.any(String),
            name: output.name,
            email: output.email,
            password: output.password,
            type: UserTypesEnum.COMPANY,
            role: UserRoleEnum.BASIC,
        });
    });

    it("should be create an user of EMPLOYEE type", async () => {
        const user = makeFakeUser({ type: UserTypesEnum.EMPLOYEE });
        const output = await userUseCase.execute(user);

        expect(output).toMatchObject({
            name: output.name,
            email: output.email,
            password: output.password,
            type: UserTypesEnum.EMPLOYEE,
            role: UserRoleEnum.BASIC,
        });
    });

    it("cannot create an user when duplicated email", async () => {
        userRepositoryMock.create.mockRejectedValue({
            code: PRISMA_UNIQUE_KEY_EXCEPTION,
        });
        const createUserUseCase = new CreateUserUseCase(userRepositoryMock);

        const user = makeFakeUser({ email: "emailDuplicated@gmail.com" });

        await expect(createUserUseCase.execute(user)).rejects.toThrow(
            CreateUserEmailException
        );
    });

    it("should not create an user when generic error", async () => {
        userRepositoryMock.create.mockRejectedValue(CreateUserException);
        const createUserUseCase = new CreateUserUseCase(userRepositoryMock);

        const user = makeFakeUser();

        await expect(createUserUseCase.execute(user)).rejects.toThrow(
            CreateUserException
        );
    });
});

import { InMemoryUserRepository } from "@/infra/database/in-memory-repository/in-memory-user-repository";
import { hashPassword } from "@/utils/generate-hash";
import { makeFakeUser } from "test/factories/user-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GenerateJwtUseCase } from "../auth/generate-jwt-use-case";
import { ValidatePasswordException } from "./errors/create-session-exception-error";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { ValidatePasswordUseCase } from "./validate-password-use-case";

describe("ValidatePasswordUseCase", () => {
    let userRepository: InMemoryUserRepository;
    let validatePassword: ValidatePasswordUseCase;
    let generateJwtUseCase: GenerateJwtUseCase;

    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        generateJwtUseCase = new GenerateJwtUseCase();
        validatePassword = new ValidatePasswordUseCase(userRepository, generateJwtUseCase);
    });

    it("should be able to validade password", async () => {
        const user = makeFakeUser({
            email: "test@example.com",
            password: await hashPassword("Test123"),
            id: "userId-01",
        });

        await userRepository.create(user);

        const { accessToken } = await validatePassword.execute({
            email: "test@example.com",
            password: "Test123",
        });

        expect(accessToken).toEqual(expect.any(String));
        expect(accessToken).not.toBeUndefined();
        expect(accessToken).not.toBeNull();
    });

    it("cannot validade password with wrong password", async () => {
        const user = makeFakeUser({ password: "password" });

        await expect(() =>
            validatePassword.execute({
                email: user.email,
                password: "invalidPassword",
            })
        ).rejects.toThrow(InvalidCredentialsError);
    });

    it("cannot validade password with wrong email", async () => {
        const user = makeFakeUser({ email: "test@example.com" });

        await expect(() =>
            validatePassword.execute({
                email: "invalidEmail@example.com",
                password: user.password,
            })
        ).rejects.toThrow(InvalidCredentialsError);
    });

    it("cannot validade confirmation code with generic error", async () => {
        const user = makeFakeUser();

        userRepository.create(user);

        vi.spyOn(validatePassword, "execute").mockRejectedValue(new ValidatePasswordException());

        await expect(() => validatePassword.execute({
            email: user.email,
            password: user.password,
        })
        ).rejects.toThrow(ValidatePasswordException);
    });
});

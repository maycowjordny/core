import { InMemoryUserRepository } from "@/infra/database/in-memory-repository/in-memory-user-repository";
import { UserStatus } from "@prisma/client";
import { makeFakeUser } from "test/factories/user-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GenerateJwtUseCase } from "../auth/generate-jwt-use-case";
import { InvalidCodeConfirmationError } from "./errors/invalid-code-confirmation-exception";
import { ValidateConfirmationCodeException } from "./errors/validade-code-confirmation-exception";
import { ValidateCodeConfirmationUseCase } from "./validate-confirmation-code-use-case";

describe("ValidateCodeConfirmationUseCase", () => {
    let userRepository: InMemoryUserRepository;
    let validateCodeConfirmationUseCase: ValidateCodeConfirmationUseCase;

    let generateJwtUseCase: GenerateJwtUseCase;

    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        generateJwtUseCase = new GenerateJwtUseCase();
        validateCodeConfirmationUseCase = new ValidateCodeConfirmationUseCase(userRepository, generateJwtUseCase);
    });

    it("should be able to validade code confirmation", async () => {
        vi.spyOn(userRepository, "update");
        vi.spyOn(userRepository, "findByEmailAndConfirmationCode");

        const user = makeFakeUser({
            id: "userId-01",
            email: "test@example.com",
            confirmationCode: "999999"
        });

        userRepository.create(user);

        const { accessToken } = await validateCodeConfirmationUseCase.execute({ confirmationCode: user.confirmationCode!, email: user.email });

        expect(userRepository.update).toHaveBeenCalledWith(expect.objectContaining({
            status: UserStatus.ACTIVE,
        }));
        expect(userRepository.findByEmailAndConfirmationCode).toHaveBeenCalledWith(expect.objectContaining({
            email: user.email,
            confirmationCode: user.confirmationCode,
        }));
        expect(accessToken).toEqual(expect.any(String));
        expect(accessToken).not.toBeUndefined();
        expect(accessToken).not.toBeNull();
    });

    it("cannot validade confirmation code with wrong confirmation code", async () => {
        const user = makeFakeUser({ confirmationCode: "999999" });

        await expect(() => validateCodeConfirmationUseCase.execute({
            email: user.email, confirmationCode: "888888"
        })).rejects.toThrow(InvalidCodeConfirmationError);
    });

    it("cannot validade confirmation code with wrong email", async () => {
        const user = makeFakeUser({ email: "test@example.com" });

        await expect(() =>
            validateCodeConfirmationUseCase.execute({
                email: "invalidEmail@example.com",
                confirmationCode: user.confirmationCode!,
            })
        ).rejects.toThrow(InvalidCodeConfirmationError);
    });

    it("cannot validade confirmation code with generic error", async () => {
        const user = makeFakeUser();

        userRepository.create(user);

        vi.spyOn(validateCodeConfirmationUseCase, "execute").mockRejectedValue(new ValidateConfirmationCodeException());

        await expect(() => validateCodeConfirmationUseCase.execute({
            email: user.email,
            confirmationCode: user.confirmationCode!,
        })
        ).rejects.toThrow(ValidateConfirmationCodeException);
    });
});

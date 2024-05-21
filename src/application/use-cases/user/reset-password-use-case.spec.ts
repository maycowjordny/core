import { ResetPassword } from "@/domain/interfaces/user";
import { InMemoryUserRepository } from "@/infra/database/in-memory-repository/in-memory-user-repository";
import { hashPassword } from "@/utils/generate-hash";
import { makeFakeUser } from "test/factories/user-factory";
import { token } from "test/jwt/constants";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ResetPasswordException } from "./errors/reset-password-exception";
import { UserNotFoundException } from "./errors/user-not-found-exception";
import { ResetPasswordUseCase } from "./reset-password-use-case";

describe("ResetPasswordUseCase", () => {
    let usersRepository: InMemoryUserRepository;
    let resetPasswordUseCase: ResetPasswordUseCase;

    beforeEach(() => {
        usersRepository = new InMemoryUserRepository();
        resetPasswordUseCase = new ResetPasswordUseCase(usersRepository);
    });

    it("should be able to reset password", async () => {

        vi.mock("jsonwebtoken", () => {
            return {
                verify: vi.fn(() => ({ email: "test@example.com" })),
            };
        });

        const user = makeFakeUser({ password: await hashPassword("OldPassword123"), resetToken: token });
        vi.spyOn(usersRepository, "update");

        usersRepository.create(user);

        const resetPasswordData: ResetPassword = {
            email: user.email,
            token: token,
            newPassword: "newPassword123",
        };

        await resetPasswordUseCase.execute(resetPasswordData);

        expect(usersRepository.update).toHaveBeenCalledWith(expect.objectContaining({
            password: expect.any(String),
        }));
        expect(usersRepository.update).toHaveBeenCalledWith(expect.objectContaining({
            resetToken: null,
        }));
        expect(usersRepository.update).toHaveBeenCalledTimes(1);
    });

    it("cannot reset password when generic error", async () => {
        vi.spyOn(usersRepository, "findByEmailAndResetToken").mockRejectedValue(Error);

        const resetPasswordData: ResetPassword = {
            email: "email@example.com",
            token: "token",
            newPassword: "newPassword123",
        };

        await expect(resetPasswordUseCase.execute(resetPasswordData)).rejects.toThrow(
            ResetPasswordException
        );
    });

    it("cannot reset password when prisma not found error", async () => {
        vi.spyOn(usersRepository, "findByEmailAndResetToken").mockResolvedValue(null);

        const resetPasswordData: ResetPassword = {
            email: "email@example.com",
            token: "token",
            newPassword: "newPassword123",
        };

        await expect(resetPasswordUseCase.execute(resetPasswordData)).rejects.toThrow(
            UserNotFoundException
        );
    });
});

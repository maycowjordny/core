import { InMemoryUserRepository } from "@/infra/database/in-memory-repository/in-memory-user-repository";
import { makeFakeUser } from "test/factories/user-factory";
import { token } from "test/jwt/constants";
import { SendEmailFaker } from "test/sendEmail/faker-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ForgotPasswordException } from "./errors/forgot-password-exception";
import { ForgotPasswordUseCase } from "./forgot-password-use-case";

vi.mock("jsonwebtoken", () => ({
    sign: vi.fn(() => token),
}));

describe("ForgotPasswordUseCase", () => {
    let usersRepository: InMemoryUserRepository;
    let forgotPasswordUseCase: ForgotPasswordUseCase;
    let sendEmailFaker: SendEmailFaker;

    beforeEach(() => {
        usersRepository = new InMemoryUserRepository();
        sendEmailFaker = new SendEmailFaker();
        forgotPasswordUseCase = new ForgotPasswordUseCase(usersRepository, sendEmailFaker);
    });

    it("should be able to forgot password", async () => {
        vi.spyOn(sendEmailFaker, "execute");
        vi.spyOn(usersRepository, "findByEmail");

        const user = makeFakeUser({ resetToken: token, email: "test@example.com" });

        usersRepository.create(user);

        await forgotPasswordUseCase.execute(user.email);

        expect(sendEmailFaker.execute).toHaveBeenCalled();
        expect(usersRepository.findByEmail).toHaveBeenCalled();
        expect(user.resetToken).toEqual(expect.any(String));
    });

    it("cannot forgot password when generic error", async () => {
        vi.spyOn(forgotPasswordUseCase, "execute").mockRejectedValue(new ForgotPasswordException("Error"));

        const user = makeFakeUser({ resetToken: token });

        usersRepository.create(user);

        await expect(forgotPasswordUseCase.execute(user.email)).rejects.toThrow(ForgotPasswordException);
    });
});

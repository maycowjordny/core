import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import { makeFakeUser } from "test/factories/user-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GenerateTokenException } from "./errors/generate-token-exception";
import { GenerateJwtUseCase } from "./generate-jwt-use-case";

describe("GenerateJwtUseCase", () => {
    let generateJwtUseCase: GenerateJwtUseCase;

    beforeEach(() => {
        generateJwtUseCase = new GenerateJwtUseCase();
    });

    const user = makeFakeUser();

    const payload: AuthPayload = {
        sub: user.id,
        companyId: user.companyId!,
        email: user.email,
        name: user.name,
        roles: UserRoleEnum[user.role],
        type: UserTypesEnum[user.type],
    };

    it("should be able to a generate token", async () => {

        const response = await generateJwtUseCase.execute(payload);

        expect(response).toMatchObject({ accessToken: expect.any(String) });
    });

    it("should be able to a generate token", async () => {

        vi.spyOn(generateJwtUseCase, "execute").mockRejectedValue(new GenerateTokenException());

        await expect(generateJwtUseCase.execute(payload)).rejects.toThrow(GenerateTokenException);
    });

});

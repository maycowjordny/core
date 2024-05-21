import { env } from "@/config/env";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import { AuthToken } from "@/domain/interfaces/auth/auth-token";
import { sign } from "jsonwebtoken";
import { GenerateTokenException } from "./errors/generate-token-exception";

export class GenerateJwtUseCase {

    async execute(payload: AuthPayload): Promise<AuthToken> {

        try {
            const token = sign(payload, env.JWT_SECRET, {
                expiresIn: env.EXPIRES_IN,
            });

            return { accessToken: token };
        } catch (err: any) {
            throw new GenerateTokenException(err);
        }
    }
}


import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import { formatToken } from "@/utils/format-token";
import { FastifyReply, FastifyRequest } from "fastify";
import { decode } from "jsonwebtoken";
import { UnauthorizedException } from "../errors/unauthorized-exception";

export function verifyUserType(typeToVerify: UserTypesEnum, roleToVerify: UserRoleEnum[]) {
    return async (request: FastifyRequest, response: FastifyReply) => {
        const bearerToken = request.headers["authorization"] as string;

        const token = formatToken(bearerToken);

        if (!token) throw new UnauthorizedException();

        const { type, roles } = decode(token) as AuthPayload;

        if (type !== typeToVerify || !roleToVerify.includes(roles!)) {
            return response.status(401).send({ message: "Unauthorized." });
        }
    };
}


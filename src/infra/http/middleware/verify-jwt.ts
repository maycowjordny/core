import { env } from "@/config/env";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import { formatToken } from "@/utils/format-token";
import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
    try {
        const token = formatToken(request.headers["authorization"] as string);

        const payload = verify(token, env.JWT_SECRET) as AuthPayload;

        request.user = payload;
    } catch (err) {
        return reply.status(401).send({ message: "Unauthorized." });
    }
}

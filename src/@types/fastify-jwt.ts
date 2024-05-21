import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import "fastify";

declare module "fastify" {
  export interface FastifyRequest {
    user: AuthPayload
  }
}

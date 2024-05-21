import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import FastifyStatic from "@fastify/static";
import fastify from "fastify";
import path from "path";
import { ZodError } from "zod";
import { env } from "./config/env";
import { appRoutes } from "./infra/http/rest/routes/index.routes";
export const app = fastify();

app.register(fastifyCookie);
app.register(multipart);
app.register(appRoutes);
app.register(cors, {
    origin: "*",
});

app.register(FastifyStatic, {
    root: path.join(__dirname, "public"),
    prefix: "/public/",
    list: true,
});

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: "Validation error", issues: error.format() });
    }
    if (env.NODE_ENV !== "production") {
        console.error(error);
    }

    return reply.status(500).send({ message: "Internal server error." });
});

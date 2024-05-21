import { app } from "./app";
import { env } from "./config/env";

const PORT = 4444;
app
    .listen({
        host: "0.0.0.0",
        port: env.PORT,
    })
    .then(() => {
        console.log(`🚀 HTTP Server is Running on ${PORT}!`);
    })
    .catch((err) => {
        console.log({ server: `❌ HTTP Server is Failed on ${PORT}!`, error: err });
    });

import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [tsConfigPaths()],
    test: {
        coverage: {
            exclude: [
                "src/application/use-cases/**/errors/*.ts"
            ],
            include: [
                "src/application/use-cases/**/*.ts",
                "src/utils/**/*.ts",
                "src/infra/storage/**/*.ts"
            ],
            provider: "v8"
        },
        environmentMatchGlobs: [["src/infra/http/rest/controllers/**", "prisma"]],
    },
});

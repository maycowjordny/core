import { expect, it } from "vitest";
import { hashPassword } from "./generate-hash";

it("should be able to create a hash of the user's password", async () => {
    const password = "secretPassword";
    const hashedPassword = await hashPassword(password);

    expect(hashedPassword).not.toBeUndefined();
    expect(hashedPassword).not.toHaveLength(0);
});

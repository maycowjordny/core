import { expect, it } from "vitest";
import { generateCode } from "./generate-verification-code";

it("should generate a code with at least one letter and one number", () => {
    const codeLength = 6;
    const generatedCode = generateCode(codeLength);

    expect(generatedCode.length).toBe(codeLength);

    expect(/[0-9]/.test(generatedCode)).toBe(true);
    expect(/[A-Z]/.test(generatedCode)).toBe(true);

    expect(/^[0-9A-Z]+$/.test(generatedCode)).toBe(true);
});

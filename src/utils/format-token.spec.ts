import { expect, it } from "vitest";
import { formatToken } from "./format-token";

it("should be able to format token ", async () => {
    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1heWNvd2pvcmRueTIwMTVAZ21haWwuY29tIiwiaWF0IjoxNzExOTk1NDc0LCJleHAiOjE3MTE5OTYzNzR9.jS4F0U8EtNnTGS-q5QPA4PDcSu929cOpSsAM8WxwZEo";
    const tokenFormated = formatToken(token);

    expect(tokenFormated).not.includes("Bearer");
});

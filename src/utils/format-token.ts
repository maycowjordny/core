export function formatToken(token: string) {
    return token.replace("Bearer ", "").trim();
}

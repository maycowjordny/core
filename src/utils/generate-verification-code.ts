export function generateCode(length: number) {
    if (length < 2) {
        throw new Error(
            "Length must be at least 2 to include at least one number and one letter.",
        );
    }

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let code = "";

    code += letters.charAt(Math.floor(Math.random() * letters.length));
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));

    for (let i = 2; i < length; i++) {
        const choice = Math.random() < 0.5 ? letters : numbers;
        code += choice.charAt(Math.floor(Math.random() * choice.length));
    }

    return code
        .split("")
        .sort(() => 0.5 - Math.random())
        .join("");
}

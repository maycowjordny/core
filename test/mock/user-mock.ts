import { vi } from "vitest";

export const userRepositoryMock = {
    create: vi.fn(),
    findByEmail: vi.fn(),
    update: vi.fn(),
    findByEmailAndResetToken: vi.fn(),
    findByEmailAndConfirmationCode: vi.fn(),
};

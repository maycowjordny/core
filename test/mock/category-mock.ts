import { vi } from "vitest";

export const categoryRepositoryMock = {
    create: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
};

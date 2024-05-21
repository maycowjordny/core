import { vi } from "vitest";

export const absenceRepositoryMock = {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findManyByEmployee: vi.fn(),
    findManyByCompany: vi.fn(),
};

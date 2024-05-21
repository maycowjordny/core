import { vi } from "vitest";

export const employeeRepositoryMock = {
    create: vi.fn(),
    findById: vi.fn(),
    delete: vi.fn(),
    listByCompany: vi.fn(),
    deactivate: vi.fn(),
    checkNearby: vi.fn(),
    findLocationById: vi.fn(),
    findByNameOrCpf: vi.fn(),
    findManyByCompany: vi.fn(),
    update: vi.fn(),
};

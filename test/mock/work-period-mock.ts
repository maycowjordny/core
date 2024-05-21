import { vi } from "vitest";

export const workPeriodRepositoryMock = {
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    findByCodWorkPeriodAndDay: vi.fn(),
    findByCodWorkPeriod: vi.fn(),
    findManyByCompany: vi.fn(),
    list: vi.fn()
};

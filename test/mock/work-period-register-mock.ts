import { vi } from "vitest";

export const workPeriodRegisterRepositoryMock = {
    create: vi.fn(),
    findByEmployeeAndTimeWindow: vi.fn(),
    find: vi.fn(),
    update: vi.fn(),
};

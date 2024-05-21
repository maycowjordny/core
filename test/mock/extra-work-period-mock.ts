import { vi } from "vitest";

export const extraWorkPeriodRepositoryMock = {
    create: vi.fn(),
    listByWorkPeriod: vi.fn(),
    findByEmployeeAndTimeWindow: vi.fn(),
};

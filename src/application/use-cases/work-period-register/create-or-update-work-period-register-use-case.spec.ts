import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { WeekdayEnum } from "@/domain/enum/week-day-enum";
import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { InMemoryWorkPeriodRegisterRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-register-repository";
import { InMemoryWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-repository";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { makeFakeWorkPeriod } from "test/factories/work-period-factory";
import { makeFakeWorkPeriodRegister } from "test/factories/work-period-register-factory";
import { workPeriodRegisterRepositoryMock } from "test/mock/work-period-register-mock";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FindLocationByEmployeeIdUseCase } from "../employee/find-location-by-id-use-case";
import { FindWorkPeriodByCodWorkPeriodAndDayUseCase } from "../work-period/find-workperiod-by-code-work-period-and-day";
import { CreateOrUpdateWorkPeriodRegisterUseCase } from "./create-or-update-work-period-register-use-case";
import { CreateWorkPeriodRegisterException } from "./errors/create-work-period-register-exception";
import { DistanceOverLimitException } from "./errors/distance-over-limit-exception";
import { FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase } from "./find-workperiod-register-by-employee-id-window";
import { IsLocationNearbyUseCase } from "./is-location-nearby-use-case";
import { UpdateWorkperiodRegisterUseCase } from "./update-work-period-register-use-case";

describe("CreateOrUpdateWorkPeriodRegisterUseCase", () => {

    let workPeriodRepository: InMemoryWorkPeriodRepository;

    let workPeriodRegisterRepository: InMemoryWorkPeriodRegisterRepository;
    let findWorkPeriodRegisterByEmployeeIdWindowUseCase: FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase;

    let findWorkPeriodByCodWorkPeriodUseCase: FindWorkPeriodByCodWorkPeriodAndDayUseCase;

    let employeeRepository: InMemoryEmployeeRepository;
    let findLocationByEmployeeIdUseCase: FindLocationByEmployeeIdUseCase;

    let isLocationNearbyUseCase: IsLocationNearbyUseCase;

    let updateworkPeriodRegisterUseCase: UpdateWorkperiodRegisterUseCase;
    let workPeriodRegisterUseCase: CreateOrUpdateWorkPeriodRegisterUseCase;

    beforeEach(() => {
        workPeriodRegisterRepository = new InMemoryWorkPeriodRegisterRepository();
        employeeRepository = new InMemoryEmployeeRepository();
        findWorkPeriodRegisterByEmployeeIdWindowUseCase = new FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase(workPeriodRegisterRepository);

        workPeriodRepository = new InMemoryWorkPeriodRepository();
        findWorkPeriodByCodWorkPeriodUseCase = new FindWorkPeriodByCodWorkPeriodAndDayUseCase(workPeriodRepository);

        findLocationByEmployeeIdUseCase = new FindLocationByEmployeeIdUseCase(employeeRepository);
        isLocationNearbyUseCase = new IsLocationNearbyUseCase();
        updateworkPeriodRegisterUseCase = new UpdateWorkperiodRegisterUseCase(workPeriodRegisterRepository);

        workPeriodRegisterUseCase = new CreateOrUpdateWorkPeriodRegisterUseCase(
            workPeriodRegisterRepository,
            updateworkPeriodRegisterUseCase,
            findLocationByEmployeeIdUseCase,
            findWorkPeriodByCodWorkPeriodUseCase,
            isLocationNearbyUseCase,
            findWorkPeriodRegisterByEmployeeIdWindowUseCase
        );
    });

    it("should be able to create work period register", async () => {
        vi.spyOn(findLocationByEmployeeIdUseCase, "execute");
        vi.spyOn(isLocationNearbyUseCase, "execute");
        vi.spyOn(findWorkPeriodRegisterByEmployeeIdWindowUseCase, "execute");
        vi.spyOn(findWorkPeriodByCodWorkPeriodUseCase, "execute");

        const employee = makeFakeEmployee({ id: "employeeId-01" });

        employeeRepository.create(employee);

        const workPeriod = makeFakeWorkPeriod({ id: "workPeriod-01", workPeriods: [{ day: WeekdayEnum.Wednesday }] });

        workPeriodRepository.create(workPeriod);

        const response = new WorkPeriodRegister({
            employeeId: employee.id!,
            lat: "41.7100",
            lng: "-74.0060",
            startBreakHour: new Date(),
            startWorkHour: new Date(),
            finishedWorkHour: new Date(),
            finishedBreakHour: new Date(),
        });

        const output = await workPeriodRegisterUseCase.execute(response, workPeriod.codWorkPeriod!);

        expect(output).toMatchObject(response);
        expect(findLocationByEmployeeIdUseCase.execute).toHaveBeenCalled();
        expect(findWorkPeriodByCodWorkPeriodUseCase.execute).toHaveBeenCalled();
        expect(isLocationNearbyUseCase.execute).toHaveBeenCalled();
        expect(findWorkPeriodRegisterByEmployeeIdWindowUseCase.execute).toHaveBeenCalled();
    });

    it("should be able to update work period register", async () => {
        vi.spyOn(findLocationByEmployeeIdUseCase, "execute");
        vi.spyOn(isLocationNearbyUseCase, "execute");
        vi.spyOn(findWorkPeriodRegisterByEmployeeIdWindowUseCase, "execute");

        const employee = makeFakeEmployee({ id: "employeeId-01" });

        employeeRepository.create(employee);

        const workPeriod = makeFakeWorkPeriod({ id: "workPeriod-01", workPeriods: [{ day: WeekdayEnum.Wednesday }] });

        workPeriodRepository.create(workPeriod);

        const workPeriodRegister = new WorkPeriodRegister({
            employeeId: "employeeId-01",
            lat: "41.7100",
            lng: "-74.0060",
            workPeriodId: workPeriod.id,
            startBreakHour: new Date("2024-05-08T08:00:00.000Z"),
            startWorkHour: new Date("2024-05-08T12:00:00.000Z"),
            finishedWorkHour: new Date("2024-05-08T14:00:00.000Z"),
            finishedBreakHour: new Date("2024-05-08T18:00:00.000Z"),
        });

        await workPeriodRegisterRepository.create(workPeriodRegister);

        const output = await workPeriodRegisterUseCase.execute(workPeriodRegister, workPeriod.codWorkPeriod!);

        expect(output).toMatchObject(workPeriodRegister);
        expect(findLocationByEmployeeIdUseCase.execute).toHaveBeenCalled();
        expect(isLocationNearbyUseCase.execute).toHaveBeenCalled();
        expect(findWorkPeriodRegisterByEmployeeIdWindowUseCase.execute).toHaveBeenCalled();
    });

    it("cannot create a work period register when distance over limit error", async () => {
        workPeriodRegisterRepositoryMock.create.mockRejectedValue(new DistanceOverLimitException());

        const employee = makeFakeEmployee({ id: "employeeId-01" });

        employeeRepository.create(employee);

        const workPeriod = makeFakeWorkPeriod({ id: "workPeriod-01" });

        workPeriodRepository.create(workPeriod);

        const workPeriodRegister = makeFakeWorkPeriodRegister({
            employeeId: "employeeId-01",
            workPeriodId: workPeriod.id,
            lat: "71.7100",
            lng: "-74.0060",
        });

        workPeriodRegisterRepository.create(workPeriodRegister);

        await expect(workPeriodRegisterUseCase.execute(workPeriodRegister, workPeriod.codWorkPeriod!)).rejects.toThrow(DistanceOverLimitException);
    });

    it("cannot create a work period register when generic error", async () => {
        workPeriodRegisterRepositoryMock.create.mockRejectedValue(new Error());

        const createOrUpdateWorkPeriodRegisterUseCase = new CreateOrUpdateWorkPeriodRegisterUseCase(
            workPeriodRegisterRepositoryMock,
            updateworkPeriodRegisterUseCase,
            findLocationByEmployeeIdUseCase,
            findWorkPeriodByCodWorkPeriodUseCase,
            isLocationNearbyUseCase,
            findWorkPeriodRegisterByEmployeeIdWindowUseCase
        );

        const employee = makeFakeEmployee({ id: "employeeId-01" });

        employeeRepository.create(employee);

        const workPeriod = makeFakeWorkPeriod({ id: "workPeriod-01" });

        workPeriodRepository.create(workPeriod);

        const workPeriodRegister = makeFakeWorkPeriodRegister({
            employeeId: "employeeId-01",
            workPeriodId: workPeriod.id,
            lat: "41.7100",
            lng: "-74.0060",
        }
        );

        await expect(
            createOrUpdateWorkPeriodRegisterUseCase.execute(workPeriodRegister, workPeriod.codWorkPeriod!)
        ).rejects.toThrow(CreateWorkPeriodRegisterException);
    });
});

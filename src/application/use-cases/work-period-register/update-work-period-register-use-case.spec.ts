import { UpdateWorkPeriodRegisterProps } from "@/domain/interfaces/work-period-register";
import { InMemoryWorkPeriodRegisterRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-register-repository";
import { makeFakeWorkPeriodRegister } from "test/factories/work-period-register-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UpdateWorkPeriodRegisterException } from "./errors/update-work-period-register-exception";
import { UpdateWorkperiodRegisterUseCase } from "./update-work-period-register-use-case";

describe("UpdateWorkPeriodRegisterUseCase", () => {
    let workPeriodRegisterRepository: InMemoryWorkPeriodRegisterRepository;
    let updateWorkPeriodRegisterUseCase: UpdateWorkperiodRegisterUseCase;

    beforeEach(() => {
        workPeriodRegisterRepository = new InMemoryWorkPeriodRegisterRepository();
        updateWorkPeriodRegisterUseCase = new UpdateWorkperiodRegisterUseCase(workPeriodRegisterRepository);
    });

    it("should be able to update work period register", async () => {
        const workPeriodRegisterCreate = makeFakeWorkPeriodRegister({
            id: "workPeriodRegister-01",
            employeeId: "employeeId-01",
            startWorkHour: new Date("2023-04-17T08:00:00.000Z"),
            finishedBreakHour: null,
            startBreakHour: null,
            finishedWorkHour: null,
        });

        workPeriodRegisterRepository.create(workPeriodRegisterCreate);

        const workPeriodRegisterUpdate: UpdateWorkPeriodRegisterProps = {
            id: "workPeriodRegister-01",
            employeeId: "employeeId-01",
            startWorkHour: new Date("2023-04-17T08:00:00.000Z"),
            startBreakHour: new Date("2023-04-17T12:00:00.000Z"),
            finishedBreakHour: new Date("2023-04-17T14:00:00.000Z"),
            finishedWorkHour: new Date("2023-04-17T18:00:00.000Z"),
            lat: "99999",
            lng: "77777",
        };

        const output = await updateWorkPeriodRegisterUseCase.execute(workPeriodRegisterUpdate);

        expect(output.props).toMatchObject({
            startWorkHour: workPeriodRegisterUpdate.startWorkHour,
            startBreakHour: workPeriodRegisterUpdate.startBreakHour,
            finishedBreakHour: workPeriodRegisterUpdate.finishedBreakHour,
            finishedWorkHour: workPeriodRegisterUpdate.finishedWorkHour,
            lat: workPeriodRegisterUpdate.lat,
            lng: workPeriodRegisterUpdate.lng,
        });
    });

    it("cannot create a work period register when generic error", async () => {

        vi.spyOn(workPeriodRegisterRepository, "update").mockRejectedValue(new Error());

        const workPeriodRegister = makeFakeWorkPeriodRegister({ employeeId: "employeeId-01" });

        const workPeriodRegisterUpdate: UpdateWorkPeriodRegisterProps = {
            id: workPeriodRegister.id!,
            employeeId: "employeeId-01",
            startWorkHour: new Date("2023-04-17T08:00:00.000Z"),
            startBreakHour: new Date("2023-04-17T12:00:00.000Z"),
            finishedBreakHour: new Date("2023-04-17T14:00:00.000Z"),
            finishedWorkHour: new Date("2023-04-17T18:00:00.000Z"),
            lat: "99999",
            lng: "77777",
        };

        await expect(updateWorkPeriodRegisterUseCase.execute(workPeriodRegisterUpdate)).rejects.toThrow(UpdateWorkPeriodRegisterException);
    });

});

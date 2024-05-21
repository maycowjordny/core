import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { InMemoryWorkPeriodRegisterRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-register-repository";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SummariseEmployeeSalaryException } from "../../errors/summarise-employee-salary-exception";
import { GetDaysOffAndDaysWorkedUseCase } from "../days-off-and-days-worked/get-days-off-and-days-worked";
import { FindEmployeeByIdUseCase } from "../employee/find-employee-by-id-use-case";
import { GetHoursWorkedUseCase } from "../get-worked/get-hours-worked-use-case";
import { MakeTimeTrackEmployeeHourlyUseCase } from "../time-track-employee-hourly/make-time-track-employee-hourly-use-case";
import { FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase } from "../work-period-register/find-workperiod-register-by-employee-id-window";
import { SummariseEmployeeSalaryHourly } from "./make-summarise-employee-salary-hourly";

describe("SummariseEmployeeSalaryHourly", () => {
    let workPeriodRegisterRepository: InMemoryWorkPeriodRegisterRepository;
    let findWorkPeriodRegisterByEmployeeIdWindow: FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase;

    let findEmployeeByIdUseCase: FindEmployeeByIdUseCase;
    let employeeRepository: InMemoryEmployeeRepository;

    let getHoursWorkedUseCase: GetHoursWorkedUseCase;
    let makeTimeTrackEmployeeHourlyUseCase: MakeTimeTrackEmployeeHourlyUseCase;
    let summaryEmployeeSalary: SummariseEmployeeSalaryHourly;
    let getDaysOffAndDaysWorkedUseCase: GetDaysOffAndDaysWorkedUseCase;

    beforeEach(() => {
        workPeriodRegisterRepository = new InMemoryWorkPeriodRegisterRepository();
        findWorkPeriodRegisterByEmployeeIdWindow = new FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase(workPeriodRegisterRepository);

        employeeRepository = new InMemoryEmployeeRepository();
        findEmployeeByIdUseCase = new FindEmployeeByIdUseCase(employeeRepository);

        getHoursWorkedUseCase = new GetHoursWorkedUseCase();
        getDaysOffAndDaysWorkedUseCase = new GetDaysOffAndDaysWorkedUseCase();
        makeTimeTrackEmployeeHourlyUseCase = new MakeTimeTrackEmployeeHourlyUseCase(
            findEmployeeByIdUseCase,
            findWorkPeriodRegisterByEmployeeIdWindow,
            getHoursWorkedUseCase,
            getDaysOffAndDaysWorkedUseCase
        );

        summaryEmployeeSalary = new SummariseEmployeeSalaryHourly(makeTimeTrackEmployeeHourlyUseCase);
    });

    it("should be able summarise employee salary hourly", async () => {
        const employee = makeFakeEmployee({ id: "employeeId-01" });

        const worked180HoursInSeconds = 648000;

        vi.spyOn(makeTimeTrackEmployeeHourlyUseCase, "execute").mockResolvedValue({
            employee: {
                id: employee.id!,
                hourlyWage: 10
            },
            totalWorkedInSeconds: worked180HoursInSeconds,
            totalDayOffs: 5,
            totalWorkingDays: 25,
        });

        const output = await summaryEmployeeSalary.execute({ employeeId: employee.id! });

        expect(makeTimeTrackEmployeeHourlyUseCase.execute).toHaveBeenCalled();
        expect(output).toEqual(2160);
    });

    it("cannot summarise employee salary hourly with generic error", async () => {
        vi.spyOn(summaryEmployeeSalary, "execute").mockRejectedValue(new SummariseEmployeeSalaryException());

        const employee = makeFakeEmployee({ id: "employeeId-01" });

        await expect(summaryEmployeeSalary.execute({ employeeId: employee.id! })).rejects.toThrow(
            SummariseEmployeeSalaryException
        );
    });
});

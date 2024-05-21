import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { UpdateWorkPeriodRegisterProps } from "@/domain/interfaces/work-period-register";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { WorkPeriodRegisterRepository } from "@/infra/database/repositories/work-period-register-repository";
import { dayOfWeek } from "@/utils/get-week-day";
import { subHours } from "date-fns";
import { FindLocationByEmployeeIdUseCase } from "../employee/find-location-by-id-use-case";
import { FindWorkPeriodByCodWorkPeriodAndDayUseCase } from "../work-period/find-workperiod-by-code-work-period-and-day";
import { CreateWorkPeriodRegisterException } from "./errors/create-work-period-register-exception";
import { DistanceOverLimitException } from "./errors/distance-over-limit-exception";
import { LocationNotFoundException } from "./errors/location-not-found-exception";
import { FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase } from "./find-workperiod-register-by-employee-id-window";
import { IsLocationNearbyUseCase } from "./is-location-nearby-use-case";
import { UpdateWorkperiodRegisterUseCase } from "./update-work-period-register-use-case";

export class CreateOrUpdateWorkPeriodRegisterUseCase {
    constructor(
        private workPeriodRegisterRepository: WorkPeriodRegisterRepository,
        private updateworkPeriodRegisterUseCase: UpdateWorkperiodRegisterUseCase,
        private findLocationByEmployeeIdUseCase: FindLocationByEmployeeIdUseCase,
        private findWorkPeriodByCodWorkPeriodUseCase: FindWorkPeriodByCodWorkPeriodAndDayUseCase,
        private isLocationNearbyUseCase: IsLocationNearbyUseCase,
        private findWorkPeriodRegisterByEmployeeIdWindowUseCase: FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase,
    ) { }

    async execute(workPeriodRegisterInput: WorkPeriodRegister, codWorkPeriod: string): Promise<WorkPeriodRegister> {
        try {
            const registerLocation = {
                latitude: Number(workPeriodRegisterInput.lat),
                longitude: Number(workPeriodRegisterInput.lng)
            };

            const findLocation = await this.findLocationByEmployeeIdUseCase.execute(workPeriodRegisterInput.employeeId);

            const localizationCompany = {
                latitude: Number(findLocation!.company.address.lat),
                longitude: Number(findLocation!.company.address.lng)
            };

            const isLocationNearby = await this.isLocationNearbyUseCase.execute({ registerLocation, localizationCompany });

            if (isLocationNearby) throw new DistanceOverLimitException();

            const day = workPeriodRegisterInput.startWorkHour.getDay();

            const workPeriod = await this.findWorkPeriodByCodWorkPeriodUseCase.execute(codWorkPeriod, dayOfWeek(day));

            const findWorkPeriodRegister = await this.findWorkPeriodRegisterByEmployeeId(workPeriodRegisterInput);

            await this.verifyWorkPeriodRegisterExistAndUpdate(findWorkPeriodRegister, workPeriodRegisterInput);

            const workPeriodEntity = new WorkPeriodRegister({
                ...workPeriodRegisterInput.props,
                workPeriodId: workPeriod?.id,
            });

            const workPeriodRegister = await this.workPeriodRegisterRepository.create(workPeriodEntity);

            return workPeriodRegister;
        } catch (err: any) {
            if (err instanceof DistanceOverLimitException) {
                throw new DistanceOverLimitException();
            }

            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new LocationNotFoundException();
            }

            throw new CreateWorkPeriodRegisterException(err);
        }
    }

    private async verifyWorkPeriodRegisterExistAndUpdate(findWorkPeriodRegister: WorkPeriodRegister[], workPeriodRegisterInput: WorkPeriodRegister) {
        if (findWorkPeriodRegister.length) {
            const workPeriodToUpdate: UpdateWorkPeriodRegisterProps = {
                ...workPeriodRegisterInput.props,
                id: workPeriodRegisterInput.id!,
                employeeId: workPeriodRegisterInput.employeeId,
                finishedBreakHour: workPeriodRegisterInput.finishedBreakHour!,
                finishedWorkHour: workPeriodRegisterInput.finishedWorkHour!,
                startBreakHour: workPeriodRegisterInput.startBreakHour!,
            };

            await this.updateworkPeriodRegisterUseCase.execute(workPeriodToUpdate);
        }
    }

    private async findWorkPeriodRegisterByEmployeeId(workPeriodRegisterInput: WorkPeriodRegister) {

        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        const findWorkPeriodRegister = await this.findWorkPeriodRegisterByEmployeeIdWindowUseCase.execute(
            {
                employeeId: workPeriodRegisterInput.employeeId,
                startDate: subHours(startDate, 3),
                endDate: subHours(endDate, 3)
            });

        return findWorkPeriodRegister;
    }
}

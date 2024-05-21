import { NearbyProps } from "@/domain/interfaces/employee";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { EmployeeRepository } from "@/infra/database/repositories/employee-repository";
import { LocationNotFoundException } from "../work-period-register/errors/location-not-found-exception";
import { FindLocationByIdException } from "./errors/find-location-by-id-exception";

export class FindLocationByEmployeeIdUseCase {
    constructor(private employeeRepository: EmployeeRepository) { }

    async execute(id: string): Promise<NearbyProps | null> {
        try {
            const findLocation = await this.employeeRepository.findLocationById(id);

            if (!findLocation) throw new LocationNotFoundException();

            return findLocation;
        } catch (err: any) {
            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new LocationNotFoundException();
            }
            throw new FindLocationByIdException(err);
        }
    }
}

import { DeactivateEmployeeProps } from "@/domain/interfaces/employee";
import { Prisma } from "@prisma/client";
import { EmployeeMapper } from "./employee-mapper";

export class DeactivateEmployeeMapper extends EmployeeMapper {
    static convertToPrisma(data: DeactivateEmployeeProps): Prisma.EmployeeUncheckedUpdateInput {
        return {
            isActive: data.isActive
        };
    }
}

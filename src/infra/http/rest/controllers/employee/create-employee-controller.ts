import { makeCreateEmployee } from "@/application/factories/employee/make-create-employee-use-case";
import { CreateEmployeeException } from "@/application/use-cases/employee/errors/create-employee-exception";
import { Employee } from "@/domain/entities/employee-entity";
import { User } from "@/domain/entities/user-entity";
import { UserRoleEnum, UserStatusEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { employeeBodySchema } from "../../zod/schema/employee/employee-schema";

export class EmployeeCreateController {
    public create = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { companyId } = request.user;

            const employeeValidate = this.employeeValidator(request.body);

            const createEmployeeUseCase = makeCreateEmployee();

            const createUser = new User({
                ...employeeValidate.user,
                type: UserTypesEnum.EMPLOYEE,
                role: UserRoleEnum.BASIC,
                status: UserStatusEnum.ACTIVE
            });

            const createEmployee = new Employee({
                ...employeeValidate,
                user: createUser,
                companyId: companyId!,
                isActive: true
            });

            const employee = await createEmployeeUseCase.execute(createEmployee);

            reply.status(201).send({ employeeId: employee.id });
        } catch (err) {
            if (err instanceof CreateEmployeeException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private employeeValidator(body: FastifyRequestType["body"]) {
        return employeeBodySchema.parse(body);
    }
}

import { makeUpdateEmployee } from "@/application/factories/employee/make-update-employee-use-case";
import { UpdateEmployeeException } from "@/application/use-cases/employee/errors/update-employee-exception";
import { Employee } from "@/domain/entities/employee-entity";
import { FastifyReply, FastifyRequest } from "fastify";
import { employeeUpdateSchema } from "../../zod/schema/employee/update-employee-schema";

export class EmployeeUpdateController {
    public update = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { companyId } = request.user;
            const { id } = request.params as { id: string };

            const employeeValidate = this.employeeValidator(request);

            const updateEmployeeUseCase = makeUpdateEmployee();

            const updateEmployee = new Employee({
                id,
                ...employeeValidate,
                companyId: companyId!
            });

            await updateEmployeeUseCase.execute(updateEmployee);

            reply.status(201).send({ message: "Employee update successfully!" });
        } catch (err) {
            if (err instanceof UpdateEmployeeException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private employeeValidator(request: FastifyRequest) {
        return employeeUpdateSchema.parse(request.body);
    }

}

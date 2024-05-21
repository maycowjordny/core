import { makeDeactivateEmployee } from "@/application/factories/employee/make-deactivate-employee-use-case";
import { DeactivateEmployeeException } from "@/application/use-cases/employee/errors/deactive-employee-exception";
import { DeactivateEmployeeProps } from "@/domain/interfaces/employee";
import { FastifyReply, FastifyRequest } from "fastify";

export class EmployeeDeactivateController {
    public deactivate = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { companyId } = request.user;
            const { id } = request.params as { id: string };

            const deactivateEmployeeUseCase = makeDeactivateEmployee();

            const employeeDeactivate: DeactivateEmployeeProps = {
                id,
                companyId: companyId!,
            };

            await deactivateEmployeeUseCase.execute(employeeDeactivate);

            reply.status(200).send({ message: "Employee deactivate successfully!" });
        } catch (err) {
            if (err instanceof DeactivateEmployeeException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

}


import { makeFindEmployeeByUserId } from "@/application/factories/employee/make-find-employee-by-user-id-use-case";
import { makeCreateOrUpdateWorkPeriodRegister } from "@/application/factories/work-period-register/make-create-or-update-work-period-register";
import { EmployeeNotFoundException } from "@/application/use-cases/employee/errors/not-found-employee-exception";
import { CreateWorkPeriodRegisterException } from "@/application/use-cases/work-period-register/errors/create-work-period-register-exception";
import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { UpdateWorkPeriodRegisterProps } from "@/domain/interfaces/work-period-register";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { workPeriodRegisterUpdateSchema } from "../../zod/schema/work-period-register/update-work-period-register-schema";

export class WorkPeriodRegisterUpdateController {
    public update = async (request: FastifyRequest, reply: FastifyReply) => {

        try {
            const { id } = request.params as { id: string };
            const { sub } = request.user;
            const workperiodregisterValidate = this.workperiodregisterValidator(request.body);

            const createWorkPeriodRegisterUseCase = makeCreateOrUpdateWorkPeriodRegister();
            const findEmployeeByUserIdUseCase = makeFindEmployeeByUserId();

            const employee = await findEmployeeByUserIdUseCase.execute(sub!);

            if (!employee) throw new EmployeeNotFoundException();

            const createWorkPeriodRegister: UpdateWorkPeriodRegisterProps = {
                id,
                employeeId: employee.id!,
                ...workperiodregisterValidate,
            };

            const workPeriodRegister = await createWorkPeriodRegisterUseCase.execute(new WorkPeriodRegister(createWorkPeriodRegister), employee.codWorkPeriod!);

            reply.status(200).send({ workPeriodRegisterId: workPeriodRegister.id });
        } catch (err) {
            if (err instanceof CreateWorkPeriodRegisterException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private workperiodregisterValidator(body: FastifyRequestType["body"]) {
        return workPeriodRegisterUpdateSchema.parse(body);
    }
}

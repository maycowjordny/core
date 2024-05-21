
import { makeFindEmployeeByUserId } from "@/application/factories/employee/make-find-employee-by-user-id-use-case";
import { makeCreateOrUpdateWorkPeriodRegister } from "@/application/factories/work-period-register/make-create-or-update-work-period-register";
import { EmployeeNotFoundException } from "@/application/use-cases/employee/errors/not-found-employee-exception";
import { CreateWorkPeriodRegisterException } from "@/application/use-cases/work-period-register/errors/create-work-period-register-exception";
import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { workPeriodRegisterBodySchema } from "../../zod/schema/work-period-register/create-work-period-register-schema";

export class WorkPeriodRegisterCreateController {
    public create = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const workperiodregisterValidate = this.workperiodregisterValidator(request.body);
            const { sub } = request.user;

            const createWorkPeriodRegisterUseCase = makeCreateOrUpdateWorkPeriodRegister();
            const findEmployeeByUserIdUseCase = makeFindEmployeeByUserId();

            const employee = await findEmployeeByUserIdUseCase.execute(sub!);

            if (!employee) throw new EmployeeNotFoundException();

            const createWorkPeriodRegister = new WorkPeriodRegister({
                ...workperiodregisterValidate,
                employeeId: employee.id!,
            });

            const workPeriodRegister = await createWorkPeriodRegisterUseCase.execute(createWorkPeriodRegister, employee.codWorkPeriod!);

            reply.status(201).send({ workPeriodRegisterId: workPeriodRegister.id });
        } catch (err) {
            if (err instanceof CreateWorkPeriodRegisterException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private workperiodregisterValidator(body: FastifyRequestType["body"]) {
        return workPeriodRegisterBodySchema.parse(body);
    }
}

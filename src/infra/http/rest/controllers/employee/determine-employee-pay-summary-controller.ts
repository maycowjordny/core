import { SummariseEmployeeSalaryException } from "@/application/errors/summarise-employee-salary-exception";
import { makeDetermineEmployeePaySummary } from "@/application/factories/determine-employee-pay-summary/make-determine-employee-pay-summary-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export class DetermineEmployeePaySummaryController {
    public summarise = async (request: FastifyRequest, reply: FastifyReply) => {

        try {
            const { employeeId } = request.params as { employeeId: string };
            const { startDate, endDate } = request.query as { startDate: string, endDate: string };

            const summariseEmployeeSalaryUseCase = makeDetermineEmployeePaySummary();

            const summariseSalaryEmployee = await summariseEmployeeSalaryUseCase.execute({
                employeeId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            });

            reply.status(200).send(summariseSalaryEmployee);
        } catch (err) {
            if (err instanceof SummariseEmployeeSalaryException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };
}

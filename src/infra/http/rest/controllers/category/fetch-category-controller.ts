import { makeFetchCategory } from "@/application/factories/category/make-fetch-category-use-case";
import { FetchCategoryException } from "@/application/use-cases/category/errors/fetch-category-exception";
import { FastifyReply, FastifyRequest } from "fastify";

export class FetchCategoryController {
    public fetch = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const fetchCategoryUseCase = makeFetchCategory();

            const category = await fetchCategoryUseCase.execute();

            reply.status(200).send(category);
        } catch (err) {
            if (err instanceof FetchCategoryException) {
                return reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };
}

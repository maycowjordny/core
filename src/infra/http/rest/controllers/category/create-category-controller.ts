import { makeCreateCategory } from "@/application/factories/category/make-create-category-use-case";
import { CreateCategoryException } from "@/application/use-cases/category/errors/create-category-exception";
import { Category } from "@/domain/entities/category-entity";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { categoryBodySchema } from "../../zod/schema/category/create-category-schema";

export class CreateCategoryController {
    public create = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const categoryValidator = this.categoryValidator(request.body);

            const createCategoryUseCase = makeCreateCategory();

            const createCategory = new Category({ ...categoryValidator });

            const category = await createCategoryUseCase.execute(createCategory);

            reply.status(201).send({ categoryId: category.id });
        } catch (err) {
            if (err instanceof CreateCategoryException) {
                return reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private categoryValidator(body: FastifyRequestType["body"]) {
        return categoryBodySchema.parse(body);
    }
}

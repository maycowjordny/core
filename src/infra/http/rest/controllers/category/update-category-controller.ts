import { makeUpdateCategory } from "@/application/factories/category/make-update-category-use-case";
import { UpdateCategoryException } from "@/application/use-cases/category/errors/update-category-exception";
import { Category } from "@/domain/entities/category-entity";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { updateCategorySchema } from "../../zod/schema/category/update-category-schema";

export class UpdateCategoryController {
    public update = async (request: FastifyRequest, reply: FastifyReply) => {

        try {
            const { id, name } = this.categoryValidator(request.body, request.params);

            const updateCategoryUseCase = makeUpdateCategory();

            const createCategory = new Category({
                id,
                name
            });

            await updateCategoryUseCase.execute(createCategory);

            reply.status(200).send({ message: "Category update successfully!" });
        } catch (err) {
            if (err instanceof UpdateCategoryException) {
                return reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private categoryValidator(body: FastifyRequestType["body"], params: FastifyRequestType["params"]) {
        const { id } = params as { id: string };
        const { name } = body as { name: string };

        const bodyValidator = {
            id,
            name
        };

        return updateCategorySchema.parse(bodyValidator);
    }
}

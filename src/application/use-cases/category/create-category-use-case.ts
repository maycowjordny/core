import { Category } from "@/domain/entities/category-entity";
import { PRISMA_UNIQUE_KEY_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { CategoryRepository } from "@/infra/database/repositories/category-repository";
import { CategoryAlreadyExistException } from "./errors/category-already-exists";
import { CreateCategoryException } from "./errors/create-category-exception";

export class CreateCategoryUseCase {
    constructor(private categoryRepository: CategoryRepository) { }

    async execute(categoryInput: Category): Promise<Category> {
        try {
            return await this.categoryRepository.create(categoryInput);
        } catch (err: any) {
            if (err.code == PRISMA_UNIQUE_KEY_EXCEPTION) {
                throw new CategoryAlreadyExistException();
            }

            throw new CreateCategoryException(err);
        }
    }
}

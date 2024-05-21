import { Category } from "@/domain/entities/category-entity";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { CategoryRepository } from "@/infra/database/repositories/category-repository";
import { CompanyNotFoundException } from "../company/errors/not-found-company-exception";
import { UpdateCategoryException } from "./errors/update-category-exception";

export class UpdateCategoryUseCase {
    constructor(private categoryRepository: CategoryRepository) { }

    async execute(categoryInput: Category): Promise<Category> {
        try {
            const categoryToUpdate = new Category({ ...categoryInput.props });

            return await this.categoryRepository.update(categoryToUpdate);
        } catch (err: any) {
            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new CompanyNotFoundException();
            }

            throw new UpdateCategoryException(err);
        }
    }
}

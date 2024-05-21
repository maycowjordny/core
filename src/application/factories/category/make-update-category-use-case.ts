import { UpdateCategoryUseCase } from "@/application/use-cases/category/update-category-use.case";
import { PrismaCategoryRepository } from "@/infra/database/prisma/repositories/prisma-category-repository";

export function makeUpdateCategory() {
    const categoryRepository = new PrismaCategoryRepository();
    const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);

    return updateCategoryUseCase;
}

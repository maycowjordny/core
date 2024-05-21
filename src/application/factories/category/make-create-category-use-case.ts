import { CreateCategoryUseCase } from "@/application/use-cases/category/create-category-use-case";
import { PrismaCategoryRepository } from "@/infra/database/prisma/repositories/prisma-category-repository";

export function makeCreateCategory() {
    const categoryRepository = new PrismaCategoryRepository();
    const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);

    return createCategoryUseCase;
}

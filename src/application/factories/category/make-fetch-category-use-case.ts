import { FetchCategoryUseCase } from "@/application/use-cases/category/fetch-category-use-case";
import { PrismaCategoryRepository } from "@/infra/database/prisma/repositories/prisma-category-repository";

export function makeFetchCategory() {
    const categoryRepository = new PrismaCategoryRepository();
    const fetchCategoryUseCase = new FetchCategoryUseCase(categoryRepository);

    return fetchCategoryUseCase;
}

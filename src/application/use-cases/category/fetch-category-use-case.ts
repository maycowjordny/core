import { Category } from "@/domain/entities/category-entity";
import { CategoryRepository } from "@/infra/database/repositories/category-repository";
import { FetchCategoryException } from "./errors/fetch-category-exception";

export class FetchCategoryUseCase {
    constructor(private categoryRepository: CategoryRepository) { }

    async execute(): Promise<Category[]> {
        try {
            return await this.categoryRepository.list();
        } catch (err: any) {
            throw new FetchCategoryException(err);
        }
    }
}

import { Category } from "@/domain/entities/category-entity";
import { InMemoryCategoryRepository } from "@/infra/database/in-memory-repository/in-memory-category-repository";
import { makeFakeCategory } from "test/factories/category-factory";
import { categoryRepositoryMock } from "test/mock/category-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { UpdateCategoryException } from "./errors/update-category-exception";
import { UpdateCategoryUseCase } from "./update-category-use.case";

describe("UpdateCategoryUseCase", () => {
    let categoryRepository: InMemoryCategoryRepository;
    let categoryUseCase: UpdateCategoryUseCase;

    beforeEach(() => {
        categoryRepository = new InMemoryCategoryRepository();
        categoryUseCase = new UpdateCategoryUseCase(categoryRepository);
    });

    it("should be able to update category", async () => {
        const category = makeFakeCategory({
            name: "category-1",
        });

        categoryRepository.create(category);

        const OBJECT_RESPONSE = new Category({
            ...category.props,
            name: "category-2",
        });

        const output = await categoryUseCase.execute(OBJECT_RESPONSE);

        expect(output).toMatchObject(OBJECT_RESPONSE);
    });

    it("cannot update an category when generic error", async () => {
        categoryRepositoryMock.update.mockRejectedValue(new Error());

        const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepositoryMock);

        const category = makeFakeCategory();

        await expect(updateCategoryUseCase.execute(category)).rejects.toThrow(UpdateCategoryException);
    });
});

import { InMemoryCategoryRepository } from "@/infra/database/in-memory-repository/in-memory-category-repository";
import { makeFakeCategory } from "test/factories/category-factory";
import { categoryRepositoryMock } from "test/mock/category-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchCategoryException } from "./errors/fetch-category-exception";
import { FetchCategoryUseCase } from "./fetch-category-use-case";

describe("FetchCategoryUseCase", () => {
    let categoryRepository: InMemoryCategoryRepository;
    let categoryUseCase: FetchCategoryUseCase;
    beforeEach(() => {
        categoryRepository = new InMemoryCategoryRepository();
        categoryUseCase = new FetchCategoryUseCase(categoryRepository);
    });

    it("should be able to list category", async () => {
        const category = makeFakeCategory();

        categoryRepository.create(category);

        const output = await categoryUseCase.execute();

        expect(output).toEqual([category]);
    });

    it("cannot list an category when generic error", async () => {
        categoryRepositoryMock.list.mockRejectedValue(new Error());

        const fetchCategoryUseCase = new FetchCategoryUseCase(categoryRepositoryMock);

        await expect(fetchCategoryUseCase.execute()).rejects.toThrow(FetchCategoryException);
    });
});

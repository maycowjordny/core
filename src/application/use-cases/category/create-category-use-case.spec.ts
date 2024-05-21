import { InMemoryCategoryRepository } from "@/infra/database/in-memory-repository/in-memory-category-repository";
import { PRISMA_UNIQUE_KEY_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { makeFakeCategory } from "test/factories/category-factory";
import { categoryRepositoryMock } from "test/mock/category-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateCategoryUseCase } from "./create-category-use-case";
import { CategoryAlreadyExistException } from "./errors/category-already-exists";
import { CreateCategoryException } from "./errors/create-category-exception";

describe("CreateCategoryUseCase", () => {
    let categoryRepository: InMemoryCategoryRepository;
    let categoryUseCase: CreateCategoryUseCase;

    beforeEach(() => {
        categoryRepository = new InMemoryCategoryRepository();
        categoryUseCase = new CreateCategoryUseCase(categoryRepository);
    });

    it("should be able to create category", async () => {
        const category = makeFakeCategory({
            id: "categoryId-01",
            name: "New Category",
        });

        const output = await categoryUseCase.execute(category);

        expect(output.props).toMatchObject({
            id: category.id,
            name: category.name,
        });
    });

    it("cannot create a category when generic error", async () => {
        categoryRepositoryMock.create.mockRejectedValue(new Error());

        const createCategoryUseCase = new CreateCategoryUseCase(categoryRepositoryMock);

        const category = makeFakeCategory();

        await expect(createCategoryUseCase.execute(category)).rejects.toThrow(
            CreateCategoryException
        );
    });

    it("cannot create a category when prisma unique key error", async () => {
        categoryRepositoryMock.create.mockRejectedValue({
            code: PRISMA_UNIQUE_KEY_EXCEPTION,
        });

        const createCategoryUseCase = new CreateCategoryUseCase(
            categoryRepositoryMock
        );

        const category = makeFakeCategory();

        await expect(createCategoryUseCase.execute(category)).rejects.toThrow(
            CategoryAlreadyExistException
        );
    });
});

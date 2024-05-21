import { Category, CategoryProps } from "@/domain/entities/category-entity";
import { prisma } from "@/infra/database/lib/prisma";
import { CategoryMapper } from "@/infra/database/prisma/mappers/category/category-mapper";
import { CreateCategoryMapper } from "@/infra/database/prisma/mappers/category/create-category-mapper";
import { faker } from "@faker-js/faker";

type CategoryOverrides = {
    id?: string;
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export function makeFakeCategory(data = {} as CategoryOverrides) {
    const name = faker.company.name();

    const props: CategoryProps = {
        id: data.id ? data.id : "",
        name: data.name || name,
    };

    const category = Category.create(props);

    return category;
}

export class CategoryFactory {
    constructor() { }
    async makeCategory(data = {} as CategoryOverrides): Promise<Category> {
        const category = makeFakeCategory(data);

        const createCategory = await prisma.category.create({ data: CreateCategoryMapper.convertToPrisma(category) });

        return CategoryMapper.toDomain(createCategory);
    }
}

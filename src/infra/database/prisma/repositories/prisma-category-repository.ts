import { Category } from "@/domain/entities/category-entity";
import { prisma } from "../../lib/prisma";
import { CategoryRepository } from "../../repositories/category-repository";
import { CategoryMapper } from "../mappers/category/category-mapper";
import { CreateCategoryMapper } from "../mappers/category/create-category-mapper";
import { UpdateCategoryMapper } from "../mappers/category/update-category-mapper";

export class PrismaCategoryRepository implements CategoryRepository {
    async create(category: Category): Promise<Category> {

        const result = await prisma.category.create({
            data: CreateCategoryMapper.convertToPrisma(category),
        });

        return CategoryMapper.toDomain(result);
    }

    async list(): Promise<Category[]> {
        const result = await prisma.category.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return result.map(CategoryMapper.toDomain);
    }

    async update(category: Category): Promise<Category> {
        const result = await prisma.category.update({
            where: {
                id: category.id,
            },
            data: UpdateCategoryMapper.convertToPrisma(category),
        });
        return CategoryMapper.toDomain(result);
    }
}

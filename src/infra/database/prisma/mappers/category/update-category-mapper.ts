import { Category } from "@/domain/entities/category-entity";
import { Prisma } from "@prisma/client";
import { CategoryMapper } from "./category-mapper";

export class UpdateCategoryMapper extends CategoryMapper {
    static convertToPrisma(category: Category): Prisma.CategoryUpdateInput {
        return {
            name: category.name,
        };
    }
}

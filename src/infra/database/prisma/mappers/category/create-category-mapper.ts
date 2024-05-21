import { Category } from "@/domain/entities/category-entity";
import { Prisma } from "@prisma/client";
import { CategoryMapper } from "./category-mapper";

export class CreateCategoryMapper extends CategoryMapper {
    static convertToPrisma(category: Category): Prisma.CategoryCreateInput {
        return {
            name: category.name,
        };
    }
}

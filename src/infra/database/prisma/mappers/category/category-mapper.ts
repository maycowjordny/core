import { Category } from "@/domain/entities/category-entity";
import { Category as RawCategory } from "@prisma/client";

export class CategoryMapper {
    static toDomain(raw: RawCategory): Category {
        return new Category({
            id: raw.id,
            name: raw.name,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
}

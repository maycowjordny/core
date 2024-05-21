import { Category } from "@/domain/entities/category-entity";

export interface CategoryRepository {
  create(category: Category): Promise<Category>;
  list(): Promise<Category[]>;
  update(category: Category): Promise<Category>;
}

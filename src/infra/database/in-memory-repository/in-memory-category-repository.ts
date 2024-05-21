import { Category } from "@/domain/entities/category-entity";
import { CategoryRepository } from "../repositories/category-repository";

export class InMemoryCategoryRepository implements CategoryRepository {
    public items: Array<Category> = [];

    async create(category: Category): Promise<Category> {
        this.items.push(category);

        return category;
    }

    async list(): Promise<Category[]> {
        return this.items;
    }

    async update(category: Category): Promise<Category> {
        const categories = this.items.filter((item) => item.id == category.id)[0];

        const newCategory = new Category({
            ...categories.props,
            name: category.name,
        });

        return newCategory;
    }
}

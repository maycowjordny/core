import { Entity } from "@/core/domain/entities/entity";
import { Replace } from "@/core/logic/replace";

export type CategoryProps = {
    id?: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export class Category extends Entity<CategoryProps> {
    get id() {
        return this.props.id;
    }

    get name() {
        return this.props.name;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(
        props: Replace<
            CategoryProps,
            {
                createdAt?: Date;
            }
        >
    ) {
        const category = new Category({
            ...props,
        });

        return category;
    }
}

import { Entity } from "@/core/domain/entities/entity";
import { Replace } from "@/core/logic/replace";

export type AddressProps = {
    id?: string;
    description: string;
    lat: string;
    lng: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export class Address extends Entity<AddressProps> {
    get id() {
        return this.props.id;
    }

    get description() {
        return this.props.description;
    }

    get lat() {
        return this.props.lat;
    }

    get lng() {
        return this.props.lng;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(
        props: Replace<
            AddressProps,
            {
                createdAt?: Date;
            }
        >
    ) {
        const address = new Address({
            ...props,
        });

        return address;
    }
}

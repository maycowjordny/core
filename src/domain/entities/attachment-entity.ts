import { Entity } from "@/core/domain/entities/entity";
import { Replace } from "@/core/logic/replace";

export type AttachmentProps = {
    id?: string;
    absenceId: string;
    url?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export class Attachment extends Entity<AttachmentProps> {
    get id() {
        return this.props.id;
    }

    get absenceId() {
        return this.props.absenceId;
    }

    get url() {
        return this.props.url;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(
        props: Replace<
            AttachmentProps,
            {
                createdAt?: Date;
            }
        >
    ) {
        const attachment = new Attachment({
            ...props,
        });

        return attachment;
    }
}

import { Attachment } from "@/domain/entities/attachment-entity";
import { AttachmentRepository } from "../repositories/attachment-repository";

export class InMemoryAttachmentRepository implements AttachmentRepository {
    public items: Attachment[] = [];

    create = async (attachment: Attachment): Promise<Attachment> => {
        this.items.push(attachment);

        return attachment;
    };

    async update(data: Attachment): Promise<Attachment> {
        const attachment = this.items.find(item => item.id == data.id && item.absenceId == data.absenceId);

        const newAttachment = new Attachment({
            id: attachment!.id,
            absenceId: attachment!.absenceId,
            url: data.url,
            createdAt: attachment?.createdAt,
            updatedAt: attachment?.updatedAt
        });

        return newAttachment;
    }

    async delete(attachment: Attachment): Promise<null> {
        const index = this.items.findIndex((item) => item.id == attachment.id && item.absenceId == attachment.absenceId);

        if (index !== -1) this.items.splice(index, 1);

        return null;
    }

    async findById(id: string): Promise<Attachment | null> {
        return this.items.filter(item => item.id == id)[0];
    }
}

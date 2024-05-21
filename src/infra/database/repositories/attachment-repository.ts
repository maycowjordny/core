import { Attachment } from "@/domain/entities/attachment-entity";

export interface AttachmentRepository {
    create(attachment: Attachment): Promise<Attachment>;
    update(attachment: Attachment): Promise<Attachment>;
    findById(id: string): Promise<Attachment | null>;
    delete(attachment: Attachment): Promise<null>;
}

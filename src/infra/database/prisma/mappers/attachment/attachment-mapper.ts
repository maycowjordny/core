import { Attachment } from "@/domain/entities/attachment-entity";
import { Attachment as RawAttachment } from "@prisma/client";

export class AttachmentMapper {
    static toDomain(raw: RawAttachment): Attachment {
        return new Attachment({
            id: raw.id,
            url: raw.url,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            absenceId: raw.absenceId,
        });
    }
}

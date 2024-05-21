import { Attachment } from "@/domain/entities/attachment-entity";
import { Prisma } from "@prisma/client";
import { AttachmentMapper } from "./attachment-mapper";

export class UpdateAttachmentMapper extends AttachmentMapper {
    static convertToPrisma(attachment: Attachment): Prisma.AttachmentUpdateInput {
        return {
            url: attachment.url,
        };
    }
}

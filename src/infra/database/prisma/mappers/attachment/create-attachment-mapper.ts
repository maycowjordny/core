import { Attachment } from "@/domain/entities/attachment-entity";
import { Prisma } from "@prisma/client";
import { AttachmentMapper } from "./attachment-mapper";

export class CreateAttachmentMapper extends AttachmentMapper {
    static convertToPrisma(attachment: Attachment): Prisma.AttachmentCreateInput {
        return {
            url: attachment.url!,
            absence: { connect: { id: attachment.absenceId } },
        };
    }
}

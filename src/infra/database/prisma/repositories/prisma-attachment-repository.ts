import { Attachment } from "@/domain/entities/attachment-entity";
import { prisma } from "../../lib/prisma";
import { AttachmentRepository } from "../../repositories/attachment-repository";
import { AttachmentMapper } from "../mappers/attachment/attachment-mapper";
import { CreateAttachmentMapper } from "../mappers/attachment/create-attachment-mapper";
import { UpdateAttachmentMapper } from "../mappers/attachment/update-attachment-mapper";

export class PrismaAttachmentRepository implements AttachmentRepository {
    async create(attachment: Attachment): Promise<Attachment> {
        const result = await prisma.attachment.create({
            data: CreateAttachmentMapper.convertToPrisma(attachment),
        });

        return AttachmentMapper.toDomain(result);
    }

    async update(attachment: Attachment): Promise<Attachment> {
        const result = await prisma.attachment.update({
            where: {
                id: attachment.id,
                absenceId: attachment.absenceId
            },
            data: UpdateAttachmentMapper.convertToPrisma(attachment)
        });

        return AttachmentMapper.toDomain(result);
    }

    async delete(attachment: Attachment): Promise<null> {
        await prisma.attachment.delete({
            where: {
                id: attachment.id,
                absenceId: attachment.absenceId
            }
        });

        return null;
    }

    async findById(id: string): Promise<Attachment | null> {
        const attachment = await prisma.attachment.findFirst({
            where: {
                id
            }
        });

        return attachment && AttachmentMapper.toDomain(attachment);
    }
}

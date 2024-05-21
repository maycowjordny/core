import { Attachment, AttachmentProps } from "@/domain/entities/attachment-entity";
import { prisma } from "@/infra/database/lib/prisma";
import { AttachmentMapper } from "@/infra/database/prisma/mappers/attachment/attachment-mapper";
import { CreateAttachmentMapper } from "@/infra/database/prisma/mappers/attachment/create-attachment-mapper";
import { faker } from "@faker-js/faker";

type AttachmentOverrides = {
    id?: string;
    absenceId?: string;
    url?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export function makeFakeAttachment(data = {} as AttachmentOverrides) {
    const url = faker.internet.url();

    const props: AttachmentProps = {
        id: data.id ?? data.id,
        absenceId: data.absenceId ? data.absenceId : "",
        url: data.url || url,
    };

    const attachment = Attachment.create(props);

    return attachment;
}

export class AttachmentFactory {
    constructor() { }
    async makeAttachment(data = {} as AttachmentOverrides): Promise<Attachment> {
        const attachment = makeFakeAttachment(data);

        const result = await prisma.attachment.create({
            data: CreateAttachmentMapper.convertToPrisma(attachment)
        });

        return AttachmentMapper.toDomain(result);
    }
}

import { CreateAttachmentUseCase } from "@/application/use-cases/attachment/create-attachment-use-case";
import { PrismaAttachmentRepository } from "@/infra/database/prisma/repositories/prisma-attachment-repository";
import { SaveUpload } from "@/infra/storage/save-upload";

export function makeCreateAttachment() {
    const attachmentRepository = new PrismaAttachmentRepository();
    const uploader = new SaveUpload();
    const createAttachmentUseCase = new CreateAttachmentUseCase(uploader, attachmentRepository);

    return createAttachmentUseCase;
}

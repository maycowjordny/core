import { DeleteAttachmentUseCase } from "@/application/use-cases/attachment/delete-attachment-use-case";
import { FindAttachmentByIdUseCase } from "@/application/use-cases/attachment/find-attachment-by-id-use-case";
import { PrismaAttachmentRepository } from "@/infra/database/prisma/repositories/prisma-attachment-repository";
import { SaveUpload } from "@/infra/storage/save-upload";

export function makeDeleteAttachment() {
    const attachmentRepository = new PrismaAttachmentRepository();
    const findAttachmentByIdUseCase = new FindAttachmentByIdUseCase(attachmentRepository);
    const uploader = new SaveUpload();
    const deleteAttachmentUseCase = new DeleteAttachmentUseCase(uploader, attachmentRepository, findAttachmentByIdUseCase);

    return deleteAttachmentUseCase;
}

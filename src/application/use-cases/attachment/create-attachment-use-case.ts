import { Attachment } from "@/domain/entities/attachment-entity";
import { AttachmentRepository } from "@/infra/database/repositories/attachment-repository";
import { UploadParams, Uploader } from "@/infra/storage/uploader";
import { CreateAttachmentException } from "./errors/create-attachment-exception";

export class CreateAttachmentUseCase {
    constructor(
        private uploader: Uploader,
        private attachmentRepository: AttachmentRepository
    ) { }

    async execute(attachmentInput: UploadParams[]): Promise<Attachment[]> {
        try {
            const attachments = await this.uploader.upload(attachmentInput);

            return await Promise.all(attachments.map(this.attachmentRepository.create));
        } catch (err) {
            throw new CreateAttachmentException(err);
        }
    }
}

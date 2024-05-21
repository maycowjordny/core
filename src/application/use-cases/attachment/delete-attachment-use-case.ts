import { AttachmentRepository } from "@/infra/database/repositories/attachment-repository";
import { Uploader } from "@/infra/storage/uploader";
import { AttachmentNotFoundException } from "./errors/attachment-not-found-exception";
import { DeleteAttachmentException } from "./errors/delete-attachment-exception";
import { FindAttachmentByIdUseCase } from "./find-attachment-by-id-use-case";

export class DeleteAttachmentUseCase {
    constructor(
        private uploader: Uploader,
        private attachmentRepository: AttachmentRepository,
        private findAttachmentByIdUseCase: FindAttachmentByIdUseCase
    ) { }

    async execute(attachmentId: string): Promise<null> {
        try {
            const attachment = await this.findAttachmentByIdUseCase.execute(attachmentId);

            if (!attachment) throw new AttachmentNotFoundException();

            await this.attachmentRepository.delete(attachment);

            return await this.uploader.delete(attachment);

        } catch (err: any) {
            if (err instanceof AttachmentNotFoundException) {
                throw new AttachmentNotFoundException();
            }
            throw new DeleteAttachmentException(err);
        }
    }
}

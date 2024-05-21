import { Attachment } from "@/domain/entities/attachment-entity";
import { AttachmentRepository } from "@/infra/database/repositories/attachment-repository";

export class FindAttachmentByIdUseCase {
    constructor(private attachmentRepository: AttachmentRepository) { }

    async execute(id: string): Promise<Attachment | null> {
        return await this.attachmentRepository.findById(id);
    }
}

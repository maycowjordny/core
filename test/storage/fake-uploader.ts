import { Attachment } from "@/domain/entities/attachment-entity";
import { UploadParams, Uploader } from "@/infra/storage/uploader";

export class FakeUploader implements Uploader {
    public uploads: Attachment[] = [];

    async upload(multipart: UploadParams[]): Promise<Attachment[]> {
        const createdAttachments: Attachment[] = [];

        for await (const part of multipart) {
            const timestamp = new Date().getTime();
            const filePath = `${part.absenceId}_${timestamp}.png`;

            const attachment = new Attachment({
                absenceId: part.absenceId,
                url: filePath
            });

            this.uploads.push(attachment);
        }

        return createdAttachments;
    }

    async delete(attachment: Attachment): Promise<null> {
        const attachmentIndex = this.uploads.findIndex(
            (item) => item.id === attachment.id
        );

        if (attachmentIndex !== -1) this.uploads.splice(attachmentIndex, 1)[0];

        return null;
    }
}

import { Attachment } from "@/domain/entities/attachment-entity";
import fs from "node:fs";
import { UploadParams, Uploader } from "./uploader";

export class SaveUpload implements Uploader {
    async upload(multipart: UploadParams[]): Promise<Attachment[]> {
        const createdAttachments: Attachment[] = [];

        for await (const part of multipart) {
            const timestamp = new Date().getTime();
            const filePath = `./src/public/${part.absenceId}_${timestamp}.png`;

            fs.writeFileSync(filePath, part.body);

            const attachment = new Attachment({
                absenceId: part.absenceId,
                url: filePath
            });

            createdAttachments.push(attachment);
        }

        return createdAttachments;
    }

    async delete(attachment: Attachment): Promise<null> {
        fs.unlinkSync(attachment.url!);

        return null;
    }
}

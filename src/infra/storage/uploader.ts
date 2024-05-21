import { Attachment } from "@/domain/entities/attachment-entity";

export interface UploadParams {
    absenceId: string;
    attachmentId?: string;
    fileName: string;
    fileType?: string;
    body: Buffer;
}

export abstract class Uploader {
    abstract upload(multipart: UploadParams[]): Promise<Attachment[]>;
    abstract delete(attachment: Attachment): Promise<null>;
}

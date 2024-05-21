import { makeCreateAttachment } from "@/application/factories/attachment/make-create-attachment-use-case";
import { CreateAttachmentException } from "@/application/use-cases/attachment/errors/create-attachment-exception";
import { UploadParams } from "@/infra/storage/uploader";
import { MultipartFile } from "@fastify/multipart";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { uploadSchema } from "../../zod/schema/attachment/attachment-schema";

export class CreateAttachmentController {
    public create = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const files = await this.validateFiles(request.params, request.files());

            const createAttachmentUseCase = makeCreateAttachment();

            const attachments = await createAttachmentUseCase.execute(files);

            reply.status(201).send({ attachmentsId: attachments.map(attach => attach.id) });
        } catch (err) {
            if (err instanceof CreateAttachmentException) {
                return reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private async validateFiles(params: FastifyRequestType["params"], files: AsyncIterableIterator<MultipartFile>): Promise<UploadParams[]> {
        const { absenceId } = params as { absenceId: string };
        const validatedFiles: UploadParams[] = [];

        for await (const file of files) {
            try {
                const validateFiles = {
                    absenceId,
                    fileName: file.filename,
                    fileType: file.mimetype,
                    length: file.file.bytesRead,
                    body: await file.toBuffer()
                };

                const result = uploadSchema.parse(validateFiles);

                validatedFiles.push({
                    absenceId: result.absenceId,
                    body: result.body,
                    fileName: result.fileName,
                });
            } catch (err: any) {
                throw new CreateAttachmentException(err);
            }
        }

        return validatedFiles;
    }
}

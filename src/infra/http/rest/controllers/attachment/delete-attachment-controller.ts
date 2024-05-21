import { makeDeleteAttachment } from "@/application/factories/attachment/make-delete-attachment-use-case";
import { DeleteAttachmentException } from "@/application/use-cases/attachment/errors/delete-attachment-exception";
import { FastifyReply, FastifyRequest } from "fastify";

export class DeleteAttachmentController {
    public delete = async (request: FastifyRequest, reply: FastifyReply) => {

        try {
            const { attachmentId } = request.params as { attachmentId: string };

            const deleteAttachmentUseCase = makeDeleteAttachment();

            await deleteAttachmentUseCase.execute(attachmentId);

            reply.status(200).send({ message: "Attachment delete successfully!" });
        } catch (err) {
            if (err instanceof DeleteAttachmentException) {
                return reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

}

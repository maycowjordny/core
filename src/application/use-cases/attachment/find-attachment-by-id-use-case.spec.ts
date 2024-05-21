import { InMemoryAttachmentRepository } from "@/infra/database/in-memory-repository/in-memory-attachment-repository";
import { makeFakeAttachment } from "test/factories/attachment-factory";
import { beforeEach, describe, expect, it } from "vitest";
import { FindAttachmentByIdUseCase } from "./find-attachment-by-id-use-case";

describe("FindAttachmentByIdUseCase", () => {
    let attachmentRepository: InMemoryAttachmentRepository;
    let findAttachmentByIdUseCase: FindAttachmentByIdUseCase;

    beforeEach(() => {
        attachmentRepository = new InMemoryAttachmentRepository();
        findAttachmentByIdUseCase = new FindAttachmentByIdUseCase(attachmentRepository);
    });

    it("should be able to find attachment by id", async () => {
        const attachment = makeFakeAttachment({ id: "attachmentId-01", absenceId: "absenceId-01" });

        attachmentRepository.create(attachment);

        const output = await findAttachmentByIdUseCase.execute(attachment.id!);

        expect(output).toMatchObject(attachment);
    });
});

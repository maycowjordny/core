import { InMemoryAbsenceRepository } from "@/infra/database/in-memory-repository/in-memory-absence-repository";
import { InMemoryAttachmentRepository } from "@/infra/database/in-memory-repository/in-memory-attachment-repository";
import { makeFakeAbsence } from "test/factories/absence-factory";
import { makeFakeAttachment } from "test/factories/attachment-factory";
import { FakeUploader } from "test/storage/fake-uploader";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteAttachmentUseCase } from "./delete-attachment-use-case";
import { AttachmentNotFoundException } from "./errors/attachment-not-found-exception";
import { DeleteAttachmentException } from "./errors/delete-attachment-exception";
import { FindAttachmentByIdUseCase } from "./find-attachment-by-id-use-case";

describe("DeleteAttachmentUseCase", () => {
    let absenceRepository: InMemoryAbsenceRepository;
    let attachmentRepository: InMemoryAttachmentRepository;
    let attachmentUseCase: DeleteAttachmentUseCase;
    let findAttachmentByIdUseCase: FindAttachmentByIdUseCase;
    let uploader: FakeUploader;

    beforeEach(() => {
        absenceRepository = new InMemoryAbsenceRepository();
        attachmentRepository = new InMemoryAttachmentRepository();
        uploader = new FakeUploader();
        findAttachmentByIdUseCase = new FindAttachmentByIdUseCase(attachmentRepository);
        attachmentUseCase = new DeleteAttachmentUseCase(uploader, attachmentRepository, findAttachmentByIdUseCase);
    });

    it("should be able to delete attachment", async () => {
        const absence = makeFakeAbsence({ id: "absenceId-01", });
        await absenceRepository.create(absence);

        const attachment = makeFakeAttachment({
            id: "attachmentId-01",
            absenceId: "absenceId-01"
        });

        await attachmentRepository.create(attachment);

        vi.spyOn(uploader, "delete").mockResolvedValue(null);

        const output = await attachmentUseCase.execute(attachment.id!);

        expect(output).toBeNull();
        expect(attachmentRepository.items.map(item => item)).toHaveLength(0);
    });

    it("cannot delete a attachment when generic error", async () => {
        const absence = makeFakeAbsence({ id: "absenceId-01", });
        await absenceRepository.create(absence);

        vi.spyOn(attachmentRepository, "delete").mockRejectedValue(Error);

        const attachment = makeFakeAttachment({
            id: "attachmentId-01",
            absenceId: absence.id!
        });

        await attachmentRepository.create(attachment);

        await expect(attachmentUseCase.execute(attachment.id!)).rejects.toThrow(DeleteAttachmentException);
    });

    it("cannot delete a attachment when not found error", async () => {
        const absence = makeFakeAbsence({ id: "absenceId-01", });
        await absenceRepository.create(absence);

        vi.spyOn(attachmentRepository, "delete").mockRejectedValue(AttachmentNotFoundException);

        const attachment = makeFakeAttachment({
            id: "attachmentId-01",
            absenceId: absence.id!
        });

        await expect(attachmentUseCase.execute(attachment.id!)).rejects.toThrow(AttachmentNotFoundException);
    });
});

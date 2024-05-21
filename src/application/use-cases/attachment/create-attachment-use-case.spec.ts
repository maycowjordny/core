import { InMemoryAbsenceRepository } from "@/infra/database/in-memory-repository/in-memory-absence-repository";
import { InMemoryAttachmentRepository } from "@/infra/database/in-memory-repository/in-memory-attachment-repository";
import { UploadParams } from "@/infra/storage/uploader";
import { makeFakeAbsence } from "test/factories/absence-factory";
import { makeFakeAttachment } from "test/factories/attachment-factory";
import { FakeUploader } from "test/storage/fake-uploader";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateAttachmentUseCase } from "./create-attachment-use-case";
import { CreateAttachmentException } from "./errors/create-attachment-exception";

describe("CreateAttachmentUseCase", () => {
    let absenceRepository: InMemoryAbsenceRepository;
    let attachmentRepository: InMemoryAttachmentRepository;
    let attachmentUseCase: CreateAttachmentUseCase;
    let uploader: FakeUploader;

    beforeEach(() => {
        absenceRepository = new InMemoryAbsenceRepository();
        attachmentRepository = new InMemoryAttachmentRepository();
        uploader = new FakeUploader();
        attachmentUseCase = new CreateAttachmentUseCase(uploader, attachmentRepository);
    });

    it("should be able to create attachment", async () => {
        const absence = makeFakeAbsence({ id: "absenceId-01", });
        await absenceRepository.create(absence);

        const multipart: UploadParams[] = [{
            absenceId: absence.id!,
            fileName: "profile.png",
            body: Buffer.from(""),
        }];

        const attachment = makeFakeAttachment({
            id: "attachmentId-01",
            absenceId: absence.id!
        });

        vi.spyOn(uploader, "upload").mockResolvedValue([attachment]);

        const output = await attachmentUseCase.execute(multipart);

        output.map(out => expect(out).toMatchObject({
            absenceId: absence.id,
            url: expect.any(String),
        }));
    });

    it("cannot create a attachment when generic error", async () => {
        const absence = makeFakeAbsence({ id: "absenceId-01", });
        await absenceRepository.create(absence);

        vi.spyOn(attachmentRepository, "create").mockRejectedValue(Error);

        const attachment = makeFakeAttachment({
            id: "attachmentId-01",
            absenceId: absence.id!
        });

        const multipart: UploadParams[] = [{
            absenceId: "",
            fileName: "profile.png",
            body: Buffer.from(""),
        }];

        vi.spyOn(uploader, "upload").mockResolvedValue([attachment]);

        await expect(attachmentUseCase.execute(multipart)).rejects.toThrow(CreateAttachmentException);
    });
});

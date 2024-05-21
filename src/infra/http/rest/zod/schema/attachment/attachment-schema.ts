import { z } from "zod";
import { MaxSizeFileException } from "./errors/max-size-file-exception";
import { TypeFileException } from "./errors/type-file-exception";

const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_FILE_SIZE = 3 * 1024 * 1024;

export const uploadSchema = z
    .object({
        absenceId: z.string(),
        attachmentId: z.string().optional(),
        fileName: z.string(),
        fileType: z.string(),
        length: z.number(),
        body: z.any()
    })
    .refine((file) => {
        if (!ACCEPTED_MIME_TYPES.includes(file.fileType)) throw new TypeFileException();
        return true;
    })
    .refine((file) => {
        if (file.length > MAX_FILE_SIZE) throw new MaxSizeFileException();
        return true;
    });

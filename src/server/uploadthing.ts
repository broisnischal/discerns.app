import "@tanstack/react-start/server-only";
import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  }).onUploadComplete(({ file }) => {
    return {
      fileUrl: file.ufsUrl,
      fileName: file.name,
    };
  }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

import { createServerFn } from "@tanstack/react-start";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export interface UploadedImage {
  id: string;
  key: string;
  name: string;
  url: string;
}

export const $getUploadedImages = createServerFn({ method: "GET" }).handler(async () => {
  const response = await utapi.listFiles({
    limit: 100,
  });

  return response.files.map((file) => ({
    id: file.id,
    key: file.key,
    name: file.name,
    // Public UploadThing files can be accessed directly by key.
    url: `https://utfs.io/f/${file.key}`,
  })) satisfies UploadedImage[];
});

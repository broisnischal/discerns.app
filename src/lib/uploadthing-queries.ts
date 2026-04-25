import { queryOptions } from "@tanstack/react-query";

import { $getUploadedImages } from "@/lib/uploadthing-functions";

export const uploadedImagesQueryKey = ["uploaded-images"] as const;

export const uploadedImagesQueryOptions = () =>
  queryOptions({
    queryKey: uploadedImagesQueryKey,
    queryFn: ({ signal }) => $getUploadedImages({ signal }),
  });

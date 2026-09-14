"use client";

import { FileDropzone } from "@cronus-ui/ui/file-dropzone";

/**
 * `onFiles` is a function prop, which a Server Component cannot pass to the
 * client `FileDropzone` ("Event handlers cannot be passed to Client Component
 * props"). The audit only needs the idle DOM, so the no-op lives here.
 */
export function FileDropzoneFixture({
  "aria-label": ariaLabel,
  accept,
  multiple,
  disabled,
}: {
  "aria-label"?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}) {
  return (
    <FileDropzone
      onFiles={() => {}}
      aria-label={ariaLabel ?? "Upload files"}
      accept={accept}
      multiple={multiple}
      disabled={disabled}
    />
  );
}

"use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@cronus-ui/ui/prompt-input";
import type { FormHTMLAttributes } from "react";

/**
 * PromptInput audited at rest: a form with the composer textarea, an empty
 * tools row and the submit button. A client component because `onSubmit` is a
 * required handler and cannot cross the server/client boundary of the audit
 * page. `action` / `method` are native form attributes PromptInput spreads onto
 * its `<form>` (the zero-JS kernel submits through them).
 */
export function PromptInputFixture({
  placeholder,
  action,
  method,
}: {
  placeholder?: string;
  action?: string;
  method?: string;
}) {
  const native: Pick<FormHTMLAttributes<HTMLFormElement>, "action" | "method"> = {
    action,
    method,
  };
  return (
    <PromptInput {...native} onSubmit={() => undefined}>
      <PromptInputBody>
        <PromptInputTextarea placeholder={placeholder} />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools />
        <PromptInputSubmit />
      </PromptInputFooter>
    </PromptInput>
  );
}

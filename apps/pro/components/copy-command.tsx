import { CopyButton } from "@kronus-ui/ui/copy-button";

export function CopyCommand({ command }: { command: string }) {
  return (
    <div className="flex items-center gap-2">
      <code className="min-w-0 flex-1 truncate font-mono text-xs text-fg-secondary">
        <span className="select-none text-fg-tertiary">$ </span>
        {command}
      </code>
      <CopyButton
        value={command}
        size="icon-sm"
        className="shrink-0 text-fg-tertiary transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:text-fg"
        copyLabel="Copy scaffold command"
      />
    </div>
  );
}

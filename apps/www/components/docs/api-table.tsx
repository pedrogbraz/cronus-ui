import type { ReactNode } from "react";

/** Inline code chip shared by field names and types — matches `props-table`. */
export function ApiCode({ children, muted = false }: { children: string; muted?: boolean }) {
  return (
    <code
      className={`whitespace-pre-wrap break-words rounded-md border border-border bg-surface-overlay px-1.5 py-0.5 font-mono text-[0.8125rem] ${
        muted ? "text-fg-secondary" : "text-fg"
      }`}
    >
      {children}
    </code>
  );
}

export interface ApiTableRow {
  key: string;
  cells: readonly ReactNode[];
}

function tableId(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Server-safe docs table. Visual language matches `props-table.tsx`:
 * bordered frame, uppercase headers, mono chips, skip link.
 */
export function ApiTable({
  label,
  columns,
  rows,
  id,
}: {
  label: string;
  columns: readonly string[];
  rows: readonly ApiTableRow[];
  /** Override the skip-link id when two tables share a label. */
  id?: string;
}) {
  const endId = `${id ?? tableId(label)}-end`;

  return (
    <>
      <section
        aria-label={label}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region is intentionally focusable so keyboard users can scroll it.
        tabIndex={0}
        className="overflow-x-auto rounded-xl border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring focus-within:ring-2 focus-within:ring-ring"
      >
        <a
          href={`#${endId}`}
          className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:m-2 focus:rounded-md focus:bg-surface-raised focus:px-3 focus:py-2 focus:text-sm focus:text-fg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip {label} table
        </a>
        <table className="w-full min-w-[40rem] border-collapse text-start text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-fg-tertiary">
              {columns.map((column) => (
                <th key={column} scope="col" className="px-4 py-2.5 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_td:first-child]:ps-4 [&_td:last-child]:pe-4">
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-border-soft align-top last:border-b-0">
                {columns.map((column, index) => (
                  <td key={column} className="py-3 pe-4">
                    {row.cells[index]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <span id={endId} className="sr-only" />
    </>
  );
}

export interface ApiFieldRow {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: ReactNode;
}

const FIELD_COLUMNS = ["Field", "Type", "Default", "Description"] as const;

export function ApiFieldTable({
  label,
  rows,
  id,
}: {
  label: string;
  rows: readonly ApiFieldRow[];
  id?: string;
}) {
  return (
    <ApiTable
      id={id}
      label={label}
      columns={FIELD_COLUMNS}
      rows={rows.map((row) => ({
        key: row.name,
        cells: [
          <FieldName key={row.name} name={row.name} required={row.required} />,
          <ApiCode key={`${row.name}-type`} muted>
            {row.type}
          </ApiCode>,
          row.defaultValue ? (
            <ApiCode key={`${row.name}-default`} muted>
              {row.defaultValue}
            </ApiCode>
          ) : (
            <span key={`${row.name}-default`} className="text-fg-tertiary">
              —
            </span>
          ),
          <span
            key={`${row.name}-description`}
            className="text-sm leading-relaxed text-fg-secondary"
          >
            {row.description}
          </span>,
        ],
      }))}
    />
  );
}

function FieldName({ name, required }: { name: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <ApiCode>{name}</ApiCode>
      {required ? (
        <span className="font-mono text-xs text-fg-tertiary" title="Required">
          *
        </span>
      ) : null}
    </div>
  );
}

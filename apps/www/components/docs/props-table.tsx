import type { PropsDoc } from "../../lib/props.generated";

/** Inline code chip shared by prop names and types — matches the docs idiom. */
function Code({ children, muted = false }: { children: string; muted?: boolean }) {
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

function PropRow({
  name,
  type,
  required,
  description,
  defaultValue,
}: {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: string;
}) {
  return (
    <tr className="border-b border-border-soft align-top last:border-b-0">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-1.5">
          <Code>{name}</Code>
          {required ? (
            <span className="font-mono text-xs text-fg-tertiary" title="Required">
              *
            </span>
          ) : null}
        </div>
      </td>
      <td className="py-3 pr-4">
        <Code muted>{type}</Code>
      </td>
      <td className="py-3 pr-4">
        {defaultValue ? (
          <Code muted>{defaultValue}</Code>
        ) : (
          <span className="text-fg-tertiary">—</span>
        )}
      </td>
      <td className="py-3 text-sm leading-relaxed text-fg-secondary">
        {description ?? <span className="text-fg-tertiary">—</span>}
      </td>
    </tr>
  );
}

function PropsInterfaceTable({
  doc,
  hideHeading = false,
}: {
  doc: PropsDoc;
  hideHeading?: boolean;
}) {
  return (
    <div>
      {hideHeading ? null : (
        <h3 className="font-mono text-sm font-medium text-fg">{doc.interfaceName}</h3>
      )}
      {doc.extends ? <p className="mt-1 text-xs text-fg-tertiary">{doc.extends}</p> : null}

      {doc.props.length === 0 ? (
        <p className="mt-3 text-sm text-fg-tertiary">
          No own props — see the extended type above for available props.
        </p>
      ) : (
        <>
          <section
            aria-label={`${doc.interfaceName} props`}
            className="mt-3 overflow-x-auto rounded-xl border border-border outline-none focus-within:ring-2 focus-within:ring-ring"
          >
            <a
              href={`#${doc.interfaceName}-props-end`}
              className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:m-2 focus:rounded-md focus:bg-surface-raised focus:px-3 focus:py-2 focus:text-sm focus:text-fg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Skip {doc.interfaceName} props table
            </a>
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-fg-tertiary">
                  <th className="px-4 py-2.5 font-medium">Prop</th>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Default</th>
                  <th className="px-4 py-2.5 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4">
                {doc.props.map((prop) => (
                  <PropRow
                    key={prop.name}
                    name={prop.name}
                    type={prop.type}
                    required={prop.required}
                    description={prop.description}
                    defaultValue={prop.default}
                  />
                ))}
              </tbody>
            </table>
          </section>
          <span id={`${doc.interfaceName}-props-end`} className="sr-only" />
        </>
      )}
    </div>
  );
}

/**
 * Renders the auto-generated API reference for a component: one table per
 * exported `*Props` interface, with the interface name as a heading and its
 * `extends` heritage as a muted note. Props marked with `*` are required.
 */
export function PropsTable({
  docs,
  hideHeading = false,
}: {
  docs: PropsDoc[];
  hideHeading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-8">
      {docs.map((doc) => (
        <PropsInterfaceTable key={doc.interfaceName} doc={doc} hideHeading={hideHeading} />
      ))}
    </div>
  );
}

import { CodeBlock } from "../../../components/docs/code-block";
import {
  Checklist,
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  InlineCode,
} from "../../../components/docs/documentation";

const formPattern = `import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, FieldDescription, FieldError, FieldLabel, Input } from "@cronus-ui/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email()
});

export function InviteForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" }
  });

  return (
    <form onSubmit={form.handleSubmit(console.log)} className="grid gap-4">
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" {...form.register("email")} />
        <FieldDescription>Use the teammate work email.</FieldDescription>
        <FieldError>{form.formState.errors.email?.message}</FieldError>
      </Field>
      <Button type="submit">Send invite</Button>
    </form>
  );
}`;

const formChecklist = [
  "Every input has a visible label or an explicit accessible name.",
  "Descriptions and errors are adjacent to the field they explain.",
  "Server-side errors map back to the same field component.",
  "Submit buttons expose loading and disabled states without losing text.",
  "Validation does not depend on color alone.",
] as const;

const formComponents = [
  {
    title: "Field",
    description: "Layout primitive for label, description, control, and error text.",
  },
  {
    title: "Form",
    description: "React Hook Form bridge with field context and message helpers.",
  },
  {
    title: "Input OTP",
    description: "One-time-code fields with grouped slots and keyboard-friendly entry.",
  },
  {
    title: "FileDropzone",
    description: "Upload state, accepted files, rejected files, and screen-reader feedback.",
  },
] as const;

export default function FormsPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Forms"
        title="Build forms with explicit field structure"
        description="Form components are designed around labels, descriptions, errors, loading states, and server feedback so validation remains understandable."
      />

      <DocsSection title="Form components">
        <DocsGrid columns={2}>
          {formComponents.map((component) => (
            <DocsCard
              key={component.title}
              title={component.title}
              description={component.description}
            />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="React Hook Form and Zod"
        description="Use the native form event, keep validation schema close to the form, and render messages through FieldError."
      >
        <CodeBlock code={formPattern} language="tsx" expandable />
      </DocsSection>

      <DocsSection title="Checklist">
        <Checklist items={formChecklist} />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          For framework routes, loader/action errors should return data that maps back to{" "}
          <InlineCode>FieldError</InlineCode> or the same field-level error region.
        </p>
      </DocsSection>
    </div>
  );
}

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form.js";
import { Input } from "./input.js";

// A minimal validated form: "email" is required, so submitting empty surfaces a
// FormMessage and drives aria-invalid onto the FormControl-wrapped Input.
function EmailForm() {
  const form = useForm<{ email: string }>({ defaultValues: { email: "" }, mode: "onSubmit" });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} noValidate>
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>We never share it.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}

describe("Form", () => {
  // useFormField throws when rendered outside <Form>/<FormField>/<FormItem>.
  // It calls react-hook-form's useFormState (which dereferences the missing
  // FormProvider context) before reaching the custom guards, so the thrown
  // error comes from react-hook-form — but the throw itself is the contract.
  describe("hooks used outside their providers", () => {
    it("FormLabel throws without <Form>", () => {
      expect(() => render(<FormLabel>Outside</FormLabel>)).toThrow();
    });

    it("FormControl throws without <Form>", () => {
      expect(() =>
        render(
          <FormControl>
            <input />
          </FormControl>,
        ),
      ).toThrow();
    });

    it("FormMessage throws without <Form>", () => {
      expect(() => render(<FormMessage>Outside</FormMessage>)).toThrow();
    });
  });

  it("renders a labelled control with description inside a Form", () => {
    render(<EmailForm />);
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(screen.getByText("We never share it.")).toBeInTheDocument();
    // The label's htmlFor resolves to the control's generated id.
    expect(input).toHaveAttribute("id");
  });

  it("shows the FormMessage and sets aria-invalid on submit of an invalid value", async () => {
    render(<EmailForm />);
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    const message = await screen.findByRole("alert");
    expect(message).toHaveTextContent("Email is required");

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    // The control points its aria-describedby at the message for SR users.
    expect(input.getAttribute("aria-describedby")).toContain(message.id);
  });

  it("clears the error once a valid value is entered and resubmitted", async () => {
    render(<EmailForm />);
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    await userEvent.type(screen.getByRole("textbox", { name: "Email" }), "ada@cronus.com");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute("aria-invalid", "false");
  });

  it("has no axe violations in the error state", async () => {
    const { container } = render(<EmailForm />);
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    await screen.findByRole("alert");
    expect(await axe(container)).toHaveNoViolations();
  });
});

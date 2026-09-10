import { render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { RichTextEditor } from "./rich-text-editor.js";

// Tiptap/ProseMirror reaches for layout geometry APIs jsdom does not implement.
// Provide the no-op geometry shims it needs so the editor view can mount under
// jsdom without throwing.
beforeAll(() => {
  const rect = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  };
  if (!Range.prototype.getClientRects) {
    Range.prototype.getClientRects = () =>
      ({
        item: () => null,
        length: 0,
        [Symbol.iterator]: function* () {},
      }) as unknown as DOMRectList;
  }
  if (!Range.prototype.getBoundingClientRect) {
    Range.prototype.getBoundingClientRect = () => rect as DOMRect;
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
  if (!Element.prototype.getClientRects) {
    Element.prototype.getClientRects = () =>
      ({
        item: () => null,
        length: 0,
        [Symbol.iterator]: function* () {},
      }) as unknown as DOMRectList;
  }
});

describe("RichTextEditor", () => {
  it("renders the formatting toolbar with labelled controls", () => {
    render(<RichTextEditor defaultValue="<p>Hello</p>" />);

    expect(screen.getByRole("toolbar", { name: "Text formatting" })).toBeInTheDocument();
    // A representative sample of the toolbar controls, addressed by aria-label.
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bullet list" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Redo" })).toBeInTheDocument();
  });

  it("mounts without throwing and exposes the editor shell", () => {
    const { container } = render(<RichTextEditor defaultValue="<p>Hello</p>" />);
    expect(container.querySelector('[data-slot="rich-text-editor"]')).toBeInTheDocument();
  });

  it("renders the provided initial content once the editor view mounts", async () => {
    const { container } = render(<RichTextEditor defaultValue="<p>Hello world</p>" />);
    // ProseMirror mounts asynchronously; if it initializes under jsdom the
    // content is reflected in the editable region.
    await waitFor(() => {
      expect(container.querySelector(".ProseMirror")).toHaveTextContent("Hello world");
    });
  });

  it("shows the placeholder when empty", () => {
    render(<RichTextEditor placeholder="Write something…" />);
    expect(screen.getByText("Write something…")).toBeInTheDocument();
  });

  it("renders a labelled, editable textbox region", () => {
    render(<RichTextEditor aria-label="Post body" defaultValue="<p>Hello</p>" />);
    expect(screen.getByRole("textbox", { name: "Post body" })).toBeInTheDocument();
  });

  it("has no axe violations on the rendered shell", async () => {
    const { container } = render(
      <RichTextEditor aria-label="Editor" defaultValue="<p>Accessible content</p>" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("gives each editor a unique content id wired to its toolbar", async () => {
    const { container } = render(
      <>
        <RichTextEditor defaultValue="<p>One</p>" />
        <RichTextEditor defaultValue="<p>Two</p>" />
      </>,
    );
    const toolbars = container.querySelectorAll('[role="toolbar"]');
    const controls = [...toolbars].map((toolbar) => toolbar.getAttribute("aria-controls"));
    expect(controls[0]).toBeTruthy();
    expect(controls[1]).toBeTruthy();
    expect(controls[0]).not.toBe(controls[1]);
    expect(controls[0]).not.toBe("rich-text-editor-content");

    await waitFor(() => {
      expect(container.querySelectorAll(".ProseMirror")).toHaveLength(2);
    });
    const ids = [...container.querySelectorAll(".ProseMirror")].map((node) => node.id);
    expect(ids).toEqual(controls);
  });
});

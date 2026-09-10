import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  AiCodeBlock,
  AiCodeBlockBody,
  AiCodeBlockContent,
  AiCodeBlockCopyButton,
  AiCodeBlockFilename,
  AiCodeBlockFiles,
  AiCodeBlockHeader,
  AiCodeBlockItem,
} from "./ai-code-block.js";

const data = [
  { filename: "hello.ts", language: "typescript", code: "const x = 1;" },
  { filename: "bye.ts", language: "typescript", code: "const y = 2;" },
];

function Fixture() {
  return (
    <AiCodeBlock data={data} defaultValue="hello.ts">
      <AiCodeBlockHeader>
        <AiCodeBlockFiles>
          {(item) => (
            <AiCodeBlockFilename key={item.filename} value={item.filename}>
              {item.filename}
            </AiCodeBlockFilename>
          )}
        </AiCodeBlockFiles>
        <AiCodeBlockCopyButton />
      </AiCodeBlockHeader>
      <AiCodeBlockBody>
        {(item) => (
          <AiCodeBlockItem key={item.filename} value={item.filename}>
            <AiCodeBlockContent language={item.language}>{item.code}</AiCodeBlockContent>
          </AiCodeBlockItem>
        )}
      </AiCodeBlockBody>
    </AiCodeBlock>
  );
}

describe("AiCodeBlock", () => {
  it("renders the active file code", () => {
    render(<Fixture />);
    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
    expect(screen.getByText("hello.ts")).toBeInTheDocument();
  });

  it("copies the active file to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    // userEvent.setup() installs a getter-only clipboard stub — redefine after.
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<Fixture />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("const x = 1;");
  });

  it("accepts composed JSX children and an explicit copy payload", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(
      <AiCodeBlock data={data} defaultValue="hello.ts">
        <AiCodeBlockHeader>
          <AiCodeBlockCopyButton code="override" />
        </AiCodeBlockHeader>
        <AiCodeBlockBody>
          <AiCodeBlockItem value="hello.ts">
            <AiCodeBlockContent>const x = 1;</AiCodeBlockContent>
          </AiCodeBlockItem>
        </AiCodeBlockBody>
      </AiCodeBlock>,
    );

    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("override");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Fixture />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

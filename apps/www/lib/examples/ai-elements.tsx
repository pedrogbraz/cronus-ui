"use client";

import {
  Action,
  Actions,
  AiCodeBlock,
  AiCodeBlockBody,
  AiCodeBlockContent,
  AiCodeBlockCopyButton,
  AiCodeBlockHeader,
  AiCodeBlockItem,
  Artifact,
  ArtifactContent,
  ArtifactHeader,
  ArtifactTitle,
  Branch,
  BranchMessages,
  BranchNext,
  BranchPage,
  BranchPrevious,
  BranchSelector,
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  GeneratedImage,
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationSource,
  InlineCitationText,
  Loader,
  Message,
  MessageAvatar,
  MessageContent,
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInLabel,
  OpenInSeparator,
  OpenInTrigger,
  Plan,
  PlanContent,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  Queue,
  QueueItem,
  QueueItemContent,
  QueueItemIndicator,
  QueueList,
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
  Response,
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
  Suggestion,
  Suggestions,
  Task,
  TaskContent,
  TaskItem,
  TaskTrigger,
  TextShimmer,
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "@cronus-ui/ui";
import { Copy, RefreshCw, Share } from "lucide-react";
import type { FormEvent } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

const PIXEL =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

export const aiElementsExamples: ExampleMap = {
  actions: [
    {
      id: "default",
      title: "Message actions",
      description: "Icon buttons that sit under an assistant turn — copy, retry, share.",
      code: `<Actions>
  <Action tooltip="Copy" label="Copy">
    <Copy />
  </Action>
  <Action tooltip="Retry" label="Retry">
    <RefreshCw />
  </Action>
  <Action tooltip="Share" label="Share">
    <Share />
  </Action>
</Actions>`,
      preview: (
        <Actions>
          <Action tooltip="Copy" label="Copy">
            <Copy />
          </Action>
          <Action tooltip="Retry" label="Retry">
            <RefreshCw />
          </Action>
          <Action tooltip="Share" label="Share">
            <Share />
          </Action>
        </Actions>
      ),
    },
  ],
  artifact: [
    {
      id: "default",
      title: "Generated artifact",
      description: "A framed canvas for a file the model produced.",
      code: `<Artifact className="w-full max-w-lg">
  <ArtifactHeader>
    <ArtifactTitle>landing.tsx</ArtifactTitle>
  </ArtifactHeader>
  <ArtifactContent>
    <pre className="font-mono text-xs text-fg-secondary">export function Hero() {"{"}
  return &lt;h1&gt;Intelligence at scale.&lt;/h1&gt;
{"}"}</pre>
  </ArtifactContent>
</Artifact>`,
      preview: (
        <Artifact className="w-full max-w-lg">
          <ArtifactHeader>
            <ArtifactTitle>landing.tsx</ArtifactTitle>
          </ArtifactHeader>
          <ArtifactContent>
            <pre className="font-mono text-xs text-fg-secondary">{`export function Hero() {
  return <h1>Intelligence at scale.</h1>
}`}</pre>
          </ArtifactContent>
        </Artifact>
      ),
    },
  ],
  branch: [
    {
      id: "default",
      title: "Alternative generations",
      description: "Step through sibling assistant replies without wrapping past the ends.",
      code: `<Branch>
  <BranchMessages>
    <p>First draft of the answer.</p>
    <p>A tighter rewrite of the same answer.</p>
  </BranchMessages>
  <BranchSelector from="assistant">
    <BranchPrevious />
    <BranchPage />
    <BranchNext />
  </BranchSelector>
</Branch>`,
      preview: (
        <Branch>
          <BranchMessages>
            <p>First draft of the answer.</p>
            <p>A tighter rewrite of the same answer.</p>
          </BranchMessages>
          <BranchSelector from="assistant">
            <BranchPrevious />
            <BranchPage />
            <BranchNext />
          </BranchSelector>
        </Branch>
      ),
    },
  ],
  "chain-of-thought": [
    {
      id: "default",
      title: "Reasoning trail",
      description: "A collapsible list of steps the model took.",
      code: `<ChainOfThought defaultOpen>
  <ChainOfThoughtHeader />
  <ChainOfThoughtContent>
    <ChainOfThoughtStep label="Parse the question" />
    <ChainOfThoughtStep label="Retrieve the docs" />
    <ChainOfThoughtStep label="Draft the answer" />
  </ChainOfThoughtContent>
</ChainOfThought>`,
      preview: (
        <ChainOfThought defaultOpen>
          <ChainOfThoughtHeader />
          <ChainOfThoughtContent>
            <ChainOfThoughtStep label="Parse the question" />
            <ChainOfThoughtStep label="Retrieve the docs" />
            <ChainOfThoughtStep label="Draft the answer" />
          </ChainOfThoughtContent>
        </ChainOfThought>
      ),
    },
  ],
  "ai-code-block": [
    {
      id: "default",
      title: "Tool output",
      description: "Compound code surface with a copy control. No extra highlighter dependency.",
      code: `<AiCodeBlock
  defaultValue="main.ts"
  data={[{ filename: "main.ts", language: "ts", code: "export const n = 1\\n" }]}
>
  <AiCodeBlockHeader>
    <span className="font-mono text-xs">main.ts</span>
    <AiCodeBlockCopyButton />
  </AiCodeBlockHeader>
  <AiCodeBlockBody>
    {(item) => (
      <AiCodeBlockItem key={item.filename} value={item.filename}>
        <AiCodeBlockContent language={item.language}>{item.code}</AiCodeBlockContent>
      </AiCodeBlockItem>
    )}
  </AiCodeBlockBody>
</AiCodeBlock>`,
      preview: (
        <AiCodeBlock
          className="w-full max-w-lg"
          defaultValue="main.ts"
          data={[{ filename: "main.ts", language: "ts", code: "export const n = 1\n" }]}
        >
          <AiCodeBlockHeader>
            <span className="font-mono text-xs">main.ts</span>
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
      ),
    },
  ],
  context: [
    {
      id: "default",
      title: "Token usage",
      description: "Hover the trigger to read input, output, reasoning, and cache spend.",
      code: `<Context
  usedTokens={18432}
  maxTokens={128000}
  usage={{ inputTokens: 12000, outputTokens: 4432, reasoningTokens: 800, cachedInputTokens: 2048 }}
>
  <ContextTrigger />
  <ContextContent>
    <ContextContentHeader />
    <ContextContentBody>
      <ContextInputUsage />
      <ContextOutputUsage />
      <ContextReasoningUsage />
      <ContextCacheUsage />
    </ContextContentBody>
    <ContextContentFooter />
  </ContextContent>
</Context>`,
      preview: (
        <Context
          usedTokens={18432}
          maxTokens={128000}
          usage={{
            inputTokens: 12000,
            outputTokens: 4432,
            reasoningTokens: 800,
            cachedInputTokens: 2048,
          }}
        >
          <ContextTrigger />
          <ContextContent>
            <ContextContentHeader />
            <ContextContentBody>
              <ContextInputUsage />
              <ContextOutputUsage />
              <ContextReasoningUsage />
              <ContextCacheUsage />
            </ContextContentBody>
            <ContextContentFooter />
          </ContextContent>
        </Context>
      ),
    },
  ],
  conversation: [
    {
      id: "empty",
      title: "Empty state",
      description: "The log before the first turn. Jump-to-latest appears once you leave the edge.",
      code: `<Conversation className="h-64 rounded-xl border border-border">
  <ConversationContent>
    <ConversationEmptyState />
  </ConversationContent>
</Conversation>`,
      preview: (
        <Conversation className="h-64 w-full max-w-lg rounded-xl border border-border">
          <ConversationContent>
            <ConversationEmptyState />
          </ConversationContent>
        </Conversation>
      ),
    },
  ],
  "ai-image": [
    {
      id: "default",
      title: "Generated image",
      description:
        "Renders a model image from a data URL. Alt is required for the accessible name.",
      code: `<GeneratedImage
  alt="A 1×1 placeholder the model returned"
  base64="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  mediaType="image/png"
  className="size-24"
/>`,
      preview: (
        <GeneratedImage
          alt="A 1×1 placeholder the model returned"
          base64={PIXEL}
          mediaType="image/png"
          className="size-24 image-rendering-pixelated"
        />
      ),
    },
  ],
  "inline-citation": [
    {
      id: "default",
      title: "Cited claim",
      description: "A hover card of sources attached to a sentence.",
      code: `<p className="text-sm text-fg">
  Cronus is a product UI system
  <InlineCitation>
    <InlineCitationText>*</InlineCitationText>
    <InlineCitationCard>
      <InlineCitationCardTrigger sources={["https://aicronus.com"]} />
      <InlineCitationCardBody>
        <InlineCitationSource title="Cronus UI" url="https://aicronus.com" />
      </InlineCitationCardBody>
    </InlineCitationCard>
  </InlineCitation>
  .
</p>`,
      preview: (
        <p className="text-sm text-fg">
          Cronus is a product UI system
          <InlineCitation>
            <InlineCitationText>*</InlineCitationText>
            <InlineCitationCard>
              <InlineCitationCardTrigger sources={["https://aicronus.com"]} />
              <InlineCitationCardBody>
                <InlineCitationSource title="Cronus UI" url="https://aicronus.com" />
              </InlineCitationCardBody>
            </InlineCitationCard>
          </InlineCitation>
          .
        </p>
      ),
    },
  ],
  loader: [
    {
      id: "default",
      title: "Generating",
      description: "A spinning glyph. Localise the accessible name with `labels.loading`.",
      code: `<Loader />`,
      preview: <Loader />,
    },
  ],
  message: [
    {
      id: "pair",
      title: "User and assistant",
      description: "User bubbles sit on the end edge; assistant content spans the full width.",
      code: `<>
  <Message from="user">
    <MessageContent>How do I theme a surface?</MessageContent>
  </Message>
  <Message from="assistant">
    <MessageAvatar src="https://github.com/pedrogbraz.png" name="Cronus" />
    <MessageContent>Use semantic tokens. Never a palette scale.</MessageContent>
  </Message>
</>`,
      preview: (
        <div className="flex w-full max-w-lg flex-col gap-4">
          <Message from="user">
            <MessageContent>How do I theme a surface?</MessageContent>
          </Message>
          <Message from="assistant">
            <MessageAvatar src="https://github.com/pedrogbraz.png" name="Cronus" />
            <MessageContent>Use semantic tokens. Never a palette scale.</MessageContent>
          </Message>
        </div>
      ),
    },
  ],
  "open-in-chat": [
    {
      id: "default",
      title: "Open elsewhere",
      description: "Hand a prompt to ChatGPT, Claude, or Cursor.",
      code: `<OpenIn query="Explain Cronus tokens">
  <OpenInTrigger />
  <OpenInContent>
    <OpenInLabel>Open in</OpenInLabel>
    <OpenInSeparator />
    <OpenInChatGPT />
    <OpenInClaude />
    <OpenInCursor />
  </OpenInContent>
</OpenIn>`,
      preview: (
        <OpenIn query="Explain Cronus tokens">
          <OpenInTrigger />
          <OpenInContent>
            <OpenInLabel>Open in</OpenInLabel>
            <OpenInSeparator />
            <OpenInChatGPT />
            <OpenInClaude />
            <OpenInCursor />
          </OpenInContent>
        </OpenIn>
      ),
    },
  ],
  plan: [
    {
      id: "default",
      title: "Plan card",
      description: "A collapsible plan the model can stream into.",
      code: `<Plan defaultOpen>
  <PlanHeader>
    <PlanTitle>Ship the chat surface</PlanTitle>
    <PlanTrigger />
  </PlanHeader>
  <PlanContent>
    <p className="text-sm text-fg-secondary">Wire Conversation, Message, and PromptInput.</p>
  </PlanContent>
</Plan>`,
      preview: (
        <Plan defaultOpen className="w-full max-w-lg">
          <PlanHeader>
            <PlanTitle>Ship the chat surface</PlanTitle>
            <PlanTrigger />
          </PlanHeader>
          <PlanContent>
            <p className="text-sm text-fg-secondary">
              Wire Conversation, Message, and PromptInput.
            </p>
          </PlanContent>
        </Plan>
      ),
    },
  ],
  "prompt-input": [
    {
      id: "default",
      title: "Composer",
      description: "Enter submits. Shift+Enter inserts a newline. Status flips submit to stop.",
      code: `<PromptInput onSubmit={(message) => console.log(message)}>
  <PromptInputBody>
    <PromptInputTextarea placeholder="Ask anything…" />
  </PromptInputBody>
  <PromptInputFooter>
    <PromptInputTools />
    <PromptInputSubmit />
  </PromptInputFooter>
</PromptInput>`,
      preview: (
        <PromptInput
          className="w-full max-w-lg"
          onSubmit={(message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            void message.text;
          }}
        >
          <PromptInputBody>
            <PromptInputTextarea placeholder="Ask anything…" />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit />
          </PromptInputFooter>
        </PromptInput>
      ),
    },
  ],
  queue: [
    {
      id: "default",
      title: "Pending work",
      description: "A list of items waiting to run.",
      code: `<Queue>
  <QueueList>
    <QueueItem>
      <QueueItemIndicator />
      <QueueItemContent>Summarise the last three PRs</QueueItemContent>
    </QueueItem>
    <QueueItem>
      <QueueItemIndicator />
      <QueueItemContent>Draft the changelog</QueueItemContent>
    </QueueItem>
  </QueueList>
</Queue>`,
      preview: (
        <Queue className="w-full max-w-lg">
          <QueueList>
            <QueueItem>
              <QueueItemIndicator />
              <QueueItemContent>Summarise the last three PRs</QueueItemContent>
            </QueueItem>
            <QueueItem>
              <QueueItemIndicator />
              <QueueItemContent>Draft the changelog</QueueItemContent>
            </QueueItem>
          </QueueList>
        </Queue>
      ),
    },
  ],
  reasoning: [
    {
      id: "default",
      title: "Thinking",
      description: "Opens while streaming, then can collapse once the thought is done.",
      code: `<Reasoning defaultOpen duration={4}>
  <ReasoningTrigger />
  <ReasoningContent>
    The user wants a product UI system, not a bag of parts.
  </ReasoningContent>
</Reasoning>`,
      preview: (
        <Reasoning defaultOpen duration={4} className="w-full max-w-lg">
          <ReasoningTrigger />
          <ReasoningContent>
            {"The user wants a product UI system, not a bag of parts."}
          </ReasoningContent>
        </Reasoning>
      ),
    },
  ],
  response: [
    {
      id: "default",
      title: "Assistant text",
      description: "A streaming-friendly host. Pass children as they arrive.",
      code: `<Response>
  Cronus tokens re-theme live. Compose the app; do not fork the kit.
</Response>`,
      preview: (
        <Response>Cronus tokens re-theme live. Compose the app; do not fork the kit.</Response>
      ),
    },
  ],
  sources: [
    {
      id: "default",
      title: "Used sources",
      description: "An expandable list of links the model cited.",
      code: `<Sources>
  <SourcesTrigger count={2} />
  <SourcesContent>
    <Source href="https://aicronus.com" title="Cronus UI" />
    <Source href="https://aicronus.com/docs/design" title="Design" />
  </SourcesContent>
</Sources>`,
      preview: (
        <Sources>
          <SourcesTrigger count={2} />
          <SourcesContent>
            <Source href="https://aicronus.com" title="Cronus UI" />
            <Source href="https://aicronus.com/docs/design" title="Design" />
          </SourcesContent>
        </Sources>
      ),
    },
  ],
  suggestion: [
    {
      id: "default",
      title: "Prompt chips",
      description: "A horizontal row. `onClick` receives the suggestion string.",
      code: `<Suggestions>
  <Suggestion suggestion="Explain tokens" />
  <Suggestion suggestion="Show a login" />
  <Suggestion suggestion="Compose a SaaS" />
</Suggestions>`,
      preview: (
        <Suggestions>
          <Suggestion suggestion="Explain tokens" />
          <Suggestion suggestion="Show a login" />
          <Suggestion suggestion="Compose a SaaS" />
        </Suggestions>
      ),
    },
  ],
  task: [
    {
      id: "default",
      title: "Agent checklist",
      description: "A collapsible list of work the agent is doing.",
      code: `<Task defaultOpen>
  <TaskTrigger title="Preparing the PR" />
  <TaskContent>
    <TaskItem>Read the contract</TaskItem>
    <TaskItem>Port the component</TaskItem>
    <TaskItem>Verify in the browser</TaskItem>
  </TaskContent>
</Task>`,
      preview: (
        <Task defaultOpen className="w-full max-w-lg">
          <TaskTrigger title="Preparing the PR" />
          <TaskContent>
            <TaskItem>Read the contract</TaskItem>
            <TaskItem>Port the component</TaskItem>
            <TaskItem>Verify in the browser</TaskItem>
          </TaskContent>
        </Task>
      ),
    },
  ],
  "text-shimmer": [
    {
      id: "default",
      title: "Thinking placeholder",
      description: "A sliding highlight across placeholder copy while tokens start.",
      code: `<TextShimmer>Thinking…</TextShimmer>`,
      preview: <TextShimmer>Thinking…</TextShimmer>,
    },
  ],
  tool: [
    {
      id: "default",
      title: "Completed tool",
      description: "Input and output for a finished tool call.",
      code: `<Tool defaultOpen>
  <ToolHeader type="tool-search" state="output-available" title="search" />
  <ToolContent>
    <ToolInput input={{ query: "Cronus tokens" }} />
    <ToolOutput output="Semantic tokens live in @cronus-ui/tokens." />
  </ToolContent>
</Tool>`,
      preview: (
        <Tool defaultOpen className="w-full max-w-lg">
          <ToolHeader type="tool-search" state="output-available" title="search" />
          <ToolContent>
            <ToolInput input={{ query: "Cronus tokens" }} />
            <ToolOutput output="Semantic tokens live in @cronus-ui/tokens." />
          </ToolContent>
        </Tool>
      ),
    },
  ],
  "web-preview": [
    {
      id: "default",
      title: "Sandboxed preview",
      description: "URL chrome around an iframe. The body stays empty until you set a src.",
      code: `<WebPreview defaultUrl="https://aicronus.com">
  <WebPreviewNavigation>
    <WebPreviewUrl />
  </WebPreviewNavigation>
  <WebPreviewBody className="h-56" />
</WebPreview>`,
      preview: (
        <WebPreview defaultUrl="https://aicronus.com" className="w-full max-w-lg">
          <WebPreviewNavigation>
            <WebPreviewUrl />
          </WebPreviewNavigation>
          <WebPreviewBody className="h-56" />
        </WebPreview>
      ),
    },
  ],
};

export default function AiElementsExamples({ slug }: { slug: string }) {
  return <ExampleList examples={aiElementsExamples[slug] ?? []} />;
}

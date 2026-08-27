"use client";

import {
  AspectRatio,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  type AvatarGroupAvatar,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CodeBlock,
  CodeTabs,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ComparisonSlider,
  DataTable,
  DataTableColumnHeader,
  type DataTableFacetedFilter,
  DescriptionDetails,
  DescriptionItem,
  DescriptionList,
  DescriptionTerm,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Heatmap,
  type HeatmapDay,
  ImageZoom,
  JsonViewer,
  Kanban,
  type KanbanColumn,
  Kbd,
  Masonry,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
  ScrollArea,
  ScrollBar,
  Separator,
  Skeleton,
  Sparkline,
  StatusDot,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
  type TreeNode,
  TreeView,
  VideoPlayer,
} from "@cronus-ui/ui";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  CircleDashed,
  CircleSlash,
  CreditCard,
  FileText,
  Folder,
  Inbox,
  Mail,
  Package,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

// ── AvatarGroup demo data ─────────────────────────────────────────────
const reviewers: AvatarGroupAvatar[] = [
  { src: "https://github.com/shadcn.png", alt: "@shadcn", fallback: "CN" },
  { fallback: "AL" },
  { fallback: "JL" },
  { fallback: "MK" },
  { fallback: "RW" },
];

// ── DataTable demo data ───────────────────────────────────────────────
type Payment = {
  id: string;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  amount: number;
};

const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span className="capitalize">{row.getValue("status")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="lowercase">{row.getValue("email")}</span>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowUpDown aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(String(row.getValue("amount")));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <span className="font-mono tabular-nums">{formatted}</span>;
    },
  },
];

const paymentData: Payment[] = [
  { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@example.com" },
  { id: "3u1reuv4", amount: 242, status: "success", email: "abe45@example.com" },
  { id: "derv1ws0", amount: 837, status: "processing", email: "monserrat44@example.com" },
  { id: "5kma53ae", amount: 874, status: "success", email: "silas22@example.com" },
  { id: "bhqecj4p", amount: 721, status: "failed", email: "carmella@example.com" },
  { id: "p0r9twq2", amount: 459, status: "pending", email: "jason.lee@example.com" },
];

// ── DataTable Pro demo data — a "team members" directory ──────────────
type Member = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member" | "Viewer";
  status: "active" | "invited" | "suspended";
  seats: number;
};

const memberData: Member[] = [
  {
    id: "u-1024",
    name: "Ada Lovelace",
    email: "ada@cronus.dev",
    role: "Owner",
    status: "active",
    seats: 5,
  },
  {
    id: "u-1025",
    name: "Grace Hopper",
    email: "grace@cronus.dev",
    role: "Admin",
    status: "active",
    seats: 3,
  },
  {
    id: "u-1026",
    name: "Alan Turing",
    email: "alan@cronus.dev",
    role: "Member",
    status: "active",
    seats: 1,
  },
  {
    id: "u-1027",
    name: "Katherine Johnson",
    email: "katherine@cronus.dev",
    role: "Member",
    status: "invited",
    seats: 1,
  },
  {
    id: "u-1028",
    name: "Margaret Hamilton",
    email: "margaret@cronus.dev",
    role: "Admin",
    status: "active",
    seats: 2,
  },
  {
    id: "u-1029",
    name: "Dennis Ritchie",
    email: "dennis@cronus.dev",
    role: "Viewer",
    status: "suspended",
    seats: 0,
  },
  {
    id: "u-1030",
    name: "Barbara Liskov",
    email: "barbara@cronus.dev",
    role: "Member",
    status: "active",
    seats: 1,
  },
  {
    id: "u-1031",
    name: "Donald Knuth",
    email: "donald@cronus.dev",
    role: "Member",
    status: "invited",
    seats: 1,
  },
  {
    id: "u-1032",
    name: "Edsger Dijkstra",
    email: "edsger@cronus.dev",
    role: "Viewer",
    status: "active",
    seats: 1,
  },
  {
    id: "u-1033",
    name: "Linus Torvalds",
    email: "linus@cronus.dev",
    role: "Admin",
    status: "active",
    seats: 4,
  },
  {
    id: "u-1034",
    name: "Tim Berners-Lee",
    email: "tim@cronus.dev",
    role: "Member",
    status: "suspended",
    seats: 0,
  },
  {
    id: "u-1035",
    name: "Radia Perlman",
    email: "radia@cronus.dev",
    role: "Member",
    status: "active",
    seats: 2,
  },
];

const STATUS_VARIANT: Record<Member["status"], "success" | "warning" | "error"> = {
  active: "success",
  invited: "warning",
  suspended: "error",
};

const memberColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="font-medium text-fg">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <span className="text-fg-secondary">{row.getValue("email")}</span>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue("role")}</Badge>,
  },
  {
    accessorKey: "status",
    // Multi-select faceted filtering: the toolbar writes an array of selected
    // values, so the column must use a set-membership filterFn. With 2+ values
    // selected (e.g. Active + Invited) `arrIncludesSome` keeps any matching row;
    // the default `auto`/`includesString` would coerce the array to a string and
    // drop every row. `DataTable` also auto-applies this for faceted columns, so
    // this is belt-and-suspenders for anyone copying the column defs verbatim.
    filterFn: "arrIncludesSome",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue<Member["status"]>("status");
      return (
        <Badge variant={STATUS_VARIANT[status]} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "seats",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Seats" />,
    cell: ({ row }) => (
      <span className="font-mono tabular-nums text-fg-secondary">{row.getValue("seats")}</span>
    ),
  },
];

const memberStatusFilter: DataTableFacetedFilter = {
  columnId: "status",
  title: "Status",
  options: [
    { label: "Active", value: "active", icon: Check },
    { label: "Invited", value: "invited", icon: CircleDashed },
    { label: "Suspended", value: "suspended", icon: CircleSlash },
  ],
};

/** Loading demo: toggles a fake fetch so the skeleton → data swap is visible. */
function DataTableLoadingDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => setLoading((l) => !l)}
      >
        {loading ? "Show data" : "Show loading"}
      </Button>
      <DataTable
        columns={memberColumns}
        data={memberData.slice(0, 4)}
        loading={loading}
        loadingRowCount={4}
      />
    </div>
  );
}

/** Error demo: a retry button clears the error and reveals the rows. */
function DataTableErrorDemo() {
  const [failed, setFailed] = useState(true);
  return (
    <DataTable
      columns={memberColumns}
      data={failed ? [] : memberData.slice(0, 4)}
      error={
        failed ? "Couldn’t load team members. Check your connection and try again." : undefined
      }
      onRetry={() => setFailed(false)}
    />
  );
}

// ── Collapsible ────────────────────────────────────────────────────
function CollapsibleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-2">
        <span className="font-medium text-fg text-sm">Deployment regions</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Toggle regions">
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {["us-east-1", "eu-west-1", "ap-southeast-2"].map((region) => (
          <div key={region} className="rounded-lg border border-border px-4 py-2 font-mono text-sm">
            {region}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

const collapsibleDemoCode = `function CollapsibleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-2">
        <span className="text-sm font-medium text-fg">Deployment regions</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Toggle regions">
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {["us-east-1", "eu-west-1", "ap-southeast-2"].map((region) => (
          <div key={region} className="rounded-lg border border-border px-4 py-2 font-mono text-sm">
            {region}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}`;

const FILE_TREE: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: <Folder aria-hidden="true" />,
    children: [
      {
        id: "components",
        label: "components",
        icon: <Folder aria-hidden="true" />,
        children: [
          { id: "button.tsx", label: "button.tsx", icon: <FileText aria-hidden="true" /> },
          { id: "card.tsx", label: "card.tsx", icon: <FileText aria-hidden="true" /> },
        ],
      },
      {
        id: "lib",
        label: "lib",
        icon: <Folder aria-hidden="true" />,
        children: [{ id: "cn.ts", label: "cn.ts", icon: <FileText aria-hidden="true" /> }],
      },
      { id: "index.ts", label: "index.ts", icon: <FileText aria-hidden="true" /> },
    ],
  },
  { id: "package.json", label: "package.json", icon: <FileText aria-hidden="true" /> },
  { id: "readme", label: "README.md", icon: <FileText aria-hidden="true" /> },
];

function FileTreeDemo() {
  return (
    <TreeView
      data={FILE_TREE}
      defaultExpandedIds={["src", "components"]}
      defaultValue="button.tsx"
      aria-label="Project files"
      className="max-w-xs rounded-lg border border-border p-1.5"
    />
  );
}

// ── Kanban ─────────────────────────────────────────────────────────
const INITIAL_BOARD: KanbanColumn[] = [
  {
    id: "todo",
    title: "To do",
    items: [
      { id: "t-1", title: "Draft the launch post", description: "Outline the key talking points." },
      { id: "t-2", title: "Audit onboarding copy" },
      {
        id: "t-3",
        title: "Collect customer quotes",
        description: "Reach out to 3 design partners.",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In progress",
    items: [
      {
        id: "p-1",
        title: "Wire up the billing page",
        description: "Hook the plan picker to checkout.",
      },
      { id: "p-2", title: "Polish empty states" },
    ],
  },
  {
    id: "done",
    title: "Done",
    items: [{ id: "d-1", title: "Ship the new docs theme", description: "Dark mode shipped." }],
  },
];

function KanbanDemo() {
  const [columns, setColumns] = useState<KanbanColumn[]>(INITIAL_BOARD);
  return <Kanban columns={columns} onColumnsChange={setColumns} aria-label="Project board" />;
}

const kanbanDemoCode = `const INITIAL_BOARD: KanbanColumn[] = [
  {
    id: "todo",
    title: "To do",
    items: [
      { id: "t-1", title: "Draft the launch post", description: "Outline the key talking points." },
      { id: "t-2", title: "Audit onboarding copy" },
      {
        id: "t-3",
        title: "Collect customer quotes",
        description: "Reach out to 3 design partners.",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In progress",
    items: [
      {
        id: "p-1",
        title: "Wire up the billing page",
        description: "Hook the plan picker to checkout.",
      },
      { id: "p-2", title: "Polish empty states" },
    ],
  },
  {
    id: "done",
    title: "Done",
    items: [{ id: "d-1", title: "Ship the new docs theme", description: "Dark mode shipped." }],
  },
];

function KanbanDemo() {
  const [columns, setColumns] = useState<KanbanColumn[]>(INITIAL_BOARD);
  return <Kanban columns={columns} onColumnsChange={setColumns} aria-label="Project board" />;
}`;

// ── Masonry ────────────────────────────────────────────────────────
const MASONRY_CARDS: { id: string; title: string; body: string; lines: number }[] = [
  { id: "m-1", title: "Onboarding", body: "Passwordless email code, ready in seconds.", lines: 2 },
  {
    id: "m-2",
    title: "Checkout",
    body: "Card and boleto with a builder-driven layout, custom tracking scripts, and upsells that convert.",
    lines: 4,
  },
  { id: "m-3", title: "Payouts", body: "Settled on a fixed schedule.", lines: 1 },
  {
    id: "m-4",
    title: "Analytics",
    body: "Live revenue, conversion and refund metrics rolled up per product and per day.",
    lines: 3,
  },
  { id: "m-5", title: "Members", body: "Grant and revoke course access automatically.", lines: 2 },
  {
    id: "m-6",
    title: "Notifications",
    body: "Push and email on every sale.",
    lines: 1,
  },
];

function MasonryDemo() {
  return (
    <Masonry columns={{ base: 1, sm: 2, lg: 3 }} gap="1rem" className="w-full">
      {MASONRY_CARDS.map((card) => (
        <Card key={card.id}>
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.from({ length: card.lines }).map((_, line) => (
              <p
                // biome-ignore lint/suspicious/noArrayIndexKey: static, never-reordered filler lines
                key={line}
                className="text-sm text-fg-secondary"
              >
                {card.body}
              </p>
            ))}
          </CardContent>
        </Card>
      ))}
    </Masonry>
  );
}

const masonryDemoCode = `const cards = [
  { id: "m-1", title: "Onboarding", body: "Passwordless email code." },
  { id: "m-2", title: "Checkout", body: "Card and boleto with upsells that convert." },
  { id: "m-3", title: "Payouts", body: "Settled on a fixed schedule." },
  { id: "m-4", title: "Analytics", body: "Live revenue and conversion metrics." },
  { id: "m-5", title: "Members", body: "Grant and revoke access automatically." },
  { id: "m-6", title: "Notifications", body: "Push and email on every sale." },
];

return (
  <Masonry columns={{ base: 1, sm: 2, lg: 3 }} gap="1rem">
    {cards.map((card) => (
      <Card key={card.id}>
        <CardHeader>
          <CardTitle>{card.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-fg-secondary">{card.body}</p>
        </CardContent>
      </Card>
    ))}
  </Masonry>
);`;

// 17 weeks × 7 days ≈ 119 deterministic days. A cheap LCG keeps the values
// varied (so every level shows) without pulling randomness into the render.
function buildHeatmapData(days = 119): HeatmapDay[] {
  const start = new Date(Date.UTC(2026, 2, 1));
  let seed = 1337;
  const next = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    const roll = next();
    // ~25% empty days, the rest spread across 1–12 contributions.
    const value = roll < 0.25 ? 0 : Math.round(next() * 11) + 1;
    return { date: date.toISOString().slice(0, 10), value };
  });
}

const HEATMAP_DATA = buildHeatmapData();

function HeatmapDemo() {
  return <Heatmap data={HEATMAP_DATA} aria-label="Contributions" />;
}

const heatmapDemoCode = `// 17 weeks of daily activity, laid out into week columns of 7.
const data = Array.from({ length: 119 }, (_, i) => {
  const date = new Date(2026, 2, 1 + i);
  return {
    date: date.toISOString().slice(0, 10),
    value: Math.round(Math.random() * 12),
  };
});

return <Heatmap data={data} aria-label="Contributions" />;`;

const jsonViewerOrder = {
  order: {
    id: "ord_8kX2",
    total: 248.9,
    currency: "BRL",
    paid: true,
    coupon: null,
    items: [
      { sku: "tee-black-m", qty: 2 },
      { sku: "sticker-pack", qty: 1 },
    ],
  },
};

// ── StatusDot ──────────────────────────────────────────────────────
function StatusDotAvatarDemo() {
  return (
    <div className="flex items-center gap-6">
      <span className="relative inline-flex">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <StatusDot status="online" position="bottom-right" ring aria-label="@shadcn is online" />
      </span>
      <span className="relative inline-flex">
        <Avatar>
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <StatusDot status="busy" position="bottom-right" ring aria-label="Ada is busy" />
      </span>
      <span className="relative inline-flex">
        <Avatar>
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <StatusDot status="offline" position="bottom-right" ring aria-label="Jean is offline" />
      </span>
    </div>
  );
}

const statusDotAvatarDemoCode = `function StatusDotAvatarDemo() {
  return (
    <div className="flex items-center gap-6">
      <span className="relative inline-flex">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <StatusDot status="online" position="bottom-right" ring aria-label="@shadcn is online" />
      </span>
      <span className="relative inline-flex">
        <Avatar>
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <StatusDot status="busy" position="bottom-right" ring aria-label="Ada is busy" />
      </span>
      <span className="relative inline-flex">
        <Avatar>
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <StatusDot status="offline" position="bottom-right" ring aria-label="Jean is offline" />
      </span>
    </div>
  );
}`;

// ── ImageZoom ──────────────────────────────────────────────────────
function ImageZoomStateDemo() {
  const [zoomed, setZoomed] = useState(false);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <ImageZoom zoom={3} onZoomChange={setZoomed} labels={{ zoom: "Zoom fabric detail" }}>
        {/* biome-ignore lint/performance/noImgElement: docs example renders an external picsum image directly */}
        <img src="https://picsum.photos/seed/cronus-fabric/1200/675" alt="" />
      </ImageZoom>
      <Badge variant={zoomed ? "primary" : "secondary"}>
        {zoomed ? "Zoomed 3×" : "Hover, tap or press Enter to zoom"}
      </Badge>
    </div>
  );
}

const imageZoomStateDemoCode = `function ImageZoomStateDemo() {
  const [zoomed, setZoomed] = useState(false);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <ImageZoom zoom={3} onZoomChange={setZoomed} labels={{ zoom: "Zoom fabric detail" }}>
        <img src="https://picsum.photos/seed/cronus-fabric/1200/675" alt="" />
      </ImageZoom>
      <Badge variant={zoomed ? "primary" : "secondary"}>
        {zoomed ? "Zoomed 3×" : "Hover, tap or press Enter to zoom"}
      </Badge>
    </div>
  );
}`;

// ── VideoPlayer demo data ─────────────────────────────────────────────
const VIDEO_PLAYER_SRC = "https://media.w3.org/2010/05/sintel/trailer.mp4";
const VIDEO_PLAYER_POSTER = "https://media.w3.org/2010/05/sintel/poster.png";
// Inline WebVTT stub so the demo ships a captions track without a static asset.
const VIDEO_PLAYER_CAPTIONS =
  "data:text/vtt,WEBVTT%0A%0A00:00.000%20--%3E%2000:04.000%0AWind%20howls%20across%20a%20snowy%20mountain%20pass.";

function VideoPlayerDemo() {
  return (
    <VideoPlayer src={VIDEO_PLAYER_SRC} poster={VIDEO_PLAYER_POSTER}>
      <track kind="captions" src={VIDEO_PLAYER_CAPTIONS} srcLang="en" label="English" default />
    </VideoPlayer>
  );
}

const videoPlayerDemoCode = `<VideoPlayer
  src="https://media.w3.org/2010/05/sintel/trailer.mp4"
  poster="https://media.w3.org/2010/05/sintel/poster.png"
>
  <track
    kind="captions"
    src="data:text/vtt,WEBVTT%0A%0A00:00.000%20--%3E%2000:04.000%0AWind%20howls%20across%20a%20snowy%20mountain%20pass."
    srcLang="en"
    label="English"
    default
  />
</VideoPlayer>`;

function VideoPlayerAspectDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <VideoPlayer src={VIDEO_PLAYER_SRC} poster={VIDEO_PLAYER_POSTER} aspect="wide" />
      <VideoPlayer
        src={VIDEO_PLAYER_SRC}
        poster={VIDEO_PLAYER_POSTER}
        aspect="square"
        className="mx-auto max-w-xs"
      />
    </div>
  );
}

const videoPlayerAspectDemoCode = `<div className="flex w-full flex-col gap-4">
  <VideoPlayer
    src="https://media.w3.org/2010/05/sintel/trailer.mp4"
    poster="https://media.w3.org/2010/05/sintel/poster.png"
    aspect="wide"
  />
  <VideoPlayer
    src="https://media.w3.org/2010/05/sintel/trailer.mp4"
    poster="https://media.w3.org/2010/05/sintel/poster.png"
    aspect="square"
    className="mx-auto max-w-xs"
  />
</div>`;

function VideoPlayerLocalizedDemo() {
  return (
    <VideoPlayer
      src={VIDEO_PLAYER_SRC}
      poster={VIDEO_PLAYER_POSTER}
      muted
      loop
      labels={{
        play: "Reproduzir",
        pause: "Pausar",
        mute: "Silenciar",
        unmute: "Ativar som",
        seek: "Avançar",
        volume: "Volume",
        settings: "Velocidade",
        fullscreen: "Tela cheia",
      }}
    />
  );
}

const videoPlayerLocalizedDemoCode = `<VideoPlayer
  src="https://media.w3.org/2010/05/sintel/trailer.mp4"
  poster="https://media.w3.org/2010/05/sintel/poster.png"
  muted
  loop
  labels={{
    play: "Reproduzir",
    pause: "Pausar",
    mute: "Silenciar",
    unmute: "Ativar som",
    seek: "Avançar",
    volume: "Volume",
    settings: "Velocidade",
    fullscreen: "Tela cheia",
  }}
/>`;

// ── DescriptionList demos ─────────────────────────────────────────────
function DescriptionListDemo() {
  return (
    <DescriptionList className="max-w-sm">
      <DescriptionTerm>Full name</DescriptionTerm>
      <DescriptionDetails>Margot Foster</DescriptionDetails>
      <DescriptionTerm>Email</DescriptionTerm>
      <DescriptionDetails>margot@example.com</DescriptionDetails>
      <DescriptionTerm>Plan</DescriptionTerm>
      <DescriptionDetails>Pro — billed yearly</DescriptionDetails>
    </DescriptionList>
  );
}

const descriptionListDemoCode = `<DescriptionList className="max-w-sm">
  <DescriptionTerm>Full name</DescriptionTerm>
  <DescriptionDetails>Margot Foster</DescriptionDetails>
  <DescriptionTerm>Email</DescriptionTerm>
  <DescriptionDetails>margot@example.com</DescriptionDetails>
  <DescriptionTerm>Plan</DescriptionTerm>
  <DescriptionDetails>Pro — billed yearly</DescriptionDetails>
</DescriptionList>`;

function DescriptionListHorizontalDemo() {
  return (
    <DescriptionList layout="horizontal" detailsAlign="end" bordered className="max-w-md">
      <DescriptionItem term="Order">#10245</DescriptionItem>
      <DescriptionItem term="Date">June 23, 2026</DescriptionItem>
      <DescriptionItem term="Payment method">Visa ending in 4242</DescriptionItem>
      <DescriptionItem term="Status">
        <Badge variant="success">Paid</Badge>
      </DescriptionItem>
      <DescriptionItem term="Total">
        <span className="font-mono font-medium tabular-nums">$149.00</span>
      </DescriptionItem>
    </DescriptionList>
  );
}

const descriptionListHorizontalDemoCode = `<DescriptionList layout="horizontal" detailsAlign="end" bordered className="max-w-md">
  <DescriptionItem term="Order">#10245</DescriptionItem>
  <DescriptionItem term="Date">June 23, 2026</DescriptionItem>
  <DescriptionItem term="Payment method">Visa ending in 4242</DescriptionItem>
  <DescriptionItem term="Status">
    <Badge variant="success">Paid</Badge>
  </DescriptionItem>
  <DescriptionItem term="Total">
    <span className="font-mono font-medium tabular-nums">$149.00</span>
  </DescriptionItem>
</DescriptionList>`;

function DescriptionListStripedDemo() {
  return (
    <DescriptionList layout="horizontal" striped className="max-w-md">
      <DescriptionItem term="Environment">Production</DescriptionItem>
      <DescriptionItem term="API version">2026-06-01</DescriptionItem>
      <DescriptionItem term="Webhook endpoint">https://api.example.com/hooks</DescriptionItem>
      <DescriptionItem term="Signing secret">whsec_••••••••</DescriptionItem>
      <DescriptionItem term="Mode">
        <Badge variant="secondary">Live</Badge>
      </DescriptionItem>
    </DescriptionList>
  );
}

const descriptionListStripedDemoCode = `<DescriptionList layout="horizontal" striped className="max-w-md">
  <DescriptionItem term="Environment">Production</DescriptionItem>
  <DescriptionItem term="API version">2026-06-01</DescriptionItem>
  <DescriptionItem term="Webhook endpoint">https://api.example.com/hooks</DescriptionItem>
  <DescriptionItem term="Signing secret">whsec_••••••••</DescriptionItem>
  <DescriptionItem term="Mode">
    <Badge variant="secondary">Live</Badge>
  </DescriptionItem>
</DescriptionList>`;

function DescriptionListGridDemo() {
  return (
    <DescriptionList layout="grid" size="sm">
      <DescriptionItem term="Region">São Paulo (GRU)</DescriptionItem>
      <DescriptionItem term="Runtime">Node 22 LTS</DescriptionItem>
      <DescriptionItem term="Instances">3 × shared-cpu</DescriptionItem>
      <DescriptionItem term="Custom domain">store.cronus.dev</DescriptionItem>
      <DescriptionItem term="TLS">Auto-managed</DescriptionItem>
      <DescriptionItem term="Deploy hook">Enabled</DescriptionItem>
    </DescriptionList>
  );
}

const descriptionListGridDemoCode = `<DescriptionList layout="grid" size="sm">
  <DescriptionItem term="Region">São Paulo (GRU)</DescriptionItem>
  <DescriptionItem term="Runtime">Node 22 LTS</DescriptionItem>
  <DescriptionItem term="Instances">3 × shared-cpu</DescriptionItem>
  <DescriptionItem term="Custom domain">store.cronus.dev</DescriptionItem>
  <DescriptionItem term="TLS">Auto-managed</DescriptionItem>
  <DescriptionItem term="Deploy hook">Enabled</DescriptionItem>
</DescriptionList>`;

export const dataDisplayExamples: ExampleMap = {
  "status-dot": [
    {
      id: "statuses",
      title: "Statuses",
      description:
        "Presence dots across the semantic palette. `withLabel` renders the status text next to the dot; without it the label becomes the accessible name.",
      code: `<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
  <StatusDot status="online" withLabel />
  <StatusDot status="away" withLabel />
  <StatusDot status="busy" withLabel />
  <StatusDot status="offline" withLabel />
  <StatusDot status="info" withLabel label="Deploying" />
</div>`,
      preview: (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <StatusDot status="online" withLabel />
          <StatusDot status="away" withLabel />
          <StatusDot status="busy" withLabel />
          <StatusDot status="offline" withLabel />
          <StatusDot status="info" withLabel label="Deploying" />
        </div>
      ),
    },
    {
      id: "on-avatar",
      title: "On an avatar",
      description:
        "Anchor the dot to a corner with `position` and add `ring` so it cuts out of the image. Wrap the avatar and the dot in a `relative` container.",
      code: statusDotAvatarDemoCode,
      preview: <StatusDotAvatarDemo />,
    },
    {
      id: "pulse-sizes",
      title: "Pulse & sizes",
      description:
        "`pulse` adds an expanding ping halo for live activity — it stays static under `prefers-reduced-motion`. Sizes run `xs` through `lg`.",
      code: `<div className="flex flex-col items-center gap-5">
  <div className="flex items-center gap-6">
    <StatusDot status="error" pulse withLabel label="Live" />
    <StatusDot status="success" pulse withLabel label="Streaming" />
  </div>
  <div className="flex items-center gap-4">
    <StatusDot size="xs" aria-label="Online (xs)" />
    <StatusDot size="sm" aria-label="Online (sm)" />
    <StatusDot size="md" aria-label="Online (md)" />
    <StatusDot size="lg" aria-label="Online (lg)" />
  </div>
</div>`,
      preview: (
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-6">
            <StatusDot status="error" pulse withLabel label="Live" />
            <StatusDot status="success" pulse withLabel label="Streaming" />
          </div>
          <div className="flex items-center gap-4">
            <StatusDot size="xs" aria-label="Online (xs)" />
            <StatusDot size="sm" aria-label="Online (sm)" />
            <StatusDot size="md" aria-label="Online (md)" />
            <StatusDot size="lg" aria-label="Online (lg)" />
          </div>
        </div>
      ),
    },
  ],
  "image-zoom": [
    {
      id: "hover-to-zoom",
      title: "Hover to zoom",
      description:
        "Product-style inline zoom: a fine pointer magnifies on hover and the pan follows the cursor via transform-origin tracking; touch taps and Enter/Space toggle a sticky zoom instead. The zoom indicator fades away while zoomed.",
      code: `<ImageZoom
  src="https://picsum.photos/seed/cronus-product/900/600"
  alt="Studio product photo"
  className="max-w-md"
/>`,
      preview: (
        <ImageZoom
          src="https://picsum.photos/seed/cronus-product/900/600"
          alt="Studio product photo"
          className="max-w-md"
        />
      ),
    },
    {
      id: "zoom-scale",
      title: "Zoom scale",
      description:
        "`zoom` sets the magnification applied while zoomed (values below 1 clamp to 1). Defaults to 2.",
      code: `<div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
  <div className="flex flex-col items-center gap-2">
    <ImageZoom src="https://picsum.photos/seed/cronus-loft/700/500" alt="" />
    <span className="text-sm text-fg-secondary">zoom 2 (default)</span>
  </div>
  <div className="flex flex-col items-center gap-2">
    <ImageZoom
      src="https://picsum.photos/seed/cronus-loft/700/500"
      alt=""
      zoom={4}
      labels={{ zoom: "Zoom image (4×)" }}
    />
    <span className="text-sm text-fg-secondary">zoom 4</span>
  </div>
</div>`,
      preview: (
        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-2">
            <ImageZoom src="https://picsum.photos/seed/cronus-loft/700/500" alt="" />
            <span className="text-sm text-fg-secondary">zoom 2 (default)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ImageZoom
              src="https://picsum.photos/seed/cronus-loft/700/500"
              alt=""
              zoom={4}
              labels={{ zoom: "Zoom image (4×)" }}
            />
            <span className="text-sm text-fg-secondary">zoom 4</span>
          </div>
        </div>
      ),
    },
    {
      id: "zoom-state",
      title: "Custom image & zoom state",
      description:
        "Wrap your own `<img>` instead of passing `src`, rename the accessible toggle via `labels`, and observe the state with `onZoomChange`.",
      code: imageZoomStateDemoCode,
      preview: <ImageZoomStateDemo />,
    },
  ],
  "video-player": [
    {
      id: "default",
      title: "Default",
      description:
        'A token-styled wrapper around the native `<video>` element with custom controls: play/pause, a seek slider, volume, playback speed, and fullscreen. Controls fade in on hover or keyboard focus and stay visible while paused. Captions are your data: pass a `<track kind="captions">` child — here a tiny inline WebVTT stub.',
      code: videoPlayerDemoCode,
      preview: <VideoPlayerDemo />,
    },
    {
      id: "aspect-ratios",
      title: "Aspect ratios",
      description:
        "`aspect` locks the frame to 16:9 (`video`), 1:1 (`square`), or 21:9 (`wide`), so the layout stays stable before metadata loads.",
      code: videoPlayerAspectDemoCode,
      preview: <VideoPlayerAspectDemo />,
    },
    {
      id: "localized-labels",
      title: "Localized labels",
      description:
        "Every control name is overridable through `labels`, so assistive tech announces the app's language — here pt-BR. `muted` and `loop` suit ambient background clips.",
      code: videoPlayerLocalizedDemoCode,
      preview: <VideoPlayerLocalizedDemo />,
    },
  ],
  "description-list": [
    {
      id: "stacked",
      title: "Stacked",
      description:
        "The default layout places each term above its details. Compose raw `DescriptionTerm` / `DescriptionDetails` pairs, or group each pair with `DescriptionItem`.",
      code: descriptionListDemoCode,
      preview: <DescriptionListDemo />,
    },
    {
      id: "horizontal",
      title: "Horizontal order summary",
      description:
        "The `horizontal` layout aligns terms and details into two columns with a divider between rows — the classic definition list. `bordered` adds the outer card shell, and `detailsAlign` set to `end` right-aligns values (logical, so it flips in RTL).",
      code: descriptionListHorizontalDemoCode,
      preview: <DescriptionListHorizontalDemo />,
    },
    {
      id: "striped",
      title: "Striped rows",
      description:
        "`striped` tints alternate rows for scannability. The zebra applies to grouped rows, so wrap each pair with `DescriptionItem` — raw `DescriptionTerm`/`DescriptionDetails` pairs don't participate.",
      code: descriptionListStripedDemoCode,
      preview: <DescriptionListStripedDemo />,
    },
    {
      id: "grid-cards",
      title: "Grid cards",
      description:
        "The `grid` layout spreads `DescriptionItem` pairs across a responsive 1 → 2 → 3 column set of card tiles — a compact settings review. Shown at the `sm` size.",
      code: descriptionListGridDemoCode,
      preview: <DescriptionListGridDemo />,
    },
  ],
  avatar: [
    {
      id: "image-fallback",
      title: "Image & fallback",
      description: "A user image alongside deterministic initials-only fallbacks.",
      code: `<div className="flex items-center gap-4">
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarFallback>AL</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarFallback>CU</AvatarFallback>
  </Avatar>
</div>`,
      preview: (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>CU</AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      id: "group",
      title: "Group",
      description: "A stack of overlapping avatars with a ring to separate each layer.",
      code: `<div className="flex -space-x-3">
  {["CN", "AL", "JL", "MK"].map((initials) => (
    <Avatar key={initials} className="ring-2 ring-surface-raised">
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  ))}
  <Avatar className="ring-2 ring-surface-raised">
    <AvatarFallback className="text-xs">+5</AvatarFallback>
  </Avatar>
</div>`,
      preview: (
        <div className="flex -space-x-3">
          {["CN", "AL", "JL", "MK"].map((initials) => (
            <Avatar key={initials} className="ring-2 ring-surface-raised">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
          <Avatar className="ring-2 ring-surface-raised">
            <AvatarFallback className="text-xs">+5</AvatarFallback>
          </Avatar>
        </div>
      ),
    },
  ],

  "avatar-group": [
    {
      id: "overflow",
      title: "With overflow",
      description:
        'Show the first few members, then a "+N" chip for the rest. Pass `avatars` for the data-driven shorthand and `max` to cap how many render.',
      code: `<AvatarGroup
  max={4}
  aria-label="Project collaborators"
  avatars={[
    { src: "https://github.com/shadcn.png", alt: "@shadcn", fallback: "CN" },
    { fallback: "AL" },
    { fallback: "JL" },
    { fallback: "MK" },
    { fallback: "RW" },
    { fallback: "TP" },
  ]}
/>`,
      preview: (
        <AvatarGroup
          max={4}
          aria-label="Project collaborators"
          avatars={[
            { src: "https://github.com/shadcn.png", alt: "@shadcn", fallback: "CN" },
            { fallback: "AL" },
            { fallback: "JL" },
            { fallback: "MK" },
            { fallback: "RW" },
            { fallback: "TP" },
          ]}
        />
      ),
    },
    {
      id: "sizes",
      title: "Sizes",
      description:
        "The `size` prop drives both the avatars and the overflow chip, so every row stays uniform regardless of the avatars' own sizes.",
      code: `<div className="flex flex-col gap-4">
  <AvatarGroup size="sm" max={3} aria-label="Reviewers" avatars={reviewers} />
  <AvatarGroup size="md" max={3} aria-label="Reviewers" avatars={reviewers} />
  <AvatarGroup size="lg" max={3} aria-label="Reviewers" avatars={reviewers} />
</div>`,
      preview: (
        <div className="flex flex-col gap-4">
          <AvatarGroup size="sm" max={3} aria-label="Reviewers" avatars={reviewers} />
          <AvatarGroup size="md" max={3} aria-label="Reviewers" avatars={reviewers} />
          <AvatarGroup size="lg" max={3} aria-label="Reviewers" avatars={reviewers} />
        </div>
      ),
    },
  ],

  badge: [
    {
      id: "variants",
      title: "Variants",
      description: "Compact status and category labels across the semantic palette.",
      code: `<div className="flex flex-wrap gap-2">
  <Badge variant="default">Default</Badge>
  <Badge variant="primary">Primary</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="outline">Outline</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="error">Error</Badge>
  <Badge variant="info">Info</Badge>
</div>`,
      preview: (
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      ),
    },
    {
      id: "with-icon",
      title: "With icon",
      description: "Pair a leading icon with the label to reinforce meaning.",
      code: `<Badge variant="success">
  <Check aria-hidden="true" />
  Verified
</Badge>`,
      preview: (
        <Badge variant="success">
          <Check aria-hidden="true" />
          Verified
        </Badge>
      ),
    },
  ],

  card: [
    {
      id: "anatomy",
      title: "Anatomy",
      description: "A composable container with header, action, content, and footer slots.",
      code: `<Card className="max-w-md">
  <CardHeader>
    <CardTitle>Pro plan</CardTitle>
    <CardDescription>Everything you need to ship a polished product.</CardDescription>
    <CardAction>
      <Badge variant="primary">Popular</Badge>
    </CardAction>
  </CardHeader>
  <CardContent className="flex items-baseline gap-1">
    <span className="font-display text-3xl font-semibold text-fg">$24</span>
    <span className="text-sm text-fg-tertiary">/ month</span>
  </CardContent>
  <CardFooter>
    <Button variant="primary" className="w-full">
      Upgrade now
    </Button>
  </CardFooter>
</Card>`,
      preview: (
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Pro plan</CardTitle>
            <CardDescription>Everything you need to ship a polished product.</CardDescription>
            <CardAction>
              <Badge variant="primary">Popular</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-semibold text-fg">$24</span>
            <span className="text-sm text-fg-tertiary">/ month</span>
          </CardContent>
          <CardFooter>
            <Button variant="primary" className="w-full">
              Upgrade now
            </Button>
          </CardFooter>
        </Card>
      ),
    },
  ],

  table: [
    {
      id: "basic",
      title: "Basic",
      description: "A styled static table with a header, body, footer, and an accessible caption.",
      code: `<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((invoice) => (
      <TableRow key={invoice.invoice}>
        <TableCell className="font-medium">{invoice.invoice}</TableCell>
        <TableCell>{invoice.status}</TableCell>
        <TableCell>{invoice.method}</TableCell>
        <TableCell className="text-right font-mono tabular-nums">{invoice.amount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={3}>Total</TableCell>
      <TableCell className="text-right font-mono tabular-nums">$1,200.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>`,
      preview: (
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { invoice: "INV-001", status: "Paid", method: "Credit Card", amount: "$250.00" },
              { invoice: "INV-002", status: "Pending", method: "PayPal", amount: "$150.00" },
              { invoice: "INV-003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
              { invoice: "INV-004", status: "Paid", method: "Credit Card", amount: "$450.00" },
            ].map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>{invoice.method}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {invoice.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right font-mono tabular-nums">$1,200.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ),
    },
  ],

  "data-table": [
    {
      id: "basic",
      title: "Basic",
      description:
        "The smallest setup: pass `columns` + `data`. With no opt-in props it renders a plain, accessible table — no toolbar, pagination, or selection.",
      code: `type Payment = {
  id: string;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  amount: number;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span className="capitalize">{row.getValue("status")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="lowercase">{row.getValue("email")}</span>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowUpDown aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(String(row.getValue("amount")));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <span className="font-mono tabular-nums">{formatted}</span>;
    },
  },
];

const data: Payment[] = [
  { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@example.com" },
  { id: "3u1reuv4", amount: 242, status: "success", email: "abe45@example.com" },
  { id: "derv1ws0", amount: 837, status: "processing", email: "monserrat44@example.com" },
  { id: "5kma53ae", amount: 874, status: "success", email: "silas22@example.com" },
  { id: "bhqecj4p", amount: 721, status: "failed", email: "carmella@example.com" },
  { id: "p0r9twq2", amount: 459, status: "pending", email: "jason.lee@example.com" },
];

<DataTable columns={columns} data={data} />`,
      preview: <DataTable columns={paymentColumns} data={paymentData} />,
    },
    {
      id: "sortable",
      title: "Sortable",
      description:
        "Use the exported `DataTableColumnHeader` in a column header to get an accessible, three-state sort toggle (asc → desc → none) with the right icon and aria-label. Click any header to sort.",
      code: `import { DataTable, DataTableColumnHeader } from "@cronus-ui/ui";

const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="font-medium text-fg">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue("role")}</Badge>,
  },
  {
    accessorKey: "seats",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Seats" />,
    cell: ({ row }) => (
      <span className="font-mono tabular-nums text-fg-secondary">{row.getValue("seats")}</span>
    ),
  },
];

<DataTable columns={columns} data={members} />`,
      preview: <DataTable columns={memberColumns} data={memberData.slice(0, 6)} />,
    },
    {
      id: "search-filter",
      title: "Search & filter",
      description:
        "Opt into the toolbar with `searchable` for a debounce-free global search, and `facetedFilters` for multi-select column filters with live facet counts. A Reset clears everything.",
      code: `const statusOptions = [
  { label: "Active", value: "active", icon: Check },
  { label: "Invited", value: "invited", icon: CircleDashed },
  { label: "Suspended", value: "suspended", icon: CircleSlash },
];

const statusFilter: DataTableFacetedFilter = {
  columnId: "status",
  title: "Status",
  options: statusOptions,
};

<DataTable
  columns={columns}
  data={members}
  searchable
  searchPlaceholder="Search members…"
  facetedFilters={[statusFilter]}
/>`,
      preview: (
        <DataTable
          columns={memberColumns}
          data={memberData}
          searchable
          searchPlaceholder="Search members…"
          facetedFilters={[memberStatusFilter]}
        />
      ),
    },
    {
      id: "pagination",
      title: "Pagination",
      description:
        "Set `pagination` to render the footer with a rows-per-page select, a row-range readout, and first/prev/next/last controls. Defaults are uncontrolled; pass `initialPageSize` and `pageSizeOptions` to tune.",
      code: `<DataTable
  columns={columns}
  data={members}
  pagination
  initialPageSize={5}
  pageSizeOptions={[5, 10, 20]}
/>`,
      preview: (
        <DataTable
          columns={memberColumns}
          data={memberData}
          pagination
          initialPageSize={5}
          pageSizeOptions={[5, 10, 20]}
        />
      ),
    },
    {
      id: "selection-bulk",
      title: "Selection & bulk actions",
      description:
        "`enableRowSelection` prepends an accessible select-all/row checkbox column. Render contextual actions with `bulkActions` — a bar that appears only while rows are selected and receives the selected rows.",
      code: `<DataTable
  columns={columns}
  data={members}
  enableRowSelection
  pagination
  initialPageSize={5}
  bulkActions={(rows) => (
    <>
      <Button variant="outline" size="sm">
        <Mail aria-hidden="true" />
        Email {rows.length}
      </Button>
      <Button variant="destructive" size="sm">
        Remove
      </Button>
    </>
  )}
/>`,
      preview: (
        <DataTable
          columns={memberColumns}
          data={memberData}
          enableRowSelection
          pagination
          initialPageSize={5}
          bulkActions={(rows) => (
            <>
              <Button variant="outline" size="sm">
                <Mail aria-hidden="true" />
                Email {rows.length}
              </Button>
              <Button variant="destructive" size="sm">
                Remove
              </Button>
            </>
          )}
        />
      ),
    },
    {
      id: "column-visibility",
      title: "Column visibility",
      description:
        "`enableColumnVisibility` adds a “View” menu that toggles each hideable column on or off, so users can tailor the table to what they care about.",
      code: `<DataTable
  columns={columns}
  data={members}
  searchable
  enableColumnVisibility
/>`,
      preview: (
        <DataTable
          columns={memberColumns}
          data={memberData.slice(0, 6)}
          searchable
          enableColumnVisibility
        />
      ),
    },
    {
      id: "density",
      title: "Density",
      description:
        "`enableDensityToggle` exposes a comfortable/compact switch in the toolbar; the `aria-pressed` button trims cell padding for data-dense views without touching your columns.",
      code: `<DataTable
  columns={columns}
  data={members}
  searchable
  enableDensityToggle
/>`,
      preview: (
        <DataTable
          columns={memberColumns}
          data={memberData.slice(0, 6)}
          searchable
          enableDensityToggle
        />
      ),
    },
    {
      id: "loading",
      title: "Loading",
      description:
        "Pass `loading` to swap the body for shimmer rows that match your column count — no layout shift when the real data arrives. Toggle below to see the swap.",
      code: `const [loading, setLoading] = useState(true);

<DataTable
  columns={columns}
  data={members}
  loading={loading}
  loadingRowCount={4}
/>`,
      preview: <DataTableLoadingDemo />,
    },
    {
      id: "empty",
      title: "Empty",
      description:
        "With no rows, the table renders a centered empty state. Override the copy — or drop in a full `Empty` composition — via the `emptyState` prop.",
      code: `<DataTable
  columns={columns}
  data={[]}
  emptyState={
    <Empty>
      <EmptyIcon>
        <Inbox aria-hidden="true" />
      </EmptyIcon>
      <EmptyTitle>No members yet</EmptyTitle>
      <EmptyDescription>Invite teammates to see them listed here.</EmptyDescription>
    </Empty>
  }
/>`,
      preview: (
        <DataTable
          columns={memberColumns}
          data={[]}
          emptyState={
            <Empty>
              <EmptyIcon>
                <Inbox aria-hidden="true" />
              </EmptyIcon>
              <EmptyTitle>No members yet</EmptyTitle>
              <EmptyDescription>Invite teammates to see them listed here.</EmptyDescription>
            </Empty>
          }
        />
      ),
    },
    {
      id: "error",
      title: "Error",
      description:
        'Pass `error` to render an inline, `role="alert"` failure state. Provide `onRetry` to surface a Retry button — handy for refetching after a transient network error.',
      code: `const [failed, setFailed] = useState(true);

<DataTable
  columns={columns}
  data={failed ? [] : members}
  error={failed ? "Couldn't load team members. Check your connection and try again." : undefined}
  onRetry={() => setFailed(false)}
/>`,
      preview: <DataTableErrorDemo />,
    },
  ],

  metric: [
    {
      id: "stat-tiles",
      title: "Stat tiles",
      description: "Compact KPI tiles pairing a label, a value, and a trend-aware delta.",
      code: `<div className="grid gap-4 sm:grid-cols-3">
  <Metric>
    <MetricLabel>Revenue</MetricLabel>
    <MetricValue>$48,290</MetricValue>
    <MetricDelta trend="up">+12.5%</MetricDelta>
  </Metric>
  <Metric>
    <MetricLabel>Churn</MetricLabel>
    <MetricValue>2.1%</MetricValue>
    <MetricDelta trend="down">-0.4%</MetricDelta>
  </Metric>
  <Metric>
    <MetricLabel>Sessions</MetricLabel>
    <MetricValue>9,830</MetricValue>
    <MetricDelta trend="neutral">0.0%</MetricDelta>
  </Metric>
</div>`,
      preview: (
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric>
            <MetricLabel>Revenue</MetricLabel>
            <MetricValue>$48,290</MetricValue>
            <MetricDelta trend="up">+12.5%</MetricDelta>
          </Metric>
          <Metric>
            <MetricLabel>Churn</MetricLabel>
            <MetricValue>2.1%</MetricValue>
            <MetricDelta trend="down">-0.4%</MetricDelta>
          </Metric>
          <Metric>
            <MetricLabel>Sessions</MetricLabel>
            <MetricValue>9,830</MetricValue>
            <MetricDelta trend="neutral">0.0%</MetricDelta>
          </Metric>
        </div>
      ),
    },
  ],

  sparkline: [
    {
      id: "types",
      title: "Line, area & bar",
      description:
        "Three rendering modes from the same series. `area` fills a token-tinted gradient under the line; `bar` plots evenly spaced columns. Each is a tiny inline SVG that scales to its `width`/`height`.",
      code: `<div className="flex items-center gap-8">
  <Sparkline data={[4, 6, 5, 8, 7, 11, 9, 13]} tone="primary" />
  <Sparkline data={[4, 6, 5, 8, 7, 11, 9, 13]} tone="success" area />
  <Sparkline data={[4, 6, 5, 8, 7, 11, 9, 13]} type="bar" tone="info" />
</div>`,
      preview: (
        <div className="flex items-center gap-8">
          <Sparkline data={[4, 6, 5, 8, 7, 11, 9, 13]} tone="primary" />
          <Sparkline data={[4, 6, 5, 8, 7, 11, 9, 13]} tone="success" area />
          <Sparkline data={[4, 6, 5, 8, 7, 11, 9, 13]} type="bar" tone="info" />
        </div>
      ),
    },
    {
      id: "stat-cards",
      title: "In stat cards",
      description:
        "Pair a Sparkline with a Metric to give a KPI tile an at-a-glance trend. The sparkline's tone tracks the delta's direction.",
      code: `<div className="grid gap-4 sm:grid-cols-3">
  <Card>
    <CardContent className="flex flex-col gap-3 pt-6">
      <Metric>
        <MetricLabel>Revenue</MetricLabel>
        <MetricValue>$48,290</MetricValue>
        <MetricDelta trend="up">+12.5%</MetricDelta>
      </Metric>
      <Sparkline
        data={[18, 22, 19, 27, 24, 31, 29, 38]}
        tone="success"
        area
        className="w-full"
        height={36}
        aria-label="Revenue, trending up"
      />
    </CardContent>
  </Card>
  <Card>
    <CardContent className="flex flex-col gap-3 pt-6">
      <Metric>
        <MetricLabel>Active users</MetricLabel>
        <MetricValue>9,830</MetricValue>
        <MetricDelta trend="up">+4.1%</MetricDelta>
      </Metric>
      <Sparkline
        data={[40, 38, 42, 41, 45, 44, 48, 52]}
        tone="primary"
        className="w-full"
        height={36}
        aria-label="Active users, trending up"
      />
    </CardContent>
  </Card>
  <Card>
    <CardContent className="flex flex-col gap-3 pt-6">
      <Metric>
        <MetricLabel>Churn</MetricLabel>
        <MetricValue>2.1%</MetricValue>
        <MetricDelta trend="down">-0.4%</MetricDelta>
      </Metric>
      <Sparkline
        data={[9, 8, 8, 7, 6, 6, 5, 4]}
        type="bar"
        tone="error"
        className="w-full"
        height={36}
        aria-label="Churn, trending down"
      />
    </CardContent>
  </Card>
</div>`,
      preview: (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col gap-3 pt-6">
              <Metric>
                <MetricLabel>Revenue</MetricLabel>
                <MetricValue>$48,290</MetricValue>
                <MetricDelta trend="up">+12.5%</MetricDelta>
              </Metric>
              <Sparkline
                data={[18, 22, 19, 27, 24, 31, 29, 38]}
                tone="success"
                area
                className="w-full"
                height={36}
                aria-label="Revenue, trending up"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-3 pt-6">
              <Metric>
                <MetricLabel>Active users</MetricLabel>
                <MetricValue>9,830</MetricValue>
                <MetricDelta trend="up">+4.1%</MetricDelta>
              </Metric>
              <Sparkline
                data={[40, 38, 42, 41, 45, 44, 48, 52]}
                tone="primary"
                className="w-full"
                height={36}
                aria-label="Active users, trending up"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-3 pt-6">
              <Metric>
                <MetricLabel>Churn</MetricLabel>
                <MetricValue>2.1%</MetricValue>
                <MetricDelta trend="down">-0.4%</MetricDelta>
              </Metric>
              <Sparkline
                data={[9, 8, 8, 7, 6, 6, 5, 4]}
                type="bar"
                tone="error"
                className="w-full"
                height={36}
                aria-label="Churn, trending down"
              />
            </CardContent>
          </Card>
        </div>
      ),
    },
  ],

  kbd: [
    {
      id: "keys",
      title: "Keys",
      description: "Keyboard-key hints, on their own or combined into a chord.",
      code: `<div className="flex items-center gap-3">
  <span className="inline-flex items-center gap-1">
    <Kbd>⌘</Kbd>
    <Kbd>K</Kbd>
  </span>
  <Kbd>Esc</Kbd>
  <Kbd>↵</Kbd>
</div>`,
      preview: (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
          <Kbd>Esc</Kbd>
          <Kbd>↵</Kbd>
        </div>
      ),
    },
  ],

  empty: [
    {
      id: "empty-state",
      title: "Empty state",
      description:
        "A composable empty-state for zero-data views, with an icon, copy, and an action.",
      code: `<Empty>
  <EmptyIcon>
    <Inbox aria-hidden="true" />
  </EmptyIcon>
  <EmptyTitle>No messages yet</EmptyTitle>
  <EmptyDescription>
    When someone sends you a message, it will show up here. Start a conversation to get going.
  </EmptyDescription>
  <EmptyContent>
    <Button>New message</Button>
  </EmptyContent>
</Empty>`,
      preview: (
        <Empty>
          <EmptyIcon>
            <Inbox aria-hidden="true" />
          </EmptyIcon>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>
            When someone sends you a message, it will show up here. Start a conversation to get
            going.
          </EmptyDescription>
          <EmptyContent>
            <Button>New message</Button>
          </EmptyContent>
        </Empty>
      ),
    },
  ],

  separator: [
    {
      id: "horizontal-vertical",
      title: "Horizontal & vertical",
      description: "A divider that adapts to either orientation.",
      code: `<div className="flex flex-col gap-3">
  <span className="text-sm text-fg-secondary">Section A</span>
  <Separator />
  <span className="text-sm text-fg-secondary">Section B</span>
  <div className="flex h-10 items-center gap-3 text-sm text-fg-secondary">
    <span>Docs</span>
    <Separator orientation="vertical" />
    <span>API</span>
    <Separator orientation="vertical" />
    <span>Blog</span>
  </div>
</div>`,
      preview: (
        <div className="flex flex-col gap-3">
          <span className="text-sm text-fg-secondary">Section A</span>
          <Separator />
          <span className="text-sm text-fg-secondary">Section B</span>
          <div className="flex h-10 items-center gap-3 text-sm text-fg-secondary">
            <span>Docs</span>
            <Separator orientation="vertical" />
            <span>API</span>
            <Separator orientation="vertical" />
            <span>Blog</span>
          </div>
        </div>
      ),
    },
  ],

  skeleton: [
    {
      id: "loading-card",
      title: "Loading card",
      description: "Placeholder shapes that mirror content while it loads.",
      code: `<div className="flex items-center gap-3">
  <Skeleton className="size-12 rounded-full" />
  <div className="flex flex-1 flex-col gap-2">
    <Skeleton className="h-3 w-3/4 rounded-md" />
    <Skeleton className="h-3 w-1/2 rounded-md" />
  </div>
</div>`,
      preview: (
        <div className="flex w-full max-w-xs items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
        </div>
      ),
    },
  ],

  "scroll-area": [
    {
      id: "scrollable-list",
      title: "Scrollable list",
      description: "A fixed-height viewport with a styled, theme-aware vertical scrollbar.",
      code: `const tags = Array.from({ length: 20 }, (_, index) => \`v1.2.0-beta.\${20 - index}\`);

<ScrollArea className="h-48 w-full max-w-xs rounded-xl border border-border-soft bg-surface-inset">
  <div className="flex flex-col gap-1 p-4">
    {tags.map((tag) => (
      <div key={tag} className="rounded-md px-2 py-1.5 font-mono text-sm text-fg-secondary">
        {tag}
      </div>
    ))}
  </div>
  <ScrollBar orientation="vertical" />
</ScrollArea>`,
      preview: (
        <ScrollArea className="h-48 w-full max-w-xs rounded-xl border border-border-soft bg-surface-inset">
          <div className="flex flex-col gap-1 p-4">
            {Array.from({ length: 20 }, (_, index) => `v1.2.0-beta.${20 - index}`).map((tag) => (
              <div
                key={tag}
                className="rounded-md px-2 py-1.5 font-mono text-sm text-fg-secondary hover:bg-surface-overlay"
              >
                {tag}
              </div>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ),
    },
  ],

  "code-block": [
    {
      id: "default",
      title: "Default",
      description:
        "Renders a source snippet with a built-in copy button. Add a `language` badge and/or a `filename` to show a header.",
      code: `<CodeBlock
  language="bash"
  filename="terminal"
  code="bunx cronus-ui add button card dialog"
/>`,
      preview: (
        <CodeBlock
          language="bash"
          filename="terminal"
          code="bunx cronus-ui add button card dialog"
          className="max-w-xl"
        />
      ),
    },
    {
      id: "line-numbers",
      title: "Line numbers",
      description: "Set `showLineNumbers` to render a non-selectable gutter beside the code.",
      code: `<CodeBlock
  language="tsx"
  showLineNumbers
  code={\`import { Button } from "@cronus-ui/ui";

export function Save() {
  return <Button>Save</Button>;
}\`}
/>`,
      preview: (
        <CodeBlock
          language="tsx"
          showLineNumbers
          className="max-w-xl"
          code={`import { Button } from "@cronus-ui/ui";

export function Save() {
  return <Button>Save</Button>;
}`}
        />
      ),
    },
  ],

  "code-tabs": [
    {
      id: "package-manager",
      title: "Package manager installer",
      description:
        "The classic bun/npm/pnpm/yarn switcher. Give every instance the same `storageKey` and the visitor's choice is persisted to localStorage and mirrored across the whole page (and across browser tabs) — flip one below and watch the other follow.",
      install: {
        registryItem: "code-tabs",
      },
      code: `<CodeTabs
  storageKey="pkg-manager"
  items={[
    { label: "bun", code: "bunx cronus-ui add code-tabs", language: "bash" },
    { label: "npm", code: "npx cronus-ui add code-tabs", language: "bash" },
    { label: "pnpm", code: "pnpm dlx cronus-ui add code-tabs", language: "bash" },
    { label: "yarn", code: "yarn dlx cronus-ui add code-tabs", language: "bash" },
  ]}
/>`,
      preview: (
        <div className="flex w-full max-w-xl flex-col gap-4">
          <CodeTabs
            storageKey="www-demo-pkg-manager"
            items={[
              { label: "bun", code: "bunx cronus-ui add code-tabs", language: "bash" },
              { label: "npm", code: "npx cronus-ui add code-tabs", language: "bash" },
              { label: "pnpm", code: "pnpm dlx cronus-ui add code-tabs", language: "bash" },
              { label: "yarn", code: "yarn dlx cronus-ui add code-tabs", language: "bash" },
            ]}
          />
          <CodeTabs
            storageKey="www-demo-pkg-manager"
            items={[
              { label: "bun", code: "bun add @cronus-ui/ui", language: "bash" },
              { label: "npm", code: "npm install @cronus-ui/ui", language: "bash" },
              { label: "pnpm", code: "pnpm add @cronus-ui/ui", language: "bash" },
              { label: "yarn", code: "yarn add @cronus-ui/ui", language: "bash" },
            ]}
          />
        </div>
      ),
    },
    {
      id: "multi-language",
      title: "Multi-language snippet",
      description:
        "General code tabs — one panel per label, each with its own copy button and a `language` hint in the header. `defaultLabel` picks the starting tab; `onLabelChange` reports user switches.",
      code: `<CodeTabs
  defaultLabel="TypeScript"
  items={[
    {
      label: "TypeScript",
      language: "ts",
      code: \`export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}\`,
    },
    {
      label: "JavaScript",
      language: "js",
      code: \`export function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}\`,
    },
  ]}
/>`,
      preview: (
        <CodeTabs
          className="w-full max-w-xl"
          defaultLabel="TypeScript"
          items={[
            {
              label: "TypeScript",
              language: "ts",
              code: `export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}`,
            },
            {
              label: "JavaScript",
              language: "js",
              code: `export function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}`,
            },
          ]}
        />
      ),
    },
  ],

  collapsible: [
    {
      id: "default",
      title: "Default",
      description:
        "An animated show/hide for a single section. Control it with `open` and `onOpenChange`, and put the toggle inside `CollapsibleTrigger`.",
      code: collapsibleDemoCode,
      preview: <CollapsibleDemo />,
    },
  ],

  "aspect-ratio": [
    {
      id: "default",
      title: "Default",
      description:
        "Constrains its content to a fixed width-to-height `ratio` (defaults to 16 / 9). The wrapper fills the available width; stretch the child to fill it.",
      code: `<AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl border border-border">
  <img
    src="/og.png"
    alt="Cover"
    className="h-full w-full object-cover"
  />
</AspectRatio>`,
      preview: (
        <div className="w-full max-w-sm">
          <AspectRatio
            ratio={16 / 9}
            className="overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/30 to-accent/20"
          >
            <div className="flex h-full w-full items-center justify-center font-mono text-fg-secondary text-sm">
              16 / 9
            </div>
          </AspectRatio>
        </div>
      ),
    },
    {
      id: "square",
      title: "Square",
      description: "Pass `ratio={1}` for a 1:1 box — handy for avatars, thumbnails and tiles.",
      code: `<AspectRatio ratio={1} className="overflow-hidden rounded-xl border border-border">
  <img src="/thumb.png" alt="Thumbnail" className="h-full w-full object-cover" />
</AspectRatio>`,
      preview: (
        <div className="w-40">
          <AspectRatio
            ratio={1}
            className="overflow-hidden rounded-xl border border-border bg-gradient-to-br from-accent/30 to-primary/20"
          >
            <div className="flex h-full w-full items-center justify-center font-mono text-fg-secondary text-sm">
              1 / 1
            </div>
          </AspectRatio>
        </div>
      ),
    },
  ],

  "tree-view": [
    {
      id: "file-tree",
      title: "File tree",
      description:
        "A data-driven hierarchy rendered from a `data` array of `TreeNode`s. Branches expand and collapse; selection and the expanded set are both controllable. Full keyboard support (arrows to move, Right/Left to open/close, Enter/Space to select).",
      code: `const data: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: <Folder aria-hidden="true" />,
    children: [
      {
        id: "components",
        label: "components",
        icon: <Folder aria-hidden="true" />,
        children: [
          { id: "button.tsx", label: "button.tsx", icon: <FileText aria-hidden="true" /> },
          { id: "card.tsx", label: "card.tsx", icon: <FileText aria-hidden="true" /> },
        ],
      },
      { id: "index.ts", label: "index.ts", icon: <FileText aria-hidden="true" /> },
    ],
  },
  { id: "package.json", label: "package.json", icon: <FileText aria-hidden="true" /> },
];

return (
  <TreeView
    data={data}
    defaultExpandedIds={["src", "components"]}
    defaultValue="button.tsx"
    aria-label="Project files"
    className="max-w-xs rounded-lg border border-border p-1.5"
  />
);`,
      preview: <FileTreeDemo />,
    },
  ],

  "json-viewer": [
    {
      id: "api-response",
      title: "API response",
      description:
        "Any JSON value rendered as a collapsible tree. Objects and arrays get a chevron with a muted child-count summary while collapsed; primitives are colored by type (string, number, boolean, null) and every row reveals a copy-value button on hover or focus.",
      install: {
        registryItem: "json-viewer",
      },
      code: `const payload = {
  order: {
    id: "ord_8kX2",
    total: 248.9,
    currency: "BRL",
    paid: true,
    coupon: null,
    items: [
      { sku: "tee-black-m", qty: 2 },
      { sku: "sticker-pack", qty: 1 },
    ],
  },
};

return <JsonViewer data={payload} defaultExpandedDepth={2} />;`,
      preview: (
        <JsonViewer data={jsonViewerOrder} defaultExpandedDepth={2} className="w-full max-w-md" />
      ),
    },
    {
      id: "expanded-depth",
      title: "Expanded depth",
      description:
        "`defaultExpandedDepth` sets how many levels start open — the root value is depth 0, so the default of 1 shows the root's entries with nested branches collapsed. Pass `Number.POSITIVE_INFINITY` to expand everything.",
      code: `<JsonViewer data={payload} defaultExpandedDepth={Number.POSITIVE_INFINITY} />`,
      preview: (
        <JsonViewer
          data={jsonViewerOrder}
          defaultExpandedDepth={Number.POSITIVE_INFINITY}
          className="w-full max-w-md"
        />
      ),
    },
  ],

  timeline: [
    {
      id: "activity",
      title: "Activity",
      description:
        "A vertical history feed. Each item pairs a tone- or icon-bearing dot on the rail with a title, timestamp and description; the connecting line is drawn automatically and stops at the last event.",
      code: `<Timeline className="max-w-md">
  <TimelineItem>
    <TimelineDot tone="primary" icon={<CreditCard aria-hidden="true" />} />
    <TimelineContent>
      <TimelineTitle>Order placed</TimelineTitle>
      <TimelineTime dateTime="2026-06-21T09:24">Jun 21 · 09:24</TimelineTime>
      <TimelineDescription>Order #4827 created for 3 items.</TimelineDescription>
    </TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineDot tone="success" icon={<CheckCircle2 aria-hidden="true" />} />
    <TimelineContent>
      <TimelineTitle>Payment confirmed</TimelineTitle>
      <TimelineTime dateTime="2026-06-21T09:25">Jun 21 · 09:25</TimelineTime>
      <TimelineDescription>R$ 248,90 captured on the card ending 4242.</TimelineDescription>
    </TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineDot icon={<Package aria-hidden="true" />} />
    <TimelineContent>
      <TimelineTitle>Packed</TimelineTitle>
      <TimelineTime dateTime="2026-06-22T14:02">Jun 22 · 14:02</TimelineTime>
      <TimelineDescription>Left the warehouse with the carrier.</TimelineDescription>
    </TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineDot icon={<Truck aria-hidden="true" />} />
    <TimelineContent>
      <TimelineTitle>Out for delivery</TimelineTitle>
      <TimelineTime dateTime="2026-06-23T08:10">Jun 23 · 08:10</TimelineTime>
      <TimelineDescription>Arriving today between 9am and 1pm.</TimelineDescription>
    </TimelineContent>
  </TimelineItem>
</Timeline>`,
      preview: (
        <Timeline className="max-w-md">
          <TimelineItem>
            <TimelineDot tone="primary" icon={<CreditCard aria-hidden="true" />} />
            <TimelineContent>
              <TimelineTitle>Order placed</TimelineTitle>
              <TimelineTime dateTime="2026-06-21T09:24">Jun 21 · 09:24</TimelineTime>
              <TimelineDescription>Order #4827 created for 3 items.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="success" icon={<CheckCircle2 aria-hidden="true" />} />
            <TimelineContent>
              <TimelineTitle>Payment confirmed</TimelineTitle>
              <TimelineTime dateTime="2026-06-21T09:25">Jun 21 · 09:25</TimelineTime>
              <TimelineDescription>R$ 248,90 captured on the card ending 4242.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot icon={<Package aria-hidden="true" />} />
            <TimelineContent>
              <TimelineTitle>Packed</TimelineTitle>
              <TimelineTime dateTime="2026-06-22T14:02">Jun 22 · 14:02</TimelineTime>
              <TimelineDescription>Left the warehouse with the carrier.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot icon={<Truck aria-hidden="true" />} />
            <TimelineContent>
              <TimelineTitle>Out for delivery</TimelineTitle>
              <TimelineTime dateTime="2026-06-23T08:10">Jun 23 · 08:10</TimelineTime>
              <TimelineDescription>Arriving today between 9am and 1pm.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      ),
    },
  ],

  kanban: [
    {
      id: "board",
      title: "Board",
      description:
        "A controlled drag-and-drop board. Cards reorder within a column and move across columns; `onColumnsChange` hands you the next state to store. Drag with the pointer or focus a card's handle and use the arrow keys.",
      code: kanbanDemoCode,
      preview: <KanbanDemo />,
    },
  ],
  masonry: [
    {
      id: "responsive-cards",
      title: "Responsive cards",
      description:
        "A pure CSS multi-column layout that flows items top-to-bottom, balancing columns regardless of card height. `columns` takes a responsive map and `gap` controls both axes — no JS measurement, no layout shift.",
      code: masonryDemoCode,
      preview: <MasonryDemo />,
    },
  ],
  heatmap: [
    {
      id: "contributions",
      title: "Contributions",
      description:
        "A calendar-style activity grid: each cell is one day, laid out into week columns of 7. Values bucket into discrete levels against the series max, with the empty level reserved for zero-activity days.",
      code: heatmapDemoCode,
      preview: <HeatmapDemo />,
    },
  ],
  "comparison-slider": [
    {
      id: "before-after",
      title: "Before & after",
      description:
        "Drag the divider — or focus it and use the arrow keys — to wipe between two layers. Here two labelled panels stand in for a before/after image pair so it reads clearly offline.",
      code: `<ComparisonSlider
  aria-label="Before and after"
  className="h-64"
  before={
    <div className="flex size-full items-center justify-center bg-surface-inset">
      <span className="rounded-md bg-surface-overlay px-3 py-1 text-sm font-medium text-fg">
        Before
      </span>
    </div>
  }
  after={
    <div className="flex size-full items-center justify-center bg-primary">
      <span className="rounded-md bg-surface-base/80 px-3 py-1 text-sm font-medium text-fg">
        After
      </span>
    </div>
  }
/>`,
      preview: (
        <ComparisonSlider
          aria-label="Before and after"
          className="h-64"
          before={
            <div className="flex size-full items-center justify-center bg-surface-inset">
              <span className="rounded-md bg-surface-overlay px-3 py-1 text-sm font-medium text-fg">
                Before
              </span>
            </div>
          }
          after={
            <div className="flex size-full items-center justify-center bg-primary">
              <span className="rounded-md bg-surface-base/80 px-3 py-1 text-sm font-medium text-fg">
                After
              </span>
            </div>
          }
        />
      ),
    },
  ],
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function DataDisplayExamples({ slug }: { slug: string }) {
  return <ExampleList examples={dataDisplayExamples[slug] ?? []} />;
}

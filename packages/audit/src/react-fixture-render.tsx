import {
  BorderBeam,
  ConfirmationDialog,
  CreditCardInput,
  CurrencyInput,
  FlipCard,
  FlipCardBack,
  FlipCardFront,
  FloatingLabelInput,
  PhoneInput,
  SplitButton,
  TiltCard,
  TimePicker,
} from "@cronus-ui/ui";
import { Alert, AlertDescription, AlertTitle } from "@cronus-ui/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTitle,
} from "@cronus-ui/ui/alert-dialog";
import { AnimatedButton } from "@cronus-ui/ui/animated-button";
import { AnimatedList } from "@cronus-ui/ui/animated-list";
import { AnimatedNumber } from "@cronus-ui/ui/animated-number";
import { AspectRatio } from "@cronus-ui/ui/aspect-ratio";
import { AuroraBackground } from "@cronus-ui/ui/aurora-background";
import { Avatar, AvatarFallback } from "@cronus-ui/ui/avatar";
import { AvatarGroup } from "@cronus-ui/ui/avatar-group";
import { Badge } from "@cronus-ui/ui/badge";
import { Banner } from "@cronus-ui/ui/banner";
import { BouncyAccordion } from "@cronus-ui/ui/bouncy-accordion";
import { Button } from "@cronus-ui/ui/button";
import { ButtonGroup } from "@cronus-ui/ui/button-group";
import { Card, CardDescription, CardHeader, CardTitle } from "@cronus-ui/ui/card";
import { CardStack } from "@cronus-ui/ui/card-stack";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@cronus-ui/ui/carousel";
import { Checkbox } from "@cronus-ui/ui/checkbox";
import { Chip } from "@cronus-ui/ui/chip";
import { CodeBlock } from "@cronus-ui/ui/code-block";
import { CodeTabs } from "@cronus-ui/ui/code-tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@cronus-ui/ui/collapsible";
import { Combobox } from "@cronus-ui/ui/combobox";
import { Command, CommandInput, CommandItem, CommandList } from "@cronus-ui/ui/command";
import { Confetti } from "@cronus-ui/ui/confetti";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@cronus-ui/ui/context-menu";
import { CopyButton } from "@cronus-ui/ui/copy-button";
import { Countdown } from "@cronus-ui/ui/countdown";
import { DateRangePicker } from "@cronus-ui/ui/date-range-picker";
import { DescriptionItem, DescriptionList } from "@cronus-ui/ui/description-list";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@cronus-ui/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@cronus-ui/ui/dropdown-menu";
import { DynamicIsland } from "@cronus-ui/ui/dynamic-island";
import { Empty, EmptyTitle } from "@cronus-ui/ui/empty";
import { Fab } from "@cronus-ui/ui/fab";
import { Field, FieldDescription, FieldLabel } from "@cronus-ui/ui/field";
import { FileDropzone } from "@cronus-ui/ui/file-dropzone";
import { FormItem } from "@cronus-ui/ui/form";
import { Frame } from "@cronus-ui/ui/frame";
import { GlassCard } from "@cronus-ui/ui/glass-card";
import { GradientText } from "@cronus-ui/ui/gradient-text";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@cronus-ui/ui/hover-card";
import { ImageZoom } from "@cronus-ui/ui/image-zoom";
import { Input } from "@cronus-ui/ui/input";
import { InputGroup, InputGroupAddon } from "@cronus-ui/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@cronus-ui/ui/input-otp";
import { InviteDialog } from "@cronus-ui/ui/invite-dialog";
import { JsonViewer } from "@cronus-ui/ui/json-viewer";
import { Kbd } from "@cronus-ui/ui/kbd";
import { Label } from "@cronus-ui/ui/label";
import { LogoCarousel } from "@cronus-ui/ui/logo-carousel";
import { Marquee } from "@cronus-ui/ui/marquee";
import { Masonry } from "@cronus-ui/ui/masonry";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@cronus-ui/ui/menubar";
import { Metric, MetricLabel, MetricValue } from "@cronus-ui/ui/metric";
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@cronus-ui/ui/morphing-popover";
import { MultiSelect } from "@cronus-ui/ui/multi-select";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@cronus-ui/ui/navigation-menu";
import { Noise } from "@cronus-ui/ui/noise";
import { Particles } from "@cronus-ui/ui/particles";
import { PillNav } from "@cronus-ui/ui/pill-nav";
import { Popover, PopoverContent, PopoverTrigger } from "@cronus-ui/ui/popover";
import { Progress } from "@cronus-ui/ui/progress";
import { RadioGroup, RadioGroupItem } from "@cronus-ui/ui/radio-group";
import { Rating } from "@cronus-ui/ui/rating";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@cronus-ui/ui/resizable";
import { Reveal } from "@cronus-ui/ui/reveal";
import { RichTextEditor } from "@cronus-ui/ui/rich-text-editor";
import { ScrollArea } from "@cronus-ui/ui/scroll-area";
import { SegmentedControl, SegmentedControlItem } from "@cronus-ui/ui/segmented-control";
import { Separator } from "@cronus-ui/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@cronus-ui/ui/sheet";
import { Shimmer } from "@cronus-ui/ui/shimmer";
import { ShinyText } from "@cronus-ui/ui/shiny-text";
import { SignaturePad } from "@cronus-ui/ui/signature-pad";
import { Skeleton } from "@cronus-ui/ui/skeleton";
import { Slider } from "@cronus-ui/ui/slider";
import { Toaster } from "@cronus-ui/ui/sonner";
import { SparklesText } from "@cronus-ui/ui/sparkles-text";
import { Spinner } from "@cronus-ui/ui/spinner";
import { SpotlightCard } from "@cronus-ui/ui/spotlight-card";
import { StarBorder } from "@cronus-ui/ui/star-border";
import { StatusDot } from "@cronus-ui/ui/status-dot";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperTitle,
} from "@cronus-ui/ui/stepper";
import { Switch } from "@cronus-ui/ui/switch";
import { TableOfContents } from "@cronus-ui/ui/table-of-contents";
import { TagsInput } from "@cronus-ui/ui/tags-input";
import { TextEffect } from "@cronus-ui/ui/text-effect";
import { TextShimmer } from "@cronus-ui/ui/text-shimmer";
import { Textarea } from "@cronus-ui/ui/textarea";
import { Timeline, TimelineContent, TimelineItem, TimelineTitle } from "@cronus-ui/ui/timeline";
import { Toggle } from "@cronus-ui/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@cronus-ui/ui/toggle-group";
import { Toolbar, ToolbarButton } from "@cronus-ui/ui/toolbar";
import { TypingText } from "@cronus-ui/ui/typing-text";
import { UsageMeter } from "@cronus-ui/ui/usage-meter";
import { VideoPlayer } from "@cronus-ui/ui/video-player";
import { WordRotate } from "@cronus-ui/ui/word-rotate";
import type { ReactElement } from "react";
import { AppShellFixture } from "./app-shell-fixture.js";
import { AutocompleteFixture } from "./autocomplete-fixture.js";
import { CalendarFixture } from "./calendar-fixture.js";
import {
  AreaChartFixture,
  BarChartFixture,
  CandlestickChartFixture,
  ChartFixture,
  ChoroplethChartFixture,
  ComposedChartFixture,
  FunnelChartFixture,
  GaugeChartFixture,
  HeatmapChartFixture,
  LineChartFixture,
  LiveLineChartFixture,
  PieChartFixture,
  ProfitLossChartFixture,
  RadarChartFixture,
  RingChartFixture,
  ScatterChartFixture,
  SparklineFixture,
  SunburstChartFixture,
} from "./chart-fixtures.js";
import { ColorPickerFixture } from "./color-picker-fixture.js";
import { ComparisonSliderFixture } from "./comparison-slider-fixture.js";
import { DataTableFixture } from "./data-table-fixture.js";
import { DatePickerFixture } from "./date-picker-fixture.js";
import { DockFixture } from "./dock-fixture.js";
import { ExpandableTabsFixture } from "./expandable-tabs-fixture.js";
import { HeatmapFixture } from "./heatmap-fixture.js";
import { KanbanFixture } from "./kanban-fixture.js";
import { LightboxFixture } from "./lightbox-fixture.js";
import { ModeToggleFixture } from "./mode-toggle-fixture.js";
import { NotificationCenterFixture } from "./notification-center-fixture.js";
import type { ParityFixture } from "./parity-fixture.js";
import { SchedulerFixture } from "./scheduler-fixture.js";
import { ScrollProgressFixture } from "./scroll-progress-fixture.js";
import { SidebarFixture } from "./sidebar-fixture.js";
import { TerminalFixture } from "./terminal-fixture.js";
import { ToastFixture } from "./toast-fixture.js";
import { TreeViewFixture } from "./tree-view-fixture.js";
import { WorkspaceSwitcherFixture } from "./workspace-switcher-fixture.js";

function stringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function stringPairs(value: unknown): Array<[string, string]> {
  const list = stringList(value);
  const pairs: Array<[string, string]> = [];
  for (let index = 0; index + 1 < list.length; index += 2) {
    const term = list[index];
    const details = list[index + 1];
    if (term && details) pairs.push([term, details]);
  }
  return pairs;
}

const FALLBACK_SCROLL_ITEMS = [
  "v1.2.0-beta.12",
  "v1.2.0-beta.11",
  "v1.2.0-beta.10",
  "v1.2.0-beta.9",
  "v1.2.0-beta.8",
  "v1.2.0-beta.7",
  "v1.2.0-beta.6",
  "v1.2.0-beta.5",
  "v1.2.0-beta.4",
  "v1.2.0-beta.3",
  "v1.2.0-beta.2",
  "v1.2.0-beta.1",
];

export function renderReactFixture(fixture: ParityFixture): ReactElement {
  if (fixture.family === "button") {
    const { href, children, variant, size, disabled, ...rest } = fixture.props as {
      href?: string;
      children?: string;
      variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
      size?: "sm" | "md" | "lg" | "icon" | "icon-sm";
      disabled?: boolean;
    };
    const label = typeof children === "string" ? children : fixture.id;
    if (href) {
      return (
        <Button asChild variant={variant} size={size} disabled={disabled} {...rest}>
          <a href={href}>{label}</a>
        </Button>
      );
    }
    return (
      <Button variant={variant} size={size} disabled={disabled} {...rest}>
        {label}
      </Button>
    );
  }
  if (fixture.family === "badge") {
    const { children, variant, ...rest } = fixture.props as {
      children?: string;
      variant?:
        | "default"
        | "primary"
        | "secondary"
        | "outline"
        | "success"
        | "warning"
        | "destructive"
        | "error"
        | "info";
    };
    return (
      <Badge variant={variant} {...rest}>
        {typeof children === "string" ? children : fixture.id}
      </Badge>
    );
  }
  if (fixture.family === "input") {
    const {
      placeholder,
      disabled,
      invalid,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      placeholder?: string;
      disabled?: boolean;
      invalid?: boolean;
      "aria-label"?: string;
    };
    return (
      <Input
        placeholder={placeholder}
        disabled={disabled}
        invalid={invalid}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-input"}
        {...rest}
      />
    );
  }
  if (fixture.family === "label") {
    const { children, ...rest } = fixture.props as { children?: string };
    return <Label {...rest}>{typeof children === "string" ? children : fixture.id}</Label>;
  }
  if (fixture.family === "textarea") {
    const {
      placeholder,
      disabled,
      invalid,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      placeholder?: string;
      disabled?: boolean;
      invalid?: boolean;
      "aria-label"?: string;
    };
    return (
      <Textarea
        placeholder={placeholder}
        disabled={disabled}
        invalid={invalid}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-textarea"}
        {...rest}
      />
    );
  }
  if (fixture.family === "checkbox") {
    const {
      checked,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      checked?: boolean;
      "aria-label"?: string;
    };
    return (
      <Checkbox
        checked={checked}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-checkbox"}
        {...rest}
      />
    );
  }
  if (fixture.family === "switch") {
    const {
      checked,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      checked?: boolean;
      "aria-label"?: string;
    };
    return (
      <Switch
        checked={checked}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-switch"}
        {...rest}
      />
    );
  }
  if (fixture.family === "spinner") {
    return <Spinner />;
  }
  if (fixture.family === "separator") {
    const { orientation, ...rest } = fixture.props as {
      orientation?: "horizontal" | "vertical";
    };
    return <Separator orientation={orientation} {...rest} />;
  }
  if (fixture.family === "kbd") {
    const { children, ...rest } = fixture.props as { children?: string };
    return <Kbd {...rest}>{typeof children === "string" ? children : fixture.id}</Kbd>;
  }
  if (fixture.family === "toggle") {
    const { pressed, children, ...rest } = fixture.props as {
      pressed?: boolean;
      children?: string;
    };
    return (
      <Toggle pressed={pressed} {...rest}>
        {typeof children === "string" ? children : fixture.id}
      </Toggle>
    );
  }
  if (fixture.family === "progress") {
    const {
      value,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      value?: number;
      "aria-label"?: string;
    };
    return (
      <Progress
        value={value}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-progress"}
        {...rest}
      />
    );
  }
  if (fixture.family === "alert") {
    const { title, description, children, variant, ...rest } = fixture.props as {
      title?: string;
      description?: string;
      children?: string;
      variant?: "default" | "info" | "success" | "warning" | "destructive";
    };
    const heading =
      typeof title === "string" ? title : typeof children === "string" ? children : fixture.id;
    return (
      <Alert variant={variant} {...rest}>
        <AlertTitle>{heading}</AlertTitle>
        {typeof description === "string" ? (
          <AlertDescription>{description}</AlertDescription>
        ) : null}
      </Alert>
    );
  }
  if (fixture.family === "skeleton") {
    const { className, ...rest } = fixture.props as { className?: string };
    return (
      <Skeleton className={typeof className === "string" ? className : "h-4 w-32"} {...rest} />
    );
  }
  if (fixture.family === "banner") {
    const { title, description, dismissible, ...rest } = fixture.props as {
      title?: string;
      description?: string;
      dismissible?: boolean;
    };
    return (
      <Banner
        title={typeof title === "string" ? title : fixture.id}
        description={description}
        dismissible={typeof dismissible === "boolean" ? dismissible : false}
        {...rest}
      />
    );
  }
  if (fixture.family === "slider") {
    const {
      value,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      value?: number;
      "aria-label"?: string;
    };
    return (
      <Slider
        value={typeof value === "number" ? [value] : [50]}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-slider"}
        {...rest}
      />
    );
  }
  if (fixture.family === "radio-group") {
    const {
      value,
      options,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      value?: string;
      options?: unknown;
      "aria-label"?: string;
    };
    const items = Array.isArray(options)
      ? options.filter((item): item is string => typeof item === "string")
      : [];
    return (
      <RadioGroup
        value={value}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-radio-group"}
        {...rest}
      >
        {items.map((item) => (
          <RadioGroupItem key={item} value={item} aria-label={item} />
        ))}
      </RadioGroup>
    );
  }
  if (fixture.family === "chip") {
    const { children, ...rest } = fixture.props as { children?: string };
    return <Chip {...rest}>{typeof children === "string" ? children : fixture.id}</Chip>;
  }
  if (fixture.family === "avatar") {
    const { children, ...rest } = fixture.props as { children?: string };
    return (
      <Avatar {...rest}>
        <AvatarFallback>{typeof children === "string" ? children : fixture.id}</AvatarFallback>
      </Avatar>
    );
  }
  if (fixture.family === "card") {
    const { title, description, ...rest } = fixture.props as {
      title?: string;
      description?: string;
    };
    return (
      <Card {...rest}>
        <CardHeader>
          <CardTitle>{typeof title === "string" ? title : fixture.id}</CardTitle>
          {typeof description === "string" ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>
      </Card>
    );
  }
  if (fixture.family === "empty") {
    const { title, children, ...rest } = fixture.props as {
      title?: string;
      children?: string;
    };
    const heading =
      typeof title === "string" ? title : typeof children === "string" ? children : fixture.id;
    return (
      <Empty {...rest}>
        <EmptyTitle>{heading}</EmptyTitle>
      </Empty>
    );
  }
  if (fixture.family === "field") {
    const { label, description, ...rest } = fixture.props as {
      label?: string;
      description?: string;
    };
    return (
      <Field {...rest}>
        <FieldLabel>{typeof label === "string" ? label : fixture.id}</FieldLabel>
        {typeof description === "string" ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
      </Field>
    );
  }
  if (fixture.family === "input-group") {
    const {
      addon,
      placeholder,
      label: _label,
      items: _items,
      options: _options,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      addon?: string;
      placeholder?: string;
      label?: string;
      items?: unknown;
      options?: unknown;
      "aria-label"?: string;
    };
    return (
      <InputGroup {...rest}>
        {typeof addon === "string" ? <InputGroupAddon>{addon}</InputGroupAddon> : null}
        <Input
          placeholder={placeholder}
          aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-input-group"}
        />
      </InputGroup>
    );
  }
  if (fixture.family === "rating") {
    const {
      value,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      value?: number;
      "aria-label"?: string;
    };
    return (
      <Rating
        value={typeof value === "number" ? value : 0}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-rating"}
        {...rest}
      />
    );
  }
  if (fixture.family === "copy-button") {
    const {
      value,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      value?: string;
      "aria-label"?: string;
    };
    return (
      <CopyButton
        value={typeof value === "string" ? value : fixture.id}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "Copy"}
        {...rest}
      />
    );
  }
  if (fixture.family === "fab") {
    const { label, ...rest } = fixture.props as { label?: string };
    return (
      <Fab
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        }
        label={typeof label === "string" ? label : fixture.id}
        {...rest}
      />
    );
  }
  if (fixture.family === "toggle-group") {
    const {
      value,
      items,
      options,
      type: _type,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      value?: string;
      items?: unknown;
      options?: unknown;
      type?: string;
      "aria-label"?: string;
    };
    const labels = stringList(items ?? options);
    return (
      <ToggleGroup
        type="single"
        value={typeof value === "string" ? value : undefined}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-toggle-group"}
        {...rest}
      >
        {labels.map((item) => (
          <ToggleGroupItem key={item} value={item}>
            {item}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  }
  if (fixture.family === "metric") {
    const { label, value, ...rest } = fixture.props as {
      label?: string;
      value?: string | number;
    };
    const display =
      typeof value === "string" || typeof value === "number" ? String(value) : fixture.id;
    return (
      <Metric {...rest}>
        <MetricLabel>{typeof label === "string" ? label : fixture.id}</MetricLabel>
        <MetricValue>{display}</MetricValue>
      </Metric>
    );
  }
  if (fixture.family === "avatar-group") {
    const {
      items,
      options,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      "aria-label"?: string;
    };
    const initials = stringList(items ?? options);
    return (
      <AvatarGroup
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "Avatar group"}
        {...rest}
      >
        {initials.map((item) => (
          <Avatar key={item}>
            <AvatarFallback>{item}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    );
  }
  if (fixture.family === "button-group") {
    const {
      items,
      options,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      "aria-label"?: string;
    };
    const labels = stringList(items ?? options);
    return (
      <ButtonGroup
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-button-group"}
        {...rest}
      >
        {labels.map((item) => (
          <Button key={item}>{item}</Button>
        ))}
      </ButtonGroup>
    );
  }
  if (fixture.family === "combobox") {
    const {
      options,
      placeholder,
      open: _open,
      defaultOpen: _defaultOpen,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      options?: unknown;
      placeholder?: string;
      open?: boolean;
      defaultOpen?: boolean;
      "aria-label"?: string;
    };
    const labels = stringList(options);
    return (
      <Combobox
        options={labels.map((item) => ({ label: item, value: item }))}
        placeholder={placeholder}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-combobox"}
        {...rest}
      />
    );
  }
  if (fixture.family === "stepper") {
    const {
      items,
      options,
      label: _label,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      label?: string;
    };
    const titles = stringList(items ?? options);
    const steps = titles.length > 0 ? titles : [fixture.id];
    return (
      <Stepper {...rest}>
        <StepperList>
          {steps.map((title, index) => (
            <StepperItem key={title} step={index}>
              <StepperIndicator />
              <StepperTitle>{title}</StepperTitle>
            </StepperItem>
          ))}
        </StepperList>
      </Stepper>
    );
  }
  if (fixture.family === "input-otp") {
    const {
      maxLength,
      "aria-label": ariaLabel,
      children: _children,
      items: _items,
      options: _options,
      ...rest
    } = fixture.props as {
      maxLength?: number;
      "aria-label"?: string;
      children?: string;
      items?: unknown;
      options?: unknown;
    };
    const length = typeof maxLength === "number" && maxLength > 0 ? maxLength : 6;
    return (
      <InputOTP
        maxLength={length}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "One-time passcode"}
        {...rest}
      >
        <InputOTPGroup>
          {["s0", "s1", "s2", "s3", "s4", "s5"].slice(0, length).map((key, index) => (
            <InputOTPSlot key={key} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    );
  }
  if (fixture.family === "file-dropzone") {
    const {
      onFiles: _onFiles,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      onFiles?: unknown;
      "aria-label"?: string;
    };
    return (
      <FileDropzone
        onFiles={() => {}}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "Upload files"}
        {...rest}
      />
    );
  }
  if (fixture.family === "popover") {
    const {
      children,
      options,
      items,
      defaultOpen: _defaultOpen,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      children?: string;
      options?: unknown;
      items?: unknown;
      defaultOpen?: boolean;
      "aria-label"?: string;
    };
    const trigger = typeof children === "string" ? children : "Open";
    const body = stringList(options ?? items)[0] ?? trigger;
    return (
      <Popover {...rest} defaultOpen>
        <PopoverTrigger asChild>
          <Button>{trigger}</Button>
        </PopoverTrigger>
        <PopoverContent aria-label={typeof ariaLabel === "string" ? ariaLabel : "Details"}>
          {body}
        </PopoverContent>
      </Popover>
    );
  }
  if (fixture.family === "hover-card") {
    const {
      children,
      options,
      items,
      open: _open,
      ...rest
    } = fixture.props as {
      children?: string;
      options?: unknown;
      items?: unknown;
      open?: boolean;
    };
    const trigger = typeof children === "string" ? children : fixture.id;
    const body = stringList(options ?? items)[0] ?? trigger;
    return (
      <HoverCard {...rest} open>
        <HoverCardTrigger asChild>
          <Button variant="link">{trigger}</Button>
        </HoverCardTrigger>
        <HoverCardContent>{body}</HoverCardContent>
      </HoverCard>
    );
  }
  if (fixture.family === "dropdown-menu") {
    const {
      children,
      items,
      options,
      defaultOpen: _defaultOpen,
      ...rest
    } = fixture.props as {
      children?: string;
      items?: unknown;
      options?: unknown;
      defaultOpen?: boolean;
    };
    const trigger = typeof children === "string" ? children : "Actions";
    const entries = stringList(items ?? options);
    return (
      <DropdownMenu {...rest} defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button>{trigger}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {entries.map((item) => (
            <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  if (fixture.family === "collapsible") {
    const {
      children,
      options,
      items,
      defaultOpen: _defaultOpen,
      ...rest
    } = fixture.props as {
      children?: string;
      options?: unknown;
      items?: unknown;
      defaultOpen?: boolean;
    };
    const trigger = typeof children === "string" ? children : "Toggle";
    const body = stringList(options ?? items)[0] ?? trigger;
    return (
      <Collapsible {...rest} defaultOpen>
        <CollapsibleTrigger>{trigger}</CollapsibleTrigger>
        <CollapsibleContent>{body}</CollapsibleContent>
      </Collapsible>
    );
  }
  if (fixture.family === "mode-toggle") {
    const { mode, "aria-label": ariaLabel } = fixture.props as {
      mode?: string;
      "aria-label"?: string;
    };
    return (
      <ModeToggleFixture
        mode={mode}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
      />
    );
  }
  if (fixture.family === "command") {
    const {
      placeholder,
      items,
      options,
      label,
      className,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      placeholder?: string;
      items?: unknown;
      options?: unknown;
      label?: string;
      className?: string;
      "aria-label"?: string;
    };
    const entries = stringList(items ?? options);
    const accessible =
      typeof label === "string" ? label : typeof ariaLabel === "string" ? ariaLabel : undefined;
    return (
      <Command
        {...rest}
        className={typeof className === "string" ? className : "h-48 w-72"}
        label={accessible}
      >
        <CommandInput placeholder={placeholder} />
        <CommandList>
          {entries.map((item) => (
            <CommandItem key={item}>{item}</CommandItem>
          ))}
        </CommandList>
      </Command>
    );
  }
  if (fixture.family === "menubar") {
    const {
      children,
      items,
      options,
      defaultOpen: _defaultOpen,
      ...rest
    } = fixture.props as {
      children?: string;
      items?: unknown;
      options?: unknown;
      defaultOpen?: boolean;
    };
    const trigger = typeof children === "string" ? children : "File";
    const entries = stringList(items ?? options);
    return (
      <Menubar {...rest} defaultValue="file">
        <MenubarMenu value="file">
          <MenubarTrigger>{trigger}</MenubarTrigger>
          <MenubarContent>
            {entries.map((item) => (
              <MenubarItem key={item}>{item}</MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  }
  if (fixture.family === "context-menu") {
    const {
      children,
      items,
      options,
      open: _open,
      defaultOpen: _defaultOpen,
      ...rest
    } = fixture.props as {
      children?: string;
      items?: unknown;
      options?: unknown;
      open?: boolean;
      defaultOpen?: boolean;
    };
    const trigger = typeof children === "string" ? children : "Right click";
    const entries = stringList(items ?? options);
    return (
      <ContextMenu {...rest} open>
        <ContextMenuTrigger>{trigger}</ContextMenuTrigger>
        <ContextMenuContent>
          {entries.map((item) => (
            <ContextMenuItem key={item}>{item}</ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    );
  }
  if (fixture.family === "drawer") {
    const {
      title,
      description,
      children,
      defaultOpen: _defaultOpen,
      items: _items,
      options: _options,
      ...rest
    } = fixture.props as {
      title?: string;
      description?: string;
      children?: string;
      defaultOpen?: boolean;
      items?: unknown;
      options?: unknown;
    };
    const heading =
      typeof title === "string" ? title : typeof children === "string" ? children : fixture.id;
    return (
      <Drawer {...rest} defaultOpen shouldScaleBackground={false}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{heading}</DrawerTitle>
            {typeof description === "string" ? (
              <DrawerDescription>{description}</DrawerDescription>
            ) : null}
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
  }
  if (fixture.family === "sheet") {
    const {
      title,
      description,
      children,
      defaultOpen: _defaultOpen,
      items: _items,
      options: _options,
      ...rest
    } = fixture.props as {
      title?: string;
      description?: string;
      children?: string;
      defaultOpen?: boolean;
      items?: unknown;
      options?: unknown;
    };
    const heading =
      typeof title === "string" ? title : typeof children === "string" ? children : fixture.id;
    return (
      <Sheet {...rest} defaultOpen>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{heading}</SheetTitle>
            {typeof description === "string" ? (
              <SheetDescription>{description}</SheetDescription>
            ) : null}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }
  if (fixture.family === "calendar") {
    const { defaultMonth } = fixture.props as { defaultMonth?: string };
    return <CalendarFixture defaultMonth={defaultMonth} />;
  }
  if (fixture.family === "date-picker") {
    const {
      placeholder,
      value,
      "aria-label": ariaLabel,
    } = fixture.props as {
      placeholder?: string;
      value?: string;
      "aria-label"?: string;
    };
    return (
      <DatePickerFixture
        placeholder={placeholder}
        value={typeof value === "string" ? value : undefined}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
      />
    );
  }
  if (fixture.family === "time-picker") {
    const {
      value,
      placeholder,
      hourCycle,
      "aria-label": ariaLabel,
      items: _items,
      options: _options,
      ...rest
    } = fixture.props as {
      value?: string;
      placeholder?: string;
      hourCycle?: 12 | 24;
      "aria-label"?: string;
      items?: unknown;
      options?: unknown;
    };
    return (
      <TimePicker
        value={typeof value === "string" ? value : undefined}
        placeholder={placeholder}
        hourCycle={hourCycle === 24 ? 24 : hourCycle === 12 ? 12 : undefined}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
        {...rest}
      />
    );
  }
  if (fixture.family === "date-range-picker") {
    const {
      placeholder,
      "aria-label": ariaLabel,
      items: _items,
      options: _options,
      value: _value,
      defaultValue: _defaultValue,
      ...rest
    } = fixture.props as {
      placeholder?: string;
      "aria-label"?: string;
      items?: unknown;
      options?: unknown;
      value?: unknown;
      defaultValue?: unknown;
    };
    return (
      <DateRangePicker
        placeholder={placeholder}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
        {...rest}
      />
    );
  }
  if (fixture.family === "area-chart") {
    return <AreaChartFixture />;
  }
  if (fixture.family === "bar-chart") {
    return <BarChartFixture />;
  }
  if (fixture.family === "line-chart") {
    return <LineChartFixture />;
  }
  if (fixture.family === "sparkline") {
    const { data, "aria-label": ariaLabel } = fixture.props as {
      data?: unknown;
      "aria-label"?: string;
    };
    return (
      <SparklineFixture
        data={data}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
      />
    );
  }
  if (fixture.family === "pie-chart") {
    return <PieChartFixture />;
  }
  if (fixture.family === "data-table") {
    return <DataTableFixture />;
  }
  if (fixture.family === "sidebar") {
    const { items, options } = fixture.props as {
      items?: unknown;
      options?: unknown;
    };
    return <SidebarFixture items={stringList(items ?? options)} />;
  }
  if (fixture.family === "sonner") {
    return <Toaster />;
  }
  if (fixture.family === "navigation-menu") {
    const {
      children,
      items,
      options,
      defaultOpen: _defaultOpen,
      ...rest
    } = fixture.props as {
      children?: string;
      items?: unknown;
      options?: unknown;
      defaultOpen?: boolean;
    };
    const trigger = typeof children === "string" ? children : "Products";
    const entries = stringList(items ?? options);
    return (
      <NavigationMenu {...rest}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{trigger}</NavigationMenuTrigger>
          </NavigationMenuItem>
          {entries.map((item) => (
            <NavigationMenuItem key={item}>
              <NavigationMenuTrigger>{item}</NavigationMenuTrigger>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    );
  }
  if (fixture.family === "radar-chart") {
    return <RadarChartFixture />;
  }
  if (fixture.family === "scatter-chart") {
    return <ScatterChartFixture />;
  }
  if (fixture.family === "ring-chart") {
    return <RingChartFixture />;
  }
  if (fixture.family === "phone-input") {
    const {
      value,
      "aria-label": ariaLabel,
      items: _items,
      options: _options,
      ...rest
    } = fixture.props as {
      value?: string;
      "aria-label"?: string;
      items?: unknown;
      options?: unknown;
    };
    return (
      <PhoneInput
        defaultValue={typeof value === "string" ? value : undefined}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "Phone number"}
        {...rest}
      />
    );
  }
  if (fixture.family === "currency-input") {
    const {
      value,
      "aria-label": ariaLabel,
      items: _items,
      options: _options,
      ...rest
    } = fixture.props as {
      value?: number;
      "aria-label"?: string;
      items?: unknown;
      options?: unknown;
    };
    return (
      <CurrencyInput
        defaultValue={typeof value === "number" ? value : undefined}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "Amount"}
        {...rest}
      />
    );
  }
  if (fixture.family === "color-picker") {
    const { value, "aria-label": ariaLabel } = fixture.props as {
      value?: string;
      "aria-label"?: string;
    };
    return (
      <ColorPickerFixture
        defaultValue={typeof value === "string" ? value : undefined}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
      />
    );
  }
  if (fixture.family === "scroll-area") {
    const {
      items,
      options,
      className,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      className?: string;
      "aria-label"?: string;
    };
    const labels = stringList(items ?? options);
    const rows = labels.length >= 8 ? labels : FALLBACK_SCROLL_ITEMS;
    return (
      <ScrollArea
        className={typeof className === "string" ? className : "h-32 w-48"}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-scroll-area"}
        {...rest}
      >
        <div className="flex flex-col gap-1 p-2">
          {rows.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </ScrollArea>
    );
  }
  if (fixture.family === "toolbar") {
    const {
      items,
      options,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      "aria-label"?: string;
    };
    const labels = stringList(items ?? options);
    const buttons = labels.length > 0 ? labels : ["Bold", "Italic"];
    return (
      <Toolbar aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-toolbar"} {...rest}>
        {buttons.map((item) => (
          <ToolbarButton key={item}>{item}</ToolbarButton>
        ))}
      </Toolbar>
    );
  }
  if (fixture.family === "status-dot") {
    const { status, ...rest } = fixture.props as {
      status?:
        | "online"
        | "offline"
        | "busy"
        | "away"
        | "success"
        | "warning"
        | "error"
        | "info"
        | "neutral";
    };
    return <StatusDot status={status ?? "online"} {...rest} />;
  }
  if (fixture.family === "tags-input") {
    const {
      items,
      options,
      value,
      placeholder,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      value?: unknown;
      placeholder?: string;
      "aria-label"?: string;
    };
    const tags = stringList(items ?? options ?? (Array.isArray(value) ? value : undefined));
    return (
      <TagsInput
        defaultValue={tags}
        placeholder={placeholder}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "Tags"}
        {...rest}
      />
    );
  }
  if (fixture.family === "autocomplete") {
    const {
      options,
      items,
      placeholder,
      value,
      open: _open,
      defaultOpen: _defaultOpen,
      "aria-label": ariaLabel,
    } = fixture.props as {
      options?: unknown;
      items?: unknown;
      placeholder?: string;
      value?: string;
      open?: boolean;
      defaultOpen?: boolean;
      "aria-label"?: string;
    };
    return (
      <AutocompleteFixture
        options={stringList(options ?? items)}
        placeholder={placeholder}
        defaultValue={typeof value === "string" ? value : undefined}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
      />
    );
  }
  if (fixture.family === "multi-select") {
    const {
      options,
      items,
      placeholder,
      defaultOpen: _defaultOpen,
      open: _open,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      options?: unknown;
      items?: unknown;
      placeholder?: string;
      defaultOpen?: boolean;
      open?: boolean;
      "aria-label"?: string;
    };
    const labels = stringList(options ?? items);
    return (
      <MultiSelect
        options={labels.map((item) => ({ label: item, value: item }))}
        placeholder={placeholder}
        defaultOpen
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-multi-select"}
        {...rest}
      />
    );
  }
  if (fixture.family === "credit-card-input") {
    const {
      value,
      label,
      onChange: _onChange,
      items: _items,
      options: _options,
      ...rest
    } = fixture.props as {
      value?: string;
      label?: string;
      onChange?: unknown;
      items?: unknown;
      options?: unknown;
    };
    return (
      <CreditCardInput
        defaultNumber={typeof value === "string" ? value : undefined}
        label={typeof label === "string" ? label : "Credit card"}
        {...rest}
      />
    );
  }
  if (fixture.family === "floating-label-input") {
    const {
      label,
      value,
      items: _items,
      options: _options,
      ...rest
    } = fixture.props as {
      label?: string;
      value?: string;
      items?: unknown;
      options?: unknown;
    };
    return (
      <FloatingLabelInput
        label={typeof label === "string" ? label : fixture.id}
        defaultValue={typeof value === "string" ? value : undefined}
        {...rest}
      />
    );
  }
  if (fixture.family === "split-button") {
    const {
      children,
      items,
      options,
      defaultOpen: _defaultOpen,
      onClick: _onClick,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      children?: string;
      items?: unknown;
      options?: unknown;
      defaultOpen?: boolean;
      onClick?: unknown;
      "aria-label"?: string;
    };
    const labels = stringList(items ?? options);
    return (
      <SplitButton
        defaultOpen
        items={labels.map((item) => ({ id: item, label: item }))}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
        {...rest}
      >
        {typeof children === "string" ? children : "Save"}
      </SplitButton>
    );
  }
  if (fixture.family === "pill-nav") {
    const {
      items,
      options,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      "aria-label"?: string;
    };
    const labels = stringList(items ?? options);
    const entries = labels.length > 0 ? labels : ["Home", "Work"];
    return (
      <PillNav
        items={entries.map((item) => ({ value: item, label: item }))}
        defaultValue={entries[0]}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-pill-nav"}
        {...rest}
      />
    );
  }
  if (fixture.family === "dock") {
    const {
      items,
      options,
      "aria-label": ariaLabel,
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      "aria-label"?: string;
    };
    return (
      <DockFixture
        items={stringList(items ?? options)}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
      />
    );
  }
  if (fixture.family === "workspace-switcher") {
    const { items, options } = fixture.props as {
      items?: unknown;
      options?: unknown;
    };
    return <WorkspaceSwitcherFixture items={stringList(items ?? options)} />;
  }
  if (fixture.family === "app-shell") {
    const { items, options, title } = fixture.props as {
      items?: unknown;
      options?: unknown;
      title?: string;
    };
    return (
      <AppShellFixture
        items={stringList(items ?? options)}
        title={typeof title === "string" ? title : undefined}
      />
    );
  }
  if (fixture.family === "table-of-contents") {
    const {
      items,
      options,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      "aria-label"?: string;
    };
    const labels = stringList(items ?? options);
    const entries = labels.length > 0 ? labels : ["Overview", "Usage"];
    return (
      <TableOfContents
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "On this page"}
        items={entries.map((label) => ({
          id: label.toLowerCase().replaceAll(/\s+/g, "-"),
          label,
        }))}
        {...rest}
      />
    );
  }
  if (fixture.family === "form") {
    const {
      label,
      placeholder,
      items: _items,
      options: _options,
    } = fixture.props as {
      label?: string;
      placeholder?: string;
      items?: unknown;
      options?: unknown;
    };
    const heading = typeof label === "string" ? label : fixture.id;
    return (
      <form data-slot="form">
        <FormItem>
          <Label htmlFor="audit-form-control">{heading}</Label>
          <Input id="audit-form-control" placeholder={placeholder} />
        </FormItem>
      </form>
    );
  }
  if (fixture.family === "signature-pad") {
    const {
      onChange: _onChange,
      "aria-label": ariaLabel,
      items: _items,
      options: _options,
      ...rest
    } = fixture.props as {
      onChange?: unknown;
      "aria-label"?: string;
      items?: unknown;
      options?: unknown;
    };
    return (
      <SignaturePad
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "Signature pad"}
        {...rest}
      />
    );
  }
  if (fixture.family === "resizable") {
    const {
      items,
      options,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      "aria-label"?: string;
    };
    const labels = stringList(items ?? options);
    const panes = labels.length >= 2 ? labels : ["One", "Two"];
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="h-32 w-72"
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "Panels"}
        {...rest}
      >
        <ResizablePanel defaultSize={50}>{panes[0]}</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>{panes[1]}</ResizablePanel>
      </ResizablePanelGroup>
    );
  }
  if (fixture.family === "scheduler") {
    const { items, options, defaultMonth } = fixture.props as {
      items?: unknown;
      options?: unknown;
      defaultMonth?: string;
    };
    return (
      <SchedulerFixture
        items={stringList(items ?? options)}
        defaultMonth={typeof defaultMonth === "string" ? defaultMonth : undefined}
      />
    );
  }
  if (fixture.family === "alert-dialog") {
    const {
      title,
      children,
      items,
      options,
      defaultOpen: _defaultOpen,
      ...rest
    } = fixture.props as {
      title?: string;
      children?: string;
      items?: unknown;
      options?: unknown;
      defaultOpen?: boolean;
    };
    const heading = typeof title === "string" ? title : fixture.id;
    const action =
      stringList(items ?? options)[0] ?? (typeof children === "string" ? children : "Confirm");
    return (
      <AlertDialog {...rest} defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>{heading}</AlertDialogTitle>
          <AlertDialogAction>{action}</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  if (fixture.family === "lightbox") {
    const { items, options } = fixture.props as {
      items?: unknown;
      options?: unknown;
    };
    return <LightboxFixture items={stringList(items ?? options)} />;
  }
  if (fixture.family === "notification-center") {
    const { items, options, title } = fixture.props as {
      items?: unknown;
      options?: unknown;
      title?: string;
    };
    return (
      <NotificationCenterFixture
        items={stringList(items ?? options)}
        title={typeof title === "string" ? title : undefined}
      />
    );
  }
  if (fixture.family === "segmented-control") {
    const {
      items,
      options,
      value,
      defaultValue,
      onValueChange: _onValueChange,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      value?: string;
      defaultValue?: string;
      onValueChange?: unknown;
      "aria-label"?: string;
    };
    const labels = stringList(items ?? options);
    const entries = labels.length > 0 ? labels : ["Day", "Week"];
    const selected =
      typeof value === "string"
        ? value
        : typeof defaultValue === "string"
          ? defaultValue
          : entries[0];
    return (
      <SegmentedControl
        defaultValue={selected}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-segmented-control"}
        {...rest}
      >
        {entries.map((item) => (
          <SegmentedControlItem key={item} value={item}>
            {item}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    );
  }
  if (fixture.family === "usage-meter") {
    const {
      value,
      max,
      label,
      formatValue: _formatValue,
      items: _items,
      options: _options,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      value?: number;
      max?: number;
      label?: string;
      formatValue?: unknown;
      items?: unknown;
      options?: unknown;
      "aria-label"?: string;
    };
    return (
      <UsageMeter
        value={typeof value === "number" ? value : 40}
        max={typeof max === "number" ? max : 100}
        label={typeof label === "string" ? label : undefined}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-usage-meter"}
        {...rest}
      />
    );
  }
  if (fixture.family === "masonry") {
    const {
      items,
      options,
      columns,
      className,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      columns?: number;
      className?: string;
      "aria-label"?: string;
    };
    const labels = stringList(items ?? options);
    const cards = labels.length > 0 ? labels : ["Alpha", "Beta", "Gamma", "Delta"];
    return (
      <Masonry
        columns={typeof columns === "number" ? columns : 2}
        className={typeof className === "string" ? className : "w-72"}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-masonry"}
        {...rest}
      >
        {cards.map((item) => (
          <div key={item} className="rounded-lg border border-border bg-surface-raised p-3 text-sm">
            {item}
          </div>
        ))}
      </Masonry>
    );
  }
  if (fixture.family === "heatmap") {
    const { data, "aria-label": ariaLabel } = fixture.props as {
      data?: unknown;
      "aria-label"?: string;
    };
    return (
      <HeatmapFixture
        data={data}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
      />
    );
  }
  if (fixture.family === "comparison-slider") {
    const {
      items,
      options,
      onPositionChange: _onPositionChange,
      "aria-label": ariaLabel,
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      onPositionChange?: unknown;
      "aria-label"?: string;
    };
    return (
      <ComparisonSliderFixture
        items={stringList(items ?? options)}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
      />
    );
  }
  if (fixture.family === "code-tabs") {
    const {
      items,
      options,
      defaultLabel,
      onLabelChange: _onLabelChange,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      defaultLabel?: string;
      onLabelChange?: unknown;
      "aria-label"?: string;
    };
    const labels = stringList(items ?? options);
    const tabs = labels.length > 0 ? labels : ["bun", "npm"];
    return (
      <CodeTabs
        defaultLabel={typeof defaultLabel === "string" ? defaultLabel : tabs[0]}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-code-tabs"}
        items={tabs.map((label) => ({
          label,
          code: `${label} install`,
          language: "bash",
        }))}
        {...rest}
      />
    );
  }
  if (fixture.family === "expandable-tabs") {
    const {
      items,
      options,
      onValueChange: _onValueChange,
      "aria-label": ariaLabel,
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      onValueChange?: unknown;
      "aria-label"?: string;
    };
    return (
      <ExpandableTabsFixture
        items={stringList(items ?? options)}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
      />
    );
  }
  if (fixture.family === "live-line-chart") {
    return <LiveLineChartFixture />;
  }
  if (fixture.family === "sunburst-chart") {
    return <SunburstChartFixture />;
  }
  if (fixture.family === "choropleth-chart") {
    return <ChoroplethChartFixture />;
  }
  if (fixture.family === "profit-loss-chart") {
    return <ProfitLossChartFixture />;
  }
  if (fixture.family === "scroll-progress") {
    const { value, "aria-label": ariaLabel } = fixture.props as {
      value?: number;
      "aria-label"?: string;
    };
    return (
      <ScrollProgressFixture
        value={typeof value === "number" ? value : undefined}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
      />
    );
  }
  if (fixture.family === "rich-text-editor") {
    const {
      onChange: _onChange,
      placeholder,
      defaultValue,
      value,
      "aria-label": ariaLabel,
      items: _items,
      options: _options,
      ...rest
    } = fixture.props as {
      onChange?: unknown;
      placeholder?: string;
      defaultValue?: string;
      value?: string;
      "aria-label"?: string;
      items?: unknown;
      options?: unknown;
    };
    return (
      <RichTextEditor
        placeholder={placeholder}
        defaultValue={typeof defaultValue === "string" ? defaultValue : undefined}
        value={typeof value === "string" ? value : undefined}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "Post body"}
        {...rest}
      />
    );
  }
  if (fixture.family === "confirmation-dialog") {
    const {
      title,
      children,
      onConfirm: _onConfirm,
      onOpenChange: _onOpenChange,
      defaultOpen: _defaultOpen,
      open: _open,
      trigger: _trigger,
      items: _items,
      options: _options,
      ...rest
    } = fixture.props as {
      title?: string;
      children?: string;
      onConfirm?: unknown;
      onOpenChange?: unknown;
      defaultOpen?: boolean;
      open?: boolean;
      trigger?: unknown;
      items?: unknown;
      options?: unknown;
    };
    const heading =
      typeof title === "string" ? title : typeof children === "string" ? children : fixture.id;
    return <ConfirmationDialog {...rest} defaultOpen title={heading} />;
  }
  if (fixture.family === "invite-dialog") {
    const {
      onInvite: _onInvite,
      onOpenChange: _onOpenChange,
      open: _open,
      defaultOpen: _defaultOpen,
      trigger: _trigger,
      label: _label,
      items: _items,
      options: _options,
      ...rest
    } = fixture.props as {
      onInvite?: unknown;
      onOpenChange?: unknown;
      open?: boolean;
      defaultOpen?: boolean;
      trigger?: unknown;
      label?: string;
      items?: unknown;
      options?: unknown;
    };
    return <InviteDialog {...rest} open />;
  }
  if (fixture.family === "shimmer") {
    const { className, children, ...rest } = fixture.props as {
      className?: string;
      children?: string;
    };
    return (
      <Shimmer className={typeof className === "string" ? className : "h-8 w-48"} {...rest}>
        {typeof children === "string" ? children : null}
      </Shimmer>
    );
  }
  if (fixture.family === "reveal") {
    const { children, ...rest } = fixture.props as { children?: string };
    return <Reveal {...rest}>{typeof children === "string" ? children : fixture.id}</Reveal>;
  }
  if (fixture.family === "text-shimmer") {
    const { children, ...rest } = fixture.props as { children?: string };
    return (
      <TextShimmer {...rest}>{typeof children === "string" ? children : fixture.id}</TextShimmer>
    );
  }
  if (fixture.family === "particles") {
    const { children, className, ...rest } = fixture.props as {
      children?: string;
      className?: string;
    };
    return (
      <Particles className={typeof className === "string" ? className : "h-32 w-72"} {...rest}>
        {typeof children === "string" ? children : fixture.id}
      </Particles>
    );
  }
  if (fixture.family === "sparkles-text") {
    const { children, ...rest } = fixture.props as { children?: string };
    return (
      <SparklesText {...rest}>{typeof children === "string" ? children : fixture.id}</SparklesText>
    );
  }
  if (fixture.family === "noise") {
    const { children, className, ...rest } = fixture.props as {
      children?: string;
      className?: string;
    };
    return (
      <Noise className={typeof className === "string" ? className : "h-32 w-72"} {...rest}>
        {typeof children === "string" ? children : fixture.id}
      </Noise>
    );
  }
  if (fixture.family === "morphing-popover") {
    const {
      children,
      options,
      items,
      defaultOpen: _defaultOpen,
      open: _open,
      onOpenChange: _onOpenChange,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      children?: string;
      options?: unknown;
      items?: unknown;
      defaultOpen?: boolean;
      open?: boolean;
      onOpenChange?: unknown;
      "aria-label"?: string;
    };
    const trigger = typeof children === "string" ? children : "Open";
    const body = stringList(options ?? items)[0] ?? trigger;
    return (
      <MorphingPopover {...rest} open>
        <MorphingPopoverTrigger>{trigger}</MorphingPopoverTrigger>
        <MorphingPopoverContent aria-label={typeof ariaLabel === "string" ? ariaLabel : "Details"}>
          {body}
        </MorphingPopoverContent>
      </MorphingPopover>
    );
  }
  if (fixture.family === "bouncy-accordion") {
    const {
      items,
      options,
      defaultValue,
      onValueChange: _onValueChange,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      defaultValue?: string | null;
      onValueChange?: unknown;
    };
    const labels = stringList(items ?? options);
    const entries = labels.length > 0 ? labels : ["Type", "Schedule"];
    const selected = typeof defaultValue === "string" ? defaultValue : entries[0];
    return (
      <BouncyAccordion
        items={entries.map((title) => ({ id: title, title, description: title }))}
        defaultValue={selected}
        {...rest}
      />
    );
  }
  if (fixture.family === "typing-text") {
    const { text, children, items, options, ...rest } = fixture.props as {
      text?: string | string[];
      children?: string;
      items?: unknown;
      options?: unknown;
    };
    const phrases = Array.isArray(text)
      ? text.filter((phrase): phrase is string => typeof phrase === "string")
      : typeof text === "string"
        ? [text]
        : stringList(items ?? options);
    const phrase = phrases[0] ?? (typeof children === "string" ? children : "Shipping");
    return <TypingText {...rest} text={phrase} reducedMotion="never" />;
  }
  if (fixture.family === "word-rotate") {
    const {
      words,
      items,
      options,
      children: _children,
      ...rest
    } = fixture.props as {
      words?: unknown;
      items?: unknown;
      options?: unknown;
      children?: string;
    };
    const list = stringList(words ?? items ?? options);
    return <WordRotate words={list.length > 0 ? list : ["Design", "System"]} {...rest} />;
  }
  if (fixture.family === "timeline") {
    const {
      items,
      options,
      children: _children,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      children?: string;
    };
    const labels = stringList(items ?? options);
    const entries = labels.length > 0 ? labels : ["Order placed", "Order shipped"];
    return (
      <Timeline {...rest}>
        {entries.map((item) => (
          <TimelineItem key={item}>
            <TimelineContent>
              <TimelineTitle>{item}</TimelineTitle>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    );
  }
  if (fixture.family === "tree-view") {
    const {
      items,
      options,
      onValueChange: _onValueChange,
      onExpandedChange: _onExpandedChange,
      "aria-label": ariaLabel,
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      onValueChange?: unknown;
      onExpandedChange?: unknown;
      "aria-label"?: string;
    };
    return (
      <TreeViewFixture
        items={stringList(items ?? options)}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
      />
    );
  }
  if (fixture.family === "tilt-card") {
    const {
      children,
      onMouseMove: _onMouseMove,
      onMouseEnter: _onMouseEnter,
      onMouseLeave: _onMouseLeave,
      ...rest
    } = fixture.props as {
      children?: string;
      onMouseMove?: unknown;
      onMouseEnter?: unknown;
      onMouseLeave?: unknown;
    };
    return <TiltCard {...rest}>{typeof children === "string" ? children : fixture.id}</TiltCard>;
  }
  if (fixture.family === "star-border") {
    const { children, ...rest } = fixture.props as { children?: string };
    return (
      <StarBorder {...rest}>{typeof children === "string" ? children : fixture.id}</StarBorder>
    );
  }
  if (fixture.family === "glass-card") {
    const { children, ...rest } = fixture.props as { children?: string };
    return <GlassCard {...rest}>{typeof children === "string" ? children : fixture.id}</GlassCard>;
  }
  if (fixture.family === "terminal") {
    const {
      items,
      options,
      title,
      children: _children,
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      title?: string;
      children?: string;
    };
    return (
      <TerminalFixture
        items={stringList(items ?? options)}
        title={typeof title === "string" ? title : undefined}
      />
    );
  }
  if (fixture.family === "video-player") {
    const {
      src,
      poster,
      children: _children,
      items: _items,
      options: _options,
      onPlay: _onPlay,
      onPause: _onPause,
      ...rest
    } = fixture.props as {
      src?: string;
      poster?: string;
      children?: string;
      items?: unknown;
      options?: unknown;
      onPlay?: unknown;
      onPause?: unknown;
    };
    return (
      <VideoPlayer
        src={typeof src === "string" ? src : "/audit-video.mp4"}
        poster={typeof poster === "string" ? poster : undefined}
        {...rest}
      />
    );
  }
  if (fixture.family === "text-effect") {
    const { children, ...rest } = fixture.props as { children?: string };
    return (
      <TextEffect {...rest} trigger="mount" reducedMotion="always">
        {typeof children === "string" ? children : fixture.id}
      </TextEffect>
    );
  }
  if (fixture.family === "spotlight-card") {
    const {
      children,
      onMouseMove: _onMouseMove,
      onMouseEnter: _onMouseEnter,
      onMouseLeave: _onMouseLeave,
      ...rest
    } = fixture.props as {
      children?: string;
      onMouseMove?: unknown;
      onMouseEnter?: unknown;
      onMouseLeave?: unknown;
    };
    return (
      <SpotlightCard {...rest}>
        {typeof children === "string" ? children : fixture.id}
      </SpotlightCard>
    );
  }
  if (fixture.family === "animated-list") {
    const {
      items,
      options,
      children: _children,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      children?: string;
    };
    const labels = stringList(items ?? options);
    const entries = labels.length > 0 ? labels : ["Alpha", "Beta"];
    return (
      <AnimatedList {...rest} reducedMotion="always">
        {entries.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </AnimatedList>
    );
  }
  if (fixture.family === "toast") {
    const { children } = fixture.props as { children?: string };
    return <ToastFixture>{typeof children === "string" ? children : "Saved"}</ToastFixture>;
  }
  if (fixture.family === "carousel") {
    const {
      items,
      options,
      labels: _labels,
      children: _children,
      className,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      labels?: unknown;
      children?: string;
      className?: string;
      "aria-label"?: string;
    };
    const slides = stringList(items ?? options);
    const entries = slides.length > 0 ? slides : ["One", "Two"];
    return (
      <Carousel
        className={typeof className === "string" ? className : "w-72"}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-carousel"}
        {...rest}
      >
        <CarouselContent>
          {entries.map((item) => (
            <CarouselItem key={item}>
              <div className="rounded-lg border border-border bg-surface-raised p-6 text-sm">
                {item}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-3 flex items-center justify-center gap-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    );
  }
  if (fixture.family === "code-block") {
    const {
      code,
      children,
      language,
      filename,
      items: _items,
      options: _options,
      className,
      ...rest
    } = fixture.props as {
      code?: string;
      children?: string;
      language?: string;
      filename?: string;
      items?: unknown;
      options?: unknown;
      className?: string;
    };
    const snippet =
      typeof code === "string" ? code : typeof children === "string" ? children : "const n = 1;";
    return (
      <CodeBlock
        code={snippet}
        language={typeof language === "string" ? language : undefined}
        filename={typeof filename === "string" ? filename : undefined}
        className={typeof className === "string" ? className : "w-72"}
        {...rest}
      />
    );
  }
  if (fixture.family === "description-list") {
    const {
      items,
      options,
      children: _children,
      className,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      children?: string;
      className?: string;
      "aria-label"?: string;
    };
    const pairs = stringPairs(items ?? options);
    const entries = pairs.length > 0 ? pairs : stringPairs(["Name", "Ada", "Status", "Paid"]);
    return (
      <DescriptionList
        className={typeof className === "string" ? className : "w-72"}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-description-list"}
        {...rest}
      >
        {entries.map(([term, details]) => (
          <DescriptionItem key={term} term={term}>
            {details}
          </DescriptionItem>
        ))}
      </DescriptionList>
    );
  }
  if (fixture.family === "kanban") {
    const {
      items,
      options,
      onColumnsChange: _onColumnsChange,
      renderItem: _renderItem,
      "aria-label": ariaLabel,
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      onColumnsChange?: unknown;
      renderItem?: unknown;
      "aria-label"?: string;
    };
    return (
      <KanbanFixture
        items={stringList(items ?? options)}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
      />
    );
  }
  if (fixture.family === "json-viewer") {
    const {
      data,
      items: _items,
      options: _options,
      children: _children,
      className,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      data?: unknown;
      items?: unknown;
      options?: unknown;
      children?: string;
      className?: string;
      "aria-label"?: string;
    };
    const payload =
      data !== undefined && data !== null && typeof data === "object" && !Array.isArray(data)
        ? data
        : { name: "Ada", ok: true };
    return (
      <JsonViewer
        data={payload}
        className={typeof className === "string" ? className : "w-72"}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "audit-json-viewer"}
        {...rest}
      />
    );
  }
  if (fixture.family === "animated-number") {
    const {
      value,
      format: _format,
      locale: _locale,
      reducedMotion: _reducedMotion,
      items: _items,
      options: _options,
      children: _children,
      ...rest
    } = fixture.props as {
      value?: number;
      format?: unknown;
      locale?: string;
      reducedMotion?: unknown;
      items?: unknown;
      options?: unknown;
      children?: string;
    };
    return (
      <AnimatedNumber
        value={typeof value === "number" ? value : 1234}
        locale="en-US"
        reducedMotion="always"
        {...rest}
      />
    );
  }
  if (fixture.family === "marquee") {
    const {
      items,
      options,
      children: _children,
      className,
      motionPreference: _motionPreference,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      children?: string;
      className?: string;
      motionPreference?: unknown;
    };
    const labels = stringList(items ?? options);
    const entries = labels.length > 0 ? labels : ["Acme", "Globex"];
    return (
      <Marquee
        className={typeof className === "string" ? className : "w-72"}
        motionPreference="never"
        {...rest}
      >
        {entries.map((item) => (
          <span key={item} className="px-3 text-sm">
            {item}
          </span>
        ))}
      </Marquee>
    );
  }
  if (fixture.family === "gradient-text") {
    const { children, ...rest } = fixture.props as { children?: string };
    return (
      <GradientText {...rest}>{typeof children === "string" ? children : fixture.id}</GradientText>
    );
  }
  if (fixture.family === "shiny-text") {
    const { children, ...rest } = fixture.props as { children?: string };
    return <ShinyText {...rest}>{typeof children === "string" ? children : fixture.id}</ShinyText>;
  }
  if (fixture.family === "aspect-ratio") {
    const { children, ratio, className, ...rest } = fixture.props as {
      children?: string;
      ratio?: number;
      className?: string;
    };
    return (
      <AspectRatio
        ratio={typeof ratio === "number" ? ratio : undefined}
        className={typeof className === "string" ? className : "w-72"}
        {...rest}
      >
        {typeof children === "string" ? children : fixture.id}
      </AspectRatio>
    );
  }
  if (fixture.family === "frame") {
    const { children, url, variant, className, ...rest } = fixture.props as {
      children?: string;
      url?: string;
      variant?: "browser" | "window";
      className?: string;
    };
    return (
      <Frame
        url={typeof url === "string" ? url : undefined}
        variant={variant}
        className={typeof className === "string" ? className : "w-72"}
        {...rest}
      >
        {typeof children === "string" ? children : fixture.id}
      </Frame>
    );
  }
  if (fixture.family === "flip-card") {
    const {
      children,
      items,
      options,
      onFlippedChange: _onFlippedChange,
      className,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      children?: string;
      items?: unknown;
      options?: unknown;
      onFlippedChange?: unknown;
      className?: string;
      "aria-label"?: string;
    };
    const faces = stringList(items ?? options);
    const front = faces[0] ?? (typeof children === "string" ? children : "Front");
    const back = faces[1] ?? "Back";
    return (
      <FlipCard
        className={typeof className === "string" ? className : "w-72"}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : "Plan"}
        {...rest}
      >
        <FlipCardFront>{front}</FlipCardFront>
        <FlipCardBack>{back}</FlipCardBack>
      </FlipCard>
    );
  }
  if (fixture.family === "countdown") {
    const {
      target,
      onComplete: _onComplete,
      labels: _labels,
      ...rest
    } = fixture.props as {
      target?: string | number;
      onComplete?: unknown;
      labels?: unknown;
    };
    const deadline =
      typeof target === "string" || typeof target === "number"
        ? target
        : "2000-01-01T00:00:00.000Z";
    return <Countdown target={deadline} {...rest} />;
  }
  if (fixture.family === "animated-button") {
    const {
      children,
      asChild: _asChild,
      onDrag: _onDrag,
      onDragStart: _onDragStart,
      onDragEnd: _onDragEnd,
      onAnimationStart: _onAnimationStart,
      variant,
      size,
      disabled,
      ...rest
    } = fixture.props as {
      children?: string;
      asChild?: boolean;
      onDrag?: unknown;
      onDragStart?: unknown;
      onDragEnd?: unknown;
      onAnimationStart?: unknown;
      variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
      size?: "sm" | "md" | "lg" | "icon" | "icon-sm";
      disabled?: boolean;
    };
    return (
      <AnimatedButton variant={variant} size={size} disabled={disabled} {...rest}>
        {typeof children === "string" ? children : fixture.id}
      </AnimatedButton>
    );
  }
  if (fixture.family === "card-stack") {
    const {
      items,
      options,
      labels: _labels,
      children: _children,
      className,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      labels?: unknown;
      children?: string;
      className?: string;
    };
    const titles = stringList(items ?? options);
    const cards = (titles.length > 0 ? titles : ["One", "Two"]).map((item) => ({
      id: item,
      content: item,
    }));
    return (
      <CardStack
        items={cards}
        className={typeof className === "string" ? className : "w-72"}
        {...rest}
      />
    );
  }
  if (fixture.family === "gauge-chart") {
    const { value, label } = fixture.props as {
      value?: number;
      label?: string;
    };
    return (
      <GaugeChartFixture
        value={typeof value === "number" ? value : undefined}
        label={typeof label === "string" ? label : undefined}
      />
    );
  }
  if (fixture.family === "funnel-chart") {
    const { items, options } = fixture.props as {
      items?: unknown;
      options?: unknown;
    };
    return <FunnelChartFixture items={stringList(items ?? options)} />;
  }
  if (fixture.family === "candlestick-chart") {
    return <CandlestickChartFixture />;
  }
  if (fixture.family === "logo-carousel") {
    const {
      items,
      options,
      motionPreference: _motionPreference,
      className,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      motionPreference?: unknown;
      className?: string;
      "aria-label"?: string;
    };
    const labels = stringList(items ?? options);
    const logos = (labels.length > 0 ? labels : ["Acme", "Globex"]).map((item) => ({
      id: item,
      label: item,
    }));
    return (
      <LogoCarousel
        items={logos}
        className={typeof className === "string" ? className : "w-72"}
        ariaLabel={typeof ariaLabel === "string" ? ariaLabel : "Logos"}
        motionPreference="never"
        {...rest}
      />
    );
  }
  if (fixture.family === "dynamic-island") {
    const {
      items,
      options,
      onValueChange: _onValueChange,
      children: _children,
      ...rest
    } = fixture.props as {
      items?: unknown;
      options?: unknown;
      onValueChange?: unknown;
      children?: string;
    };
    const labels = stringList(items ?? options);
    const views = (labels.length > 0 ? labels : ["Idle", "Active"]).map((item) => ({
      id: item,
      label: item,
      content: item,
    }));
    return <DynamicIsland views={views} defaultValue={views[0]?.id} {...rest} />;
  }
  if (fixture.family === "image-zoom") {
    const {
      children,
      onZoomChange: _onZoomChange,
      labels: _labels,
      className,
      ...rest
    } = fixture.props as {
      children?: string;
      onZoomChange?: unknown;
      labels?: unknown;
      className?: string;
    };
    return (
      <ImageZoom className={typeof className === "string" ? className : "w-72"} {...rest}>
        {typeof children === "string" ? children : fixture.id}
      </ImageZoom>
    );
  }
  if (fixture.family === "aurora-background") {
    const { children, className, ...rest } = fixture.props as {
      children?: string;
      className?: string;
    };
    return (
      <AuroraBackground
        className={typeof className === "string" ? className : "w-72 min-h-32"}
        {...rest}
      >
        {typeof children === "string" ? children : fixture.id}
      </AuroraBackground>
    );
  }
  if (fixture.family === "border-beam") {
    const { children, className, ...rest } = fixture.props as {
      children?: string;
      className?: string;
    };
    return (
      <BorderBeam className={typeof className === "string" ? className : "w-72 p-6"} {...rest}>
        {typeof children === "string" ? children : fixture.id}
      </BorderBeam>
    );
  }
  if (fixture.family === "confetti") {
    const {
      children,
      className,
      onPointerDown: _onPointerDown,
      ...rest
    } = fixture.props as {
      children?: string;
      className?: string;
      onPointerDown?: unknown;
    };
    return (
      <Confetti className={typeof className === "string" ? className : "w-72 min-h-32"} {...rest}>
        {typeof children === "string" ? children : fixture.id}
      </Confetti>
    );
  }
  if (fixture.family === "composed-chart") {
    const { items, options } = fixture.props as {
      items?: unknown;
      options?: unknown;
    };
    return <ComposedChartFixture items={stringList(items ?? options)} />;
  }
  if (fixture.family === "heatmap-chart") {
    const { items, options, label } = fixture.props as {
      items?: unknown;
      options?: unknown;
      label?: string;
    };
    return (
      <HeatmapChartFixture
        items={stringList(items ?? options)}
        label={typeof label === "string" ? label : undefined}
      />
    );
  }
  if (fixture.family === "chart") {
    const { items, options } = fixture.props as {
      items?: unknown;
      options?: unknown;
    };
    return <ChartFixture items={stringList(items ?? options)} />;
  }
  throw new Error(`renderReactFixture: unported family ${fixture.family}`);
}

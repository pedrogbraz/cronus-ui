import { Alert, AlertDescription, AlertTitle } from "@cronus-ui/ui/alert";
import { Avatar, AvatarFallback } from "@cronus-ui/ui/avatar";
import { AvatarGroup } from "@cronus-ui/ui/avatar-group";
import { Badge } from "@cronus-ui/ui/badge";
import { Banner } from "@cronus-ui/ui/banner";
import { Button } from "@cronus-ui/ui/button";
import { ButtonGroup } from "@cronus-ui/ui/button-group";
import { Card, CardDescription, CardHeader, CardTitle } from "@cronus-ui/ui/card";
import { Checkbox } from "@cronus-ui/ui/checkbox";
import { Chip } from "@cronus-ui/ui/chip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@cronus-ui/ui/collapsible";
import { Combobox } from "@cronus-ui/ui/combobox";
import { CopyButton } from "@cronus-ui/ui/copy-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@cronus-ui/ui/dropdown-menu";
import { Empty, EmptyTitle } from "@cronus-ui/ui/empty";
import { Fab } from "@cronus-ui/ui/fab";
import { Field, FieldDescription, FieldLabel } from "@cronus-ui/ui/field";
import { FileDropzone } from "@cronus-ui/ui/file-dropzone";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@cronus-ui/ui/hover-card";
import { Input } from "@cronus-ui/ui/input";
import { InputGroup, InputGroupAddon } from "@cronus-ui/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@cronus-ui/ui/input-otp";
import { Kbd } from "@cronus-ui/ui/kbd";
import { Label } from "@cronus-ui/ui/label";
import { Metric, MetricLabel, MetricValue } from "@cronus-ui/ui/metric";
import { ModeToggle } from "@cronus-ui/ui/mode-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@cronus-ui/ui/popover";
import { Progress } from "@cronus-ui/ui/progress";
import { RadioGroup, RadioGroupItem } from "@cronus-ui/ui/radio-group";
import { Rating } from "@cronus-ui/ui/rating";
import { Separator } from "@cronus-ui/ui/separator";
import { Skeleton } from "@cronus-ui/ui/skeleton";
import { Slider } from "@cronus-ui/ui/slider";
import { Spinner } from "@cronus-ui/ui/spinner";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperTitle,
} from "@cronus-ui/ui/stepper";
import { Switch } from "@cronus-ui/ui/switch";
import { Textarea } from "@cronus-ui/ui/textarea";
import { Toggle } from "@cronus-ui/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@cronus-ui/ui/toggle-group";
import type { ReactElement } from "react";
import type { ParityFixture } from "./parity-fixture.js";

function stringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

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
    const {
      mode,
      onModeChange: _onModeChange,
      "aria-label": ariaLabel,
      ...rest
    } = fixture.props as {
      mode?: string;
      onModeChange?: unknown;
      "aria-label"?: string;
    };
    return (
      <ModeToggle
        mode={mode === "dark" ? "dark" : "light"}
        onModeChange={() => {}}
        aria-label={typeof ariaLabel === "string" ? ariaLabel : undefined}
        {...rest}
      />
    );
  }
  throw new Error(`renderReactFixture: unported family ${fixture.family}`);
}

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
import { CopyButton } from "@cronus-ui/ui/copy-button";
import { Empty, EmptyTitle } from "@cronus-ui/ui/empty";
import { Fab } from "@cronus-ui/ui/fab";
import { Field, FieldDescription, FieldLabel } from "@cronus-ui/ui/field";
import { Input } from "@cronus-ui/ui/input";
import { InputGroup, InputGroupAddon } from "@cronus-ui/ui/input-group";
import { Kbd } from "@cronus-ui/ui/kbd";
import { Label } from "@cronus-ui/ui/label";
import { Metric, MetricLabel, MetricValue } from "@cronus-ui/ui/metric";
import { Progress } from "@cronus-ui/ui/progress";
import { RadioGroup, RadioGroupItem } from "@cronus-ui/ui/radio-group";
import { Rating } from "@cronus-ui/ui/rating";
import { Separator } from "@cronus-ui/ui/separator";
import { Skeleton } from "@cronus-ui/ui/skeleton";
import { Slider } from "@cronus-ui/ui/slider";
import { Spinner } from "@cronus-ui/ui/spinner";
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
  throw new Error(`renderReactFixture: unported family ${fixture.family}`);
}

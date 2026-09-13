import { Alert, AlertDescription, AlertTitle } from "@cronus-ui/ui/alert";
import { Avatar, AvatarFallback } from "@cronus-ui/ui/avatar";
import { Badge } from "@cronus-ui/ui/badge";
import { Banner } from "@cronus-ui/ui/banner";
import { Button } from "@cronus-ui/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@cronus-ui/ui/card";
import { Checkbox } from "@cronus-ui/ui/checkbox";
import { Chip } from "@cronus-ui/ui/chip";
import { Empty, EmptyTitle } from "@cronus-ui/ui/empty";
import { Input } from "@cronus-ui/ui/input";
import { Kbd } from "@cronus-ui/ui/kbd";
import { Label } from "@cronus-ui/ui/label";
import { Progress } from "@cronus-ui/ui/progress";
import { RadioGroup, RadioGroupItem } from "@cronus-ui/ui/radio-group";
import { Separator } from "@cronus-ui/ui/separator";
import { Skeleton } from "@cronus-ui/ui/skeleton";
import { Slider } from "@cronus-ui/ui/slider";
import { Spinner } from "@cronus-ui/ui/spinner";
import { Switch } from "@cronus-ui/ui/switch";
import { Textarea } from "@cronus-ui/ui/textarea";
import { Toggle } from "@cronus-ui/ui/toggle";
import type { ReactElement } from "react";
import type { ParityFixture } from "./parity-fixture.js";

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
  throw new Error(`renderReactFixture: unported family ${fixture.family}`);
}

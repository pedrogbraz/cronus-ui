"use client";

import { CircleAlert } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type FormEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog.js";
import { Field, FieldLabel } from "./field.js";
import { Input } from "./input.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select.js";
import { Spinner } from "./spinner.js";

export interface InviteDialogLabels {
  title?: string;
  description?: string;
  email?: string;
  emailPlaceholder?: string;
  role?: string;
  send?: string;
  cancel?: string;
  sending?: string;
  errorFallback?: string;
}

export interface InviteRole {
  value: string;
  label: string;
}

const DEFAULT_LABELS: Required<InviteDialogLabels> = {
  title: "Invite member",
  description: "Send an invitation to join this workspace.",
  email: "Email",
  emailPlaceholder: "name@example.com",
  role: "Role",
  send: "Send invite",
  cancel: "Cancel",
  sending: "Sending",
  errorFallback: "Something went wrong. Please try again.",
};

const DEFAULT_ROLES: readonly InviteRole[] = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
];

function resolveErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string" && error) {
    return error;
  }
  return fallback;
}

function resolveRoles(roles: readonly InviteRole[] | undefined): readonly InviteRole[] {
  return roles && roles.length > 0 ? roles : DEFAULT_ROLES;
}

function resolveDefaultRole(roles: readonly InviteRole[], defaultRole?: string): string {
  if (defaultRole && roles.some((role) => role.value === defaultRole)) {
    return defaultRole;
  }
  return roles[0]?.value ?? "";
}

export interface InviteDialogProps
  extends Omit<ComponentPropsWithoutRef<typeof DialogContent>, "title" | "children"> {
  /** Element that opens the dialog. Rendered inside a `DialogTrigger asChild`. Omit when driving the dialog purely via `open`. */
  trigger?: ReactNode;
  /** Controlled open state. Provide alongside `onOpenChange` to control the dialog externally. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Called whenever the open state changes. Dismissal is suppressed while an invite promise is pending. */
  onOpenChange?: (open: boolean) => void;
  /** Roles offered in the select. Defaults to Member and Admin. */
  roles?: readonly InviteRole[];
  /** Initially selected role `value`. Falls back to the first role. */
  defaultRole?: string;
  /**
   * Invoked with the submitted email and role. If it returns a promise, the send
   * button shows a spinner and actions are disabled until it settles; on resolve
   * the dialog closes, on reject it stays open and surfaces the error.
   */
  onInvite?: (payload: { email: string; role: string }) => void | Promise<void>;
  /** Override any subset of the built-in English strings. */
  labels?: InviteDialogLabels;
  /** Forwarded to the dialog content surface. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * An ergonomic invite dialog for adding a member by email and role, composed
 * on top of the accessible `Dialog` primitive (focus trap, overlay, Escape).
 *
 * Behavior: `onInvite` may be async — while its promise is pending the send
 * button shows a `Spinner`, both actions are disabled, and the dialog cannot be
 * dismissed so the operation can't be interrupted mid-flight. On resolve the
 * dialog closes; on reject it stays open and renders the error in a
 * `role="alert"` region. Works controlled (`open`/`onOpenChange`) or
 * uncontrolled (`defaultOpen`).
 *
 * Performance/a11y: late promise settlements are ignored after unmount via a
 * mounted ref. The spinner is decorative (`aria-hidden`) with loading state
 * conveyed through `aria-busy`. All entrance/exit motion is owned by the
 * underlying primitive and degrades under `prefers-reduced-motion`.
 */
export function InviteDialog({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  roles,
  defaultRole,
  onInvite,
  labels,
  className,
  ref,
  ...contentProps
}: InviteDialogProps) {
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };
  const resolvedRoles = resolveRoles(roles);
  const initialRole = resolveDefaultRole(resolvedRoles, defaultRole);

  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const isOpen = isControlled ? open : uncontrolledOpen;

  const [email, setEmail] = useState("");
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadingRef = useRef(false);
  const mountedRef = useRef(true);
  const emailId = useId();
  const roleId = useId();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (loadingRef.current && !next) {
        return;
      }
      if (next) {
        setError(null);
        setEmail("");
        setRole(initialRole);
      }
      setOpen(next);
    },
    [initialRole, setOpen],
  );

  const beginLoading = useCallback((value: boolean) => {
    loadingRef.current = value;
    setLoading(value);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (loadingRef.current) {
        return;
      }
      const trimmed = email.trim();
      if (!trimmed) {
        return;
      }
      setError(null);
      if (!onInvite) {
        setOpen(false);
        return;
      }
      const result = onInvite({ email: trimmed, role });
      if (!(result instanceof Promise)) {
        setOpen(false);
        return;
      }
      beginLoading(true);
      try {
        await result;
        if (!mountedRef.current) {
          return;
        }
        beginLoading(false);
        setOpen(false);
      } catch (err) {
        if (!mountedRef.current) {
          return;
        }
        beginLoading(false);
        setError(resolveErrorMessage(err, resolvedLabels.errorFallback));
      }
    },
    [beginLoading, email, onInvite, resolvedLabels.errorFallback, role, setOpen],
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        ref={ref}
        data-slot="invite-dialog"
        className={cn("max-w-md", className)}
        {...contentProps}
      >
        <DialogHeader>
          <DialogTitle>{resolvedLabels.title}</DialogTitle>
          {resolvedLabels.description ? (
            <DialogDescription>{resolvedLabels.description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field>
            <FieldLabel htmlFor={emailId}>{resolvedLabels.email}</FieldLabel>
            <Input
              id={emailId}
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={resolvedLabels.emailPlaceholder}
              disabled={loading}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={roleId}>{resolvedLabels.role}</FieldLabel>
            <Select value={role} onValueChange={setRole} disabled={loading}>
              <SelectTrigger id={roleId}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resolvedRoles.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {error ? (
            <div
              role="alert"
              data-slot="invite-dialog-error"
              className="flex items-start gap-2 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-start text-sm text-error-strong"
            >
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleOpenChange(false)}
            >
              {resolvedLabels.cancel}
            </Button>
            <Button
              type="submit"
              data-slot="invite-dialog-send"
              disabled={loading}
              aria-busy={loading}
              className="min-w-24"
            >
              {loading ? <Spinner size="sm" aria-hidden /> : null}
              {loading ? resolvedLabels.sending : resolvedLabels.send}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

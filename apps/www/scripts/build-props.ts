/**
 * Generates the Props/API tables consumed by every component doc page.
 *
 * For each slug in `CATEGORIES`, it reads the real @cronus-ui/ui component source at
 * `packages/ui/src/components/<slug>.tsx`, parses it with the TypeScript compiler
 * API (NEVER importing/executing the module — same technique the registry block
 * extractor uses), and extracts every exported `*Props` interface or type alias
 * and its members. Empty Radix/HTML wrappers also receive a curated
 * passthrough of the extended type (open/checked/value/className/…) — never a
 * dump of every DOM attribute.
 * The result is written to `apps/www/lib/props.generated.ts` as a typed,
 * server-safe map so the rendered API tables can never drift from the code.
 *
 * Run from anywhere:  bun run apps/www/scripts/build-props.ts
 *                     (wired as the "props" package script)
 */
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { CATEGORIES } from "../lib/components-index.ts";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDir, "..");
const repoRoot = resolve(appRoot, "../..");
const componentsDir = join(repoRoot, "packages/ui/src/components");

/** Committed generated output. */
export const outFile = join(appRoot, "lib/props.generated.ts");

export interface PropDef {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  default?: string;
}

export interface PropsDoc {
  interfaceName: string;
  extends?: string;
  props: PropDef[];
}

/** Slugs map 1:1 to component source files under packages/ui/src/components. */
const SLUGS = CATEGORIES.flatMap((category) => category.items.map((item) => item.slug));

/** Read the leading JSDoc text of a node, collapsed to a single trimmed string. */
function jsDocDescription(node: ts.Node): string | undefined {
  const jsDocNodes = ts.getJSDocCommentsAndTags(node);
  for (const jsDoc of jsDocNodes) {
    if (!ts.isJSDoc(jsDoc)) continue;
    const comment = jsDoc.comment;
    if (comment === undefined) continue;
    const text = typeof comment === "string" ? comment : comment.map((part) => part.text).join("");
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized.length > 0) return normalized;
  }
  return undefined;
}

/** Best-effort `@default` JSDoc tag value for a member, if present. */
function jsDocDefault(node: ts.Node): string | undefined {
  for (const tag of ts.getJSDocTags(node)) {
    const name = tag.tagName.getText();
    if (name !== "default" && name !== "defaultValue") continue;
    const comment = tag.comment;
    if (comment === undefined) continue;
    const text = typeof comment === "string" ? comment : comment.map((part) => part.text).join("");
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized.length > 0) return normalized;
  }
  return undefined;
}

/** Heritage (`extends …`) note for an interface, e.g. for documenting passthrough props. */
function extendsNote(node: ts.InterfaceDeclaration): string | undefined {
  const clauses = node.heritageClauses?.filter(
    (clause) => clause.token === ts.SyntaxKind.ExtendsKeyword,
  );
  if (!clauses || clauses.length === 0) return undefined;
  const types = clauses
    .flatMap((clause) => clause.types)
    .map((type) => type.getText().replace(/\s+/g, " ").trim())
    .filter((text) => text.length > 0);
  if (types.length === 0) return undefined;
  return `Extends ${types.join(", ")}`;
}

/**
 * Walk the whole source file and collect default initializers from every
 * destructured props parameter (the ObjectBindingPattern of each render
 * function / forwardRef render callback), keyed by binding name. Defaults are
 * best-effort: prop names are unique enough across a component file that mapping
 * by name reliably attaches `size = "md"` style defaults to the matching member.
 */
function collectDefaults(sourceFile: ts.SourceFile): Map<string, string> {
  const defaults = new Map<string, string>();

  const harvest = (parameter: ts.ParameterDeclaration | undefined): void => {
    if (!parameter || !ts.isObjectBindingPattern(parameter.name)) return;
    for (const element of parameter.name.elements) {
      if (!ts.isIdentifier(element.name)) continue;
      if (element.initializer === undefined) continue;
      const key = element.name.text;
      if (!defaults.has(key)) {
        defaults.set(key, element.initializer.getText(sourceFile).replace(/\s+/g, " ").trim());
      }
    }
  };

  const visit = (node: ts.Node): void => {
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node)
    ) {
      harvest(node.parameters[0]);
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return defaults;
}

/** One CVA variant axis: the option keys plus an optional default option. */
interface CvaVariant {
  options: string[];
  default?: string;
}

/**
 * Collect the variant axes of every `cva(base, { variants, defaultVariants })`
 * call in the file, keyed by the variable it is assigned to (e.g. `buttonVariants`).
 * Used to expand a `VariantProps<typeof buttonVariants>` heritage clause into the
 * real `variant` / `size` props, with their option unions and defaults — so the
 * docs surface CVA-driven props that never appear as literal interface members.
 */
function collectCvaVariants(sourceFile: ts.SourceFile): Map<string, Map<string, CvaVariant>> {
  const byVariable = new Map<string, Map<string, CvaVariant>>();

  const objectLiteralKeys = (node: ts.ObjectLiteralExpression): string[] => {
    const keys: string[] = [];
    for (const property of node.properties) {
      const name = property.name;
      if (name === undefined) continue;
      if (ts.isStringLiteral(name)) {
        keys.push(name.text);
      } else if (ts.isIdentifier(name)) {
        keys.push(name.text);
      } else {
        keys.push(name.getText(sourceFile));
      }
    }
    return keys;
  };

  const parseCvaCall = (call: ts.CallExpression): Map<string, CvaVariant> | undefined => {
    if (!ts.isIdentifier(call.expression) || call.expression.text !== "cva") return undefined;
    const config = call.arguments[1];
    if (config === undefined || !ts.isObjectLiteralExpression(config)) return undefined;

    let variantsNode: ts.ObjectLiteralExpression | undefined;
    let defaultsNode: ts.ObjectLiteralExpression | undefined;
    for (const property of config.properties) {
      if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) continue;
      if (property.name.text === "variants" && ts.isObjectLiteralExpression(property.initializer)) {
        variantsNode = property.initializer;
      } else if (
        property.name.text === "defaultVariants" &&
        ts.isObjectLiteralExpression(property.initializer)
      ) {
        defaultsNode = property.initializer;
      }
    }
    if (variantsNode === undefined) return undefined;

    const defaults = new Map<string, string>();
    if (defaultsNode) {
      for (const property of defaultsNode.properties) {
        if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) continue;
        defaults.set(property.name.text, property.initializer.getText(sourceFile));
      }
    }

    const axes = new Map<string, CvaVariant>();
    for (const property of variantsNode.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const axisName = ts.isIdentifier(property.name)
        ? property.name.text
        : ts.isStringLiteral(property.name)
          ? property.name.text
          : property.name.getText(sourceFile);
      if (!ts.isObjectLiteralExpression(property.initializer)) continue;
      axes.set(axisName, {
        options: objectLiteralKeys(property.initializer),
        ...(defaults.has(axisName) ? { default: defaults.get(axisName) } : {}),
      });
    }
    return axes;
  };

  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      let init = node.initializer;
      // `cva(...)` may be wrapped, e.g. in an `as const` assertion.
      while (ts.isAsExpression(init) || ts.isParenthesizedExpression(init)) {
        init = init.expression;
      }
      if (ts.isCallExpression(init)) {
        const axes = parseCvaCall(init);
        if (axes && axes.size > 0) byVariable.set(node.name.text, axes);
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return byVariable;
}

/**
 * If an `extends` clause is `VariantProps<typeof someVariants>`, return the CVA
 * variant axes it resolves to (the props it synthesizes). Otherwise undefined.
 */
function variantPropsFor(
  type: ts.ExpressionWithTypeArguments,
  cva: Map<string, Map<string, CvaVariant>>,
  sourceFile: ts.SourceFile,
): Map<string, CvaVariant> | undefined {
  if (!ts.isIdentifier(type.expression) || type.expression.text !== "VariantProps")
    return undefined;
  const arg = type.typeArguments?.[0];
  if (arg === undefined || !ts.isTypeQueryNode(arg)) return undefined;
  const variableName = arg.exprName.getText(sourceFile);
  return cva.get(variableName);
}

/** A CVA option key like `"icon-sm"` rendered as a quoted union member. */
function unionOf(options: string[]): string {
  return options.map((option) => JSON.stringify(option)).join(" | ");
}

/** Is this top-level statement an exported `interface …Props`? */
function isExportedPropsInterface(node: ts.Node): node is ts.InterfaceDeclaration {
  if (!ts.isInterfaceDeclaration(node)) return false;
  if (!node.name.text.endsWith("Props")) return false;
  const modifiers = ts.getCombinedModifierFlags(node);
  return (modifiers & ts.ModifierFlags.Export) !== 0;
}

function isExported(node: ts.Node): boolean {
  return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;
}

/** Is this top-level statement an exported `type …Props = …`? */
function isExportedPropsTypeAlias(node: ts.Node): node is ts.TypeAliasDeclaration {
  return ts.isTypeAliasDeclaration(node) && isExported(node) && node.name.text.endsWith("Props");
}

function isExportedLabelsType(
  node: ts.Node,
): node is ts.TypeAliasDeclaration | ts.InterfaceDeclaration {
  if (!isExported(node)) return false;
  if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
    return node.name.text.endsWith("Labels");
  }
  return false;
}

const COMMON_PROP_DOCS: Record<string, string> = {
  asChild: "Render as the child element via Slot.",
  children: "Contents of the component.",
  className: "Additional class names merged onto the root.",
  defaultOpen: "Uncontrolled initial open state.",
  defaultValue: "Uncontrolled initial value.",
  disabled: "Disables pointer and keyboard interaction.",
  invalid: "Marks the control invalid and applies the error ring.",
  labels: "Override default English strings.",
  name: "Submitted name when used in a form.",
  onChange: "Called when the value changes.",
  onOpenChange: "Called when the open state changes.",
  onValueChange: "Called when the value changes.",
  open: "Controlled open state.",
  placeholder: "Placeholder shown when the value is empty.",
  ref: "Ref forwarded to the underlying DOM node.",
  required: "Marks the control as required.",
  size: "Control size.",
  value: "Controlled value.",
  variant: "Visual variant.",
};

function describeProp(name: string, explicit?: string): string | undefined {
  if (explicit && explicit.length > 0) return explicit;
  return COMMON_PROP_DOCS[name];
}

function p(name: string, type: string, description?: string, def?: string): PropDef {
  return {
    name,
    type,
    required: false,
    ...(describeProp(name, description) ? { description: describeProp(name, description) } : {}),
    ...(def ? { default: def } : {}),
  };
}

const P = {
  asChild: p("asChild", "boolean"),
  children: p("children", "ReactNode"),
  className: p("className", "string"),
  disabled: p("disabled", "boolean"),
  name: p("name", "string"),
  required: p("required", "boolean"),
  value: p("value", "string"),
  defaultValue: p("defaultValue", "string"),
  onValueChange: p("onValueChange", "(value: string) => void"),
  open: p("open", "boolean"),
  defaultOpen: p("defaultOpen", "boolean"),
  onOpenChange: p("onOpenChange", "(open: boolean) => void"),
  checked: p("checked", "boolean", "Controlled checked state. Pair with `onCheckedChange`."),
  defaultChecked: p("defaultChecked", "boolean", "Uncontrolled initial checked state."),
  onCheckedChange: p(
    "onCheckedChange",
    "(checked: boolean) => void",
    "Called with the next checked value whenever the control toggles.",
  ),
  dir: p("dir", '"ltr" | "rtl"', "Reading direction. Inherits from the document when omitted."),
  orientation: p("orientation", '"horizontal" | "vertical"'),
  modal: p("modal", "boolean", "When true, interaction outside the surface is blocked."),
  side: p("side", '"top" | "right" | "bottom" | "left"', "Preferred side of the trigger."),
  align: p("align", '"start" | "center" | "end"', "Alignment along the chosen side."),
  sideOffset: p("sideOffset", "number", "Distance in pixels from the trigger."),
  alignOffset: p("alignOffset", "number", "Offset along the alignment axis."),
  forceMount: p("forceMount", "boolean", "Keep the node mounted when closed, for exit animation."),
  onSelect: p("onSelect", "(event: Event) => void", "Called when the item is chosen."),
  textValue: p("textValue", "string", "Text used for typeahead. Defaults to the item's text."),
  loop: p("loop", "boolean", "When true, keyboard navigation wraps around the ends."),
  htmlFor: p("htmlFor", "string", "id of the labelled control."),
  placeholder: p("placeholder", "string"),
  id: p("id", "string", "DOM id of the root element."),
  onClick: p("onClick", "(event: MouseEvent) => void", "Click handler."),
  type: p("type", "string", "Native type of the underlying element."),
};

const OPENABLE: PropDef[] = [P.open, P.defaultOpen, P.onOpenChange, P.children];
const OVERLAY_CONTENT: PropDef[] = [
  P.side,
  P.align,
  P.sideOffset,
  P.alignOffset,
  P.forceMount,
  P.asChild,
  P.children,
  P.className,
];
const MENU_ITEM: PropDef[] = [
  P.disabled,
  P.onSelect,
  P.textValue,
  P.asChild,
  P.children,
  P.className,
];
const SLOT: PropDef[] = [P.asChild, P.children, P.className];

/** Curated passthrough for empty Radix / HTML wrappers — not a dump of every DOM member. */
const RADIX_PASSTHROUGH: Record<string, PropDef[]> = {
  "CheckboxPrimitive.Root": [
    P.checked,
    P.defaultChecked,
    P.onCheckedChange,
    P.disabled,
    P.required,
    P.name,
    P.value,
    P.asChild,
  ],
  "SwitchPrimitive.Root": [
    P.checked,
    P.defaultChecked,
    P.onCheckedChange,
    P.disabled,
    P.required,
    P.name,
    P.value,
    P.asChild,
  ],
  "RadioGroupPrimitive.Root": [
    P.value,
    P.defaultValue,
    P.onValueChange,
    P.disabled,
    P.required,
    P.name,
    P.orientation,
    P.dir,
    P.loop,
  ],
  "RadioGroupPrimitive.Item": [P.value, P.disabled, P.asChild],
  "LabelPrimitive.Root": [P.htmlFor, P.asChild, P.children, P.className],
  "SelectPrimitive.Root": [
    P.value,
    P.defaultValue,
    P.onValueChange,
    P.open,
    P.defaultOpen,
    P.onOpenChange,
    P.disabled,
    P.required,
    P.name,
    P.dir,
  ],
  "SelectPrimitive.Trigger": [P.asChild, P.disabled, P.children, P.className],
  "SelectPrimitive.Value": [P.placeholder, P.asChild],
  "SelectPrimitive.Content": [
    p(
      "position",
      '"item-aligned" | "popper"',
      "How the list is positioned relative to the trigger.",
    ),
    P.side,
    P.sideOffset,
    P.align,
    P.alignOffset,
    P.children,
    P.className,
  ],
  "SelectPrimitive.Item": [P.value, P.disabled, P.textValue, P.asChild, P.children],
  "SelectPrimitive.Group": [P.children],
  "SelectPrimitive.Label": [P.children, P.className],
  "SelectPrimitive.Separator": [P.className],
  "SelectPrimitive.ScrollUpButton": SLOT,
  "SelectPrimitive.ScrollDownButton": SLOT,
  "SliderPrimitive.Root": [
    p("value", "number[]", "Controlled thumbs. Pair with `onValueChange`."),
    p("defaultValue", "number[]", "Uncontrolled initial thumbs."),
    p("onValueChange", "(value: number[]) => void"),
    p("onValueCommit", "(value: number[]) => void", "Called when a thumb is released."),
    p("min", "number", undefined, "0"),
    p("max", "number", undefined, "100"),
    p("step", "number", undefined, "1"),
    P.disabled,
    P.orientation,
    P.dir,
    P.name,
  ],
  "TogglePrimitive.Root": [
    p("pressed", "boolean", "Controlled pressed state."),
    p("defaultPressed", "boolean", "Uncontrolled initial pressed state."),
    p("onPressedChange", "(pressed: boolean) => void"),
    P.disabled,
    P.asChild,
  ],
  "ToggleGroupPrimitive.Root": [
    p("type", '"single" | "multiple"', "Whether one or many items can be pressed."),
    P.value,
    P.defaultValue,
    P.onValueChange,
    P.disabled,
    P.orientation,
    P.dir,
    P.loop,
  ],
  "ToggleGroupPrimitive.Item": [P.value, P.disabled, P.asChild],
  "AvatarPrimitive.Root": SLOT,
  "AvatarPrimitive.Image": [p("src", "string"), p("alt", "string"), P.asChild],
  "AvatarPrimitive.Fallback": [
    p("delayMs", "number", "Delay before showing the fallback."),
    P.asChild,
    P.children,
  ],
  "SeparatorPrimitive.Root": [
    P.orientation,
    p("decorative", "boolean", "When true, hidden from the accessibility tree.", "true"),
    P.asChild,
  ],
  "ScrollAreaPrimitive.Root": [
    p("type", '"auto" | "always" | "scroll" | "hover"', "When scrollbars are visible."),
    p("scrollHideDelay", "number"),
    P.dir,
    P.asChild,
    P.children,
  ],
  "ScrollAreaPrimitive.ScrollAreaScrollbar": [P.orientation, P.forceMount, P.asChild],
  "CollapsiblePrimitive.Root": [...OPENABLE, P.disabled],
  "CollapsiblePrimitive.CollapsibleTrigger": SLOT,
  "CollapsiblePrimitive.CollapsibleContent": [P.forceMount, P.asChild, P.children],
  "ProgressPrimitive.Root": [
    p("value", "number | null", "Current progress. `null` for indeterminate."),
    p("max", "number", undefined, "100"),
    P.asChild,
  ],
  "AlertDialogPrimitive.Root": OPENABLE,
  "AlertDialogPrimitive.Trigger": SLOT,
  "AlertDialogPrimitive.Content": [P.forceMount, P.asChild, P.children, P.className],
  "AlertDialogPrimitive.Title": SLOT,
  "AlertDialogPrimitive.Description": SLOT,
  "AlertDialogPrimitive.Action": SLOT,
  "AlertDialogPrimitive.Cancel": SLOT,
  "DialogPrimitive.Root": [...OPENABLE, P.modal],
  "DialogPrimitive.Trigger": SLOT,
  "DialogPrimitive.Portal": [P.forceMount, p("container", "HTMLElement", "Portal mount node.")],
  "DialogPrimitive.Close": SLOT,
  "DialogPrimitive.Overlay": [P.forceMount, P.asChild, P.className],
  "DialogPrimitive.Content": [P.forceMount, P.asChild, P.children, P.className],
  "DialogPrimitive.Title": SLOT,
  "DialogPrimitive.Description": SLOT,
  "PopoverPrimitive.Root": [...OPENABLE, P.modal],
  "PopoverPrimitive.Trigger": SLOT,
  "PopoverPrimitive.Anchor": SLOT,
  "PopoverPrimitive.Portal": [P.forceMount],
  "PopoverPrimitive.Close": SLOT,
  "PopoverPrimitive.Content": OVERLAY_CONTENT,
  "HoverCardPrimitive.Root": [
    ...OPENABLE,
    p("openDelay", "number", "Delay before opening, in ms."),
    p("closeDelay", "number", "Delay before closing, in ms."),
  ],
  "HoverCardPrimitive.Trigger": SLOT,
  "HoverCardPrimitive.Content": OVERLAY_CONTENT,
  "TooltipPrimitive.Provider": [
    p("delayDuration", "number", "Default open delay for nested tooltips."),
    p("skipDelayDuration", "number", "Grace period when moving between tooltips."),
    p("disableHoverableContent", "boolean"),
  ],
  "TooltipPrimitive.Root": [
    ...OPENABLE,
    p("delayDuration", "number"),
    p("disableHoverableContent", "boolean"),
  ],
  "TooltipPrimitive.Trigger": SLOT,
  "TooltipPrimitive.Content": [...OVERLAY_CONTENT, p("aria-label", "string")],
  "TooltipPrimitive.Arrow": [p("width", "number"), p("height", "number"), P.className],
  "DropdownMenuPrimitive.Root": [...OPENABLE, P.modal, P.dir],
  "DropdownMenuPrimitive.Trigger": SLOT,
  "DropdownMenuPrimitive.Portal": [P.forceMount],
  "DropdownMenuPrimitive.Content": OVERLAY_CONTENT,
  "DropdownMenuPrimitive.Item": MENU_ITEM,
  "DropdownMenuPrimitive.CheckboxItem": [P.checked, P.onCheckedChange, ...MENU_ITEM],
  "DropdownMenuPrimitive.RadioGroup": [P.value, P.onValueChange],
  "DropdownMenuPrimitive.RadioItem": [P.value, ...MENU_ITEM],
  "DropdownMenuPrimitive.Label": [P.children, P.className],
  "DropdownMenuPrimitive.Separator": [P.className],
  "DropdownMenuPrimitive.Group": [P.children],
  "DropdownMenuPrimitive.Sub": [P.open, P.defaultOpen, P.onOpenChange],
  "DropdownMenuPrimitive.SubTrigger": [P.disabled, P.asChild, P.children],
  "DropdownMenuPrimitive.SubContent": OVERLAY_CONTENT,
  "ContextMenuPrimitive.Root": [...OPENABLE, P.modal, P.dir],
  "ContextMenuPrimitive.Trigger": SLOT,
  "ContextMenuPrimitive.Portal": [P.forceMount],
  "ContextMenuPrimitive.Content": OVERLAY_CONTENT,
  "ContextMenuPrimitive.Item": MENU_ITEM,
  "ContextMenuPrimitive.CheckboxItem": [P.checked, P.onCheckedChange, ...MENU_ITEM],
  "ContextMenuPrimitive.RadioGroup": [P.value, P.onValueChange],
  "ContextMenuPrimitive.RadioItem": [P.value, ...MENU_ITEM],
  "ContextMenuPrimitive.Label": [P.children, P.className],
  "ContextMenuPrimitive.Separator": [P.className],
  "ContextMenuPrimitive.Group": [P.children],
  "ContextMenuPrimitive.Sub": [P.open, P.defaultOpen, P.onOpenChange],
  "ContextMenuPrimitive.SubTrigger": [P.disabled, P.asChild, P.children],
  "ContextMenuPrimitive.SubContent": OVERLAY_CONTENT,
  "MenubarPrimitive.Root": [P.value, P.defaultValue, P.onValueChange, P.dir, P.loop],
  "MenubarPrimitive.Menu": [...OPENABLE],
  "MenubarPrimitive.Trigger": SLOT,
  "MenubarPrimitive.Portal": [P.forceMount],
  "MenubarPrimitive.Content": OVERLAY_CONTENT,
  "MenubarPrimitive.Item": MENU_ITEM,
  "MenubarPrimitive.CheckboxItem": [P.checked, P.onCheckedChange, ...MENU_ITEM],
  "MenubarPrimitive.RadioGroup": [P.value, P.onValueChange],
  "MenubarPrimitive.RadioItem": [P.value, ...MENU_ITEM],
  "MenubarPrimitive.Label": [P.children, P.className],
  "MenubarPrimitive.Separator": [P.className],
  "MenubarPrimitive.Group": [P.children],
  "MenubarPrimitive.Sub": [P.open, P.defaultOpen, P.onOpenChange],
  "MenubarPrimitive.SubTrigger": [P.disabled, P.asChild, P.children],
  "MenubarPrimitive.SubContent": OVERLAY_CONTENT,
  "NavigationMenuPrimitive.Root": [
    P.value,
    P.defaultValue,
    P.onValueChange,
    P.dir,
    P.orientation,
    p("delayDuration", "number"),
    p("skipDelayDuration", "number"),
  ],
  "NavigationMenuPrimitive.List": SLOT,
  "NavigationMenuPrimitive.Item": SLOT,
  "NavigationMenuPrimitive.Trigger": SLOT,
  "NavigationMenuPrimitive.Content": [P.forceMount, P.asChild, P.children, P.className],
  "NavigationMenuPrimitive.Link": [P.asChild, P.children, P.className],
  "NavigationMenuPrimitive.Indicator": [P.forceMount, P.className],
  "NavigationMenuPrimitive.Viewport": [P.forceMount, P.className],
  "AccordionPrimitive.Root": [
    p("type", '"single" | "multiple"'),
    P.value,
    P.defaultValue,
    P.onValueChange,
    p("collapsible", "boolean", "When type is `single`, allow closing the open item."),
    P.disabled,
    P.dir,
    P.orientation,
  ],
  "AccordionPrimitive.Item": [P.value, P.disabled],
  "AccordionPrimitive.Header": SLOT,
  "AccordionPrimitive.Trigger": SLOT,
  "AccordionPrimitive.Content": [P.forceMount, P.asChild, P.children],
  "TabsPrimitive.Root": [
    P.value,
    P.defaultValue,
    P.onValueChange,
    P.orientation,
    P.dir,
    p("activationMode", '"automatic" | "manual"'),
  ],
  "TabsPrimitive.List": [P.loop, P.asChild, P.children, P.className],
  "TabsPrimitive.Trigger": [P.value, P.disabled, P.asChild, P.children],
  "TabsPrimitive.Content": [P.value, P.forceMount, P.asChild, P.children],
  "AspectRatioPrimitive.Root": [p("ratio", "number", "Width / height."), P.asChild, P.children],
};

const HTML_PASSTHROUGH: Record<string, PropDef[]> = {
  HTMLAttributes: [P.className, P.children, P.id],
  ButtonHTMLAttributes: [P.type, P.disabled, P.onClick, P.children, P.className],
  InputHTMLAttributes: [
    P.value,
    P.defaultValue,
    p("onChange", "(event: ChangeEvent<HTMLInputElement>) => void"),
    P.placeholder,
    P.disabled,
    P.name,
    P.required,
    P.className,
  ],
  TextareaHTMLAttributes: [
    P.value,
    P.defaultValue,
    p("onChange", "(event: ChangeEvent<HTMLTextAreaElement>) => void"),
    P.placeholder,
    P.disabled,
    P.name,
    p("rows", "number"),
    P.className,
  ],
  LabelHTMLAttributes: [P.htmlFor, P.children, P.className],
  TdHTMLAttributes: [P.children, P.className, p("colSpan", "number"), p("rowSpan", "number")],
  ThHTMLAttributes: [P.children, P.className, p("colSpan", "number"), p("rowSpan", "number")],
  OlHTMLAttributes: [P.children, P.className, p("start", "number")],
  LiHTMLAttributes: [P.children, P.className],
  TimeHTMLAttributes: [
    P.children,
    P.className,
    p("dateTime", "string", "Machine-readable datetime."),
  ],
  SVGAttributes: [P.children, P.className, p("viewBox", "string"), p("aria-hidden", "boolean")],
};

const LOCAL_PASSTHROUGH: Record<string, PropDef[]> = {
  Button: [
    p("variant", "string"),
    p("size", "string"),
    P.asChild,
    P.disabled,
    P.type,
    P.children,
    P.className,
  ],
  PaginationLink: [p("isActive", "boolean"), p("size", "string"), P.className, P.children],
  SelectItem: [P.value, P.disabled, P.children, P.className],
  HoverCard: OPENABLE,
  HoverCardContent: OVERLAY_CONTENT,
  DropdownMenuContent: OVERLAY_CONTENT,
  DropdownMenuItem: MENU_ITEM,
  Collapsible: [...OPENABLE, P.disabled],
  CollapsibleTrigger: SLOT,
  CollapsibleContent: [P.forceMount, P.asChild, P.children, P.className],
  Label: [P.htmlFor, P.children, P.className],
  Slot: SLOT,
  DropdownMenu: [...OPENABLE, P.modal],
  DropdownMenuLabel: [P.children, P.className],
  DropdownMenuSeparator: [P.className],
  DropdownMenuTrigger: SLOT,
  UsageMeterProps: [
    p("value", "number", "Current usage."),
    p("max", "number", "Upper bound of the meter."),
    P.children,
    P.className,
  ],
  HeatmapProps: [P.className, P.children],
  InputProps: HTML_PASSTHROUGH.InputHTMLAttributes ?? [P.className],
  PromptInputButtonProps: [
    p("variant", "string"),
    p("size", "string"),
    P.disabled,
    P.children,
    P.className,
  ],
};

function omittedFromExtends(note: string): Set<string> {
  const omitted = new Set<string>();
  const omitClause = note.match(/Omit<\s*[^,]+,\s*([^>]+)>/);
  if (!omitClause?.[1]) return omitted;
  for (const match of omitClause[1].matchAll(/["']([^"']+)["']/g)) {
    if (match[1]) omitted.add(match[1]);
  }
  return omitted;
}

function passthroughForExtends(note: string | undefined): PropDef[] {
  if (!note) return [];
  const normalized = note.replace(/\s+/g, " ");
  const omitted = omittedFromExtends(normalized);
  const collected: PropDef[] = [];
  const seen = new Set<string>();

  const add = (list: PropDef[] | undefined) => {
    if (!list) return;
    for (const item of list) {
      if (omitted.has(item.name) || seen.has(item.name)) continue;
      seen.add(item.name);
      collected.push(item);
    }
  };

  for (const match of normalized.matchAll(/(\w+Primitive)\s*\.\s*(\w+)/g)) {
    add(RADIX_PASSTHROUGH[`${match[1]}.${match[2]}`] ?? SLOT);
  }

  for (const match of normalized.matchAll(/typeof\s+(\w+)/g)) {
    const name = match[1] ?? "";
    if (name.includes("Primitive")) continue;
    add(LOCAL_PASSTHROUGH[name] ?? SLOT);
  }

  for (const htmlKey of Object.keys(HTML_PASSTHROUGH).sort((a, b) => b.length - a.length)) {
    if (new RegExp(`\\b${htmlKey}\\b`).test(normalized)) add(HTML_PASSTHROUGH[htmlKey]);
  }

  if (normalized.includes("ButtonProps")) add(LOCAL_PASSTHROUGH.Button);
  if (normalized.includes("ControllerProps")) {
    add([
      p("name", "string", "Field path in the form values."),
      p("control", "Control<TFieldValues>", "RHF control instance."),
      p("render", "(props) => ReactNode", "Render-prop for the bound control."),
    ]);
  }
  if (normalized.includes("FormProvider")) add([P.children]);
  if (normalized.includes("OTPInput")) {
    add([
      p("maxLength", "number"),
      P.value,
      p("onChange", "(value: string) => void"),
      P.disabled,
      P.className,
    ]);
  }
  if (normalized.includes("Sonner")) {
    add([
      p("position", "string", "Toast stack position."),
      p("theme", '"light" | "dark" | "system"'),
      p("duration", "number"),
      p("closeButton", "boolean"),
    ]);
  }
  if (/ComponentProps(?:WithoutRef)?<\s*"div"/.test(normalized)) {
    add(HTML_PASSTHROUGH.HTMLAttributes);
  }
  if (/ComponentProps(?:WithoutRef)?<\s*"span"/.test(normalized)) {
    add(HTML_PASSTHROUGH.HTMLAttributes);
  }
  if (/ComponentProps(?:WithoutRef)?<\s*"button"/.test(normalized)) {
    add(HTML_PASSTHROUGH.ButtonHTMLAttributes);
  }
  if (normalized.includes("CommandPrimitive")) {
    add([
      P.value,
      P.onValueChange,
      P.children,
      P.className,
      p("loop", "boolean"),
      p("label", "string", "Accessible name of the command list."),
    ]);
  }
  if (normalized.includes("ResizablePrimitivePanelGroup")) {
    add([p("direction", '"horizontal" | "vertical"'), P.children, P.className]);
  } else if (normalized.includes("ResizablePrimitivePanel")) {
    add([
      p("defaultSize", "number"),
      p("minSize", "number"),
      p("maxSize", "number"),
      p("collapsible", "boolean"),
      P.children,
    ]);
  }
  if (normalized.includes("PropsWithChildren")) {
    add([P.children]);
    if (normalized.includes("initialInput")) {
      add([p("initialInput", "string", "Seed value for the prompt field.")]);
    }
  }
  if (normalized.includes("UsageMeterProps")) add(LOCAL_PASSTHROUGH.UsageMeterProps);
  if (normalized.includes("HeatmapProps")) add(LOCAL_PASSTHROUGH.HeatmapProps);
  if (/\bInputProps\b/.test(normalized)) add(LOCAL_PASSTHROUGH.InputProps);

  if (collected.length === 0 && /HTMLAttributes/.test(normalized)) {
    add(HTML_PASSTHROUGH.HTMLAttributes);
  }

  return collected;
}

function fillPassthroughProps(doc: PropsDoc): PropsDoc {
  const inherited = passthroughForExtends(doc.extends);
  if (inherited.length === 0) return doc;
  const seen = new Set(doc.props.map((item) => item.name));
  const extra = inherited.filter((item) => !seen.has(item.name));
  if (extra.length === 0) return doc;
  return { ...doc, props: [...doc.props, ...extra] };
}

function variantPropsFromTypeNode(
  type: ts.TypeNode,
  cva: Map<string, Map<string, CvaVariant>>,
  sourceFile: ts.SourceFile,
): Map<string, CvaVariant> | undefined {
  if (!ts.isTypeReferenceNode(type)) return undefined;
  if (!ts.isIdentifier(type.typeName) || type.typeName.text !== "VariantProps") return undefined;
  const arg = type.typeArguments?.[0];
  if (arg === undefined || !ts.isTypeQueryNode(arg)) return undefined;
  return cva.get(arg.exprName.getText(sourceFile));
}

function pushCvaAxes(
  axes: Map<string, CvaVariant> | undefined,
  props: PropDef[],
  seen: Set<string>,
): void {
  if (!axes) return;
  for (const [axisName, axis] of axes) {
    if (seen.has(axisName)) continue;
    seen.add(axisName);
    props.push({
      name: axisName,
      type: unionOf(axis.options),
      required: false,
      description: describeProp(axisName, `One of ${unionOf(axis.options)}.`),
      ...(axis.default ? { default: axis.default } : {}),
    });
  }
}

type LocalType = ts.InterfaceDeclaration | ts.TypeAliasDeclaration;

function collectLocalTypes(sourceFile: ts.SourceFile): Map<string, LocalType> {
  const map = new Map<string, LocalType>();
  for (const statement of sourceFile.statements) {
    if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
      map.set(statement.name.text, statement);
    }
  }
  return map;
}

/** Flatten TypeLiteral, intersections, and same-file type references into signatures. */
function membersFromType(
  type: ts.TypeNode,
  sourceFile: ts.SourceFile,
  locals: Map<string, LocalType>,
  seenTypes: Set<string>,
  cva: Map<string, Map<string, CvaVariant>>,
  cvaSink: PropDef[],
  seenProps: Set<string>,
): ts.PropertySignature[] {
  if (ts.isTypeLiteralNode(type)) {
    return type.members.filter(ts.isPropertySignature);
  }
  if (ts.isParenthesizedTypeNode(type)) {
    return membersFromType(type.type, sourceFile, locals, seenTypes, cva, cvaSink, seenProps);
  }
  if (ts.isIntersectionTypeNode(type) || ts.isUnionTypeNode(type)) {
    // Unions of props are rare; flatten both sides so docs still list members.
    return type.types.flatMap((inner) =>
      membersFromType(inner, sourceFile, locals, seenTypes, cva, cvaSink, seenProps),
    );
  }
  if (ts.isTypeOperatorNode(type) && type.operator === ts.SyntaxKind.ReadonlyKeyword) {
    return membersFromType(type.type, sourceFile, locals, seenTypes, cva, cvaSink, seenProps);
  }
  const axes = variantPropsFromTypeNode(type, cva, sourceFile);
  if (axes) {
    pushCvaAxes(axes, cvaSink, seenProps);
    return [];
  }
  if (ts.isTypeReferenceNode(type) && ts.isIdentifier(type.typeName)) {
    const name = type.typeName.text;
    if (seenTypes.has(name)) return [];
    const local = locals.get(name);
    if (!local) return [];
    seenTypes.add(name);
    if (ts.isInterfaceDeclaration(local)) {
      return local.members.filter(ts.isPropertySignature);
    }
    return membersFromType(local.type, sourceFile, locals, seenTypes, cva, cvaSink, seenProps);
  }
  return [];
}

/** Non-literal constituents of a type-alias intersection, for the Extends note. */
function typeAliasExtendsNote(
  type: ts.TypeNode,
  locals: Map<string, LocalType>,
): string | undefined {
  const parts: string[] = [];
  const walk = (node: ts.TypeNode) => {
    if (ts.isTypeLiteralNode(node)) return;
    if (ts.isParenthesizedTypeNode(node)) {
      walk(node.type);
      return;
    }
    if (ts.isIntersectionTypeNode(node)) {
      for (const inner of node.types) walk(inner);
      return;
    }
    if (
      ts.isTypeReferenceNode(node) &&
      ts.isIdentifier(node.typeName) &&
      locals.has(node.typeName.text)
    ) {
      const local = locals.get(node.typeName.text);
      if (local && ts.isTypeAliasDeclaration(local)) walk(local.type);
      return;
    }
    if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
      if (node.typeName.text === "VariantProps") return;
    }
    const text = node.getText().replace(/\s+/g, " ").trim();
    if (text.length > 0) parts.push(text);
  };
  walk(type);
  if (parts.length === 0) return undefined;
  return `Extends ${parts.join(", ")}`;
}

function propsFromSignatures(
  members: readonly ts.TypeElement[],
  sourceFile: ts.SourceFile,
  defaults: Map<string, string>,
  seen: Set<string>,
): PropDef[] {
  const props: PropDef[] = [];
  for (const member of members) {
    if (!ts.isPropertySignature(member) || member.name === undefined) continue;

    const name = ts.isStringLiteral(member.name)
      ? member.name.text
      : member.name.getText(sourceFile);

    const type = member.type
      ? member.type.getText(sourceFile).replace(/\s+/g, " ").trim()
      : "unknown";
    const required = member.questionToken === undefined;
    const description = describeProp(name, jsDocDescription(member));
    const fallbackDefault = jsDocDefault(member);
    const derivedDefault = defaults.get(name);
    const defaultValue = derivedDefault ?? fallbackDefault;

    seen.add(name);
    props.push({
      name,
      type,
      required,
      ...(description ? { description } : {}),
      ...(defaultValue ? { default: defaultValue } : {}),
    });
  }
  return props;
}

function unwrapExpression(expr: ts.Expression): ts.Expression {
  let current = expr;
  while (
    ts.isAsExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function isForwardRefCall(expr: ts.Expression): expr is ts.CallExpression {
  const inner = unwrapExpression(expr);
  if (!ts.isCallExpression(inner)) return false;
  const callee = inner.expression;
  if (ts.isIdentifier(callee) && callee.text === "forwardRef") return true;
  if (ts.isPropertyAccessExpression(callee) && callee.name.text === "forwardRef") return true;
  return false;
}

function inferFromForwardRef(
  name: string,
  initializer: ts.Expression,
  sourceFile: ts.SourceFile,
  locals: Map<string, LocalType>,
  cva: Map<string, Map<string, CvaVariant>>,
  defaults: Map<string, string>,
): PropsDoc | undefined {
  const call = unwrapExpression(initializer);
  if (!ts.isCallExpression(call) || !isForwardRefCall(call)) return undefined;
  const propsType = call.typeArguments?.[1];
  if (propsType === undefined) {
    // Infer from the render callback's first parameter type if present.
    const render = call.arguments[0];
    if (
      render &&
      (ts.isArrowFunction(render) || ts.isFunctionExpression(render)) &&
      render.parameters[0]?.type
    ) {
      return docFromTypeNode(
        `${name}Props`,
        render.parameters[0].type,
        sourceFile,
        locals,
        cva,
        defaults,
      );
    }
    return undefined;
  }
  return docFromTypeNode(`${name}Props`, propsType, sourceFile, locals, cva, defaults);
}

function inferFromFunction(
  name: string,
  fn: ts.FunctionDeclaration | ts.ArrowFunction | ts.FunctionExpression,
  sourceFile: ts.SourceFile,
  locals: Map<string, LocalType>,
  cva: Map<string, Map<string, CvaVariant>>,
  defaults: Map<string, string>,
): PropsDoc | undefined {
  const param = fn.parameters[0];
  if (!param?.type) return undefined;
  return docFromTypeNode(`${name}Props`, param.type, sourceFile, locals, cva, defaults);
}

function inferFromReexport(name: string, initializer: ts.Expression): PropsDoc | undefined {
  const inner = unwrapExpression(initializer);
  if (ts.isPropertyAccessExpression(inner) || ts.isIdentifier(inner)) {
    const text = inner.getText().replace(/\s+/g, " ").trim();
    return {
      interfaceName: `${name}Props`,
      extends: `Extends ComponentProps<typeof ${text}>`,
      props: [],
    };
  }
  return undefined;
}

function docFromTypeNode(
  interfaceName: string,
  type: ts.TypeNode,
  sourceFile: ts.SourceFile,
  locals: Map<string, LocalType>,
  cva: Map<string, Map<string, CvaVariant>>,
  defaults: Map<string, string>,
): PropsDoc {
  const seen = new Set<string>();
  const props: PropDef[] = [];
  const members = membersFromType(type, sourceFile, locals, new Set(), cva, props, seen);
  props.push(...propsFromSignatures(members, sourceFile, defaults, seen));
  return {
    interfaceName,
    ...(typeAliasExtendsNote(type, locals) ? { extends: typeAliasExtendsNote(type, locals) } : {}),
    props,
  };
}

function hasDocNamed(docs: PropsDoc[], name: string): boolean {
  return docs.some((doc) => doc.interfaceName === name);
}

/** Extract the documented props of one component source file. */
function extractPropsDocs(filePath: string, fileText: string): PropsDoc[] {
  const sourceFile = ts.createSourceFile(
    filePath,
    fileText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const defaults = collectDefaults(sourceFile);
  const cva = collectCvaVariants(sourceFile);
  const locals = collectLocalTypes(sourceFile);
  const docs: PropsDoc[] = [];

  for (const statement of sourceFile.statements) {
    if (isExportedPropsInterface(statement)) {
      const seen = new Set<string>();
      const props = propsFromSignatures(statement.members, sourceFile, defaults, seen);

      const extendsClauses = statement.heritageClauses?.filter(
        (clause) => clause.token === ts.SyntaxKind.ExtendsKeyword,
      );
      for (const clause of extendsClauses ?? []) {
        for (const type of clause.types) {
          pushCvaAxes(variantPropsFor(type, cva, sourceFile), props, seen);
          if (ts.isIdentifier(type.expression)) {
            const local = locals.get(type.expression.text);
            if (local && ts.isInterfaceDeclaration(local)) {
              props.push(...propsFromSignatures(local.members, sourceFile, defaults, seen));
            }
          }
        }
      }

      docs.push({
        interfaceName: statement.name.text,
        ...(extendsNote(statement) ? { extends: extendsNote(statement) } : {}),
        props,
      });
      continue;
    }

    if (isExportedPropsTypeAlias(statement) || isExportedLabelsType(statement)) {
      if (ts.isInterfaceDeclaration(statement)) {
        const seen = new Set<string>();
        docs.push({
          interfaceName: statement.name.text,
          ...(extendsNote(statement) ? { extends: extendsNote(statement) } : {}),
          props: propsFromSignatures(statement.members, sourceFile, defaults, seen),
        });
        continue;
      }
      docs.push(
        docFromTypeNode(statement.name.text, statement.type, sourceFile, locals, cva, defaults),
      );
    }
  }

  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement) && isExported(statement) && statement.name) {
      const name = statement.name.text;
      if (!/^[A-Z]/.test(name)) continue;
      const inferred = inferFromFunction(name, statement, sourceFile, locals, cva, defaults);
      if (inferred && !hasDocNamed(docs, inferred.interfaceName)) docs.push(inferred);
      continue;
    }

    if (!ts.isVariableStatement(statement) || !isExported(statement)) continue;
    for (const decl of statement.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || !decl.initializer) continue;
      const name = decl.name.text;
      if (!/^[A-Z]/.test(name)) continue;
      if (hasDocNamed(docs, `${name}Props`)) continue;
      const init = unwrapExpression(decl.initializer);
      const inferred =
        inferFromForwardRef(name, init, sourceFile, locals, cva, defaults) ??
        (ts.isArrowFunction(init) || ts.isFunctionExpression(init)
          ? inferFromFunction(name, init, sourceFile, locals, cva, defaults)
          : inferFromReexport(name, init));
      if (inferred) docs.push(inferred);
    }
  }

  return docs.map(fillPassthroughProps);
}

/** Read every slug's source and build the slug → PropsDoc[] map (skips empties). */
export async function buildPropsMap(): Promise<Record<string, PropsDoc[]>> {
  const map: Record<string, PropsDoc[]> = {};

  for (const slug of SLUGS) {
    const filePath = join(componentsDir, `${slug}.tsx`);
    let fileText: string;
    try {
      fileText = await readFile(filePath, "utf8");
    } catch {
      // A slug without a source file simply yields no entry.
      continue;
    }

    const docs = extractPropsDocs(filePath, fileText);
    if (docs.length === 0) continue;
    map[slug] = docs;
  }

  return map;
}

/** Serialize one string for biome-clean TS output (double quotes, escaped). */
function quote(value: string): string {
  return JSON.stringify(value);
}

function serializeProp(prop: PropDef, indent: string): string {
  const lines: string[] = [`${indent}{`];
  lines.push(`${indent}  name: ${quote(prop.name)},`);
  lines.push(`${indent}  type: ${quote(prop.type)},`);
  lines.push(`${indent}  required: ${prop.required},`);
  if (prop.description !== undefined) {
    lines.push(`${indent}  description: ${quote(prop.description)},`);
  }
  if (prop.default !== undefined) {
    lines.push(`${indent}  default: ${quote(prop.default)},`);
  }
  lines.push(`${indent}},`);
  return lines.join("\n");
}

function serializeDoc(doc: PropsDoc, indent: string): string {
  const lines: string[] = [`${indent}{`];
  lines.push(`${indent}  interfaceName: ${quote(doc.interfaceName)},`);
  if (doc.extends !== undefined) {
    lines.push(`${indent}  extends: ${quote(doc.extends)},`);
  }
  if (doc.props.length === 0) {
    lines.push(`${indent}  props: [],`);
  } else {
    lines.push(`${indent}  props: [`);
    for (const prop of doc.props) {
      lines.push(serializeProp(prop, `${indent}    `));
    }
    lines.push(`${indent}  ],`);
  }
  lines.push(`${indent}},`);
  return lines.join("\n");
}

/**
 * Render the full `props.generated.ts` source. This emits syntactically valid
 * TypeScript; `renderModule` then runs it through Biome's formatter so the
 * committed output is byte-identical to a `biome format` no-op (long JSDoc
 * descriptions wrap exactly the way Biome would), and `biome check` never
 * rewrites it.
 */
export function serializePropsModule(map: Record<string, PropsDoc[]>): string {
  const header = [
    "// GENERATED FILE — do not edit; run `bun run props` to regenerate.",
    "//",
    "// Props/API tables extracted from exported `*Props` / `*Labels` types, plus",
    "// inferred forwardRef / function / re-export props, of every",
    "// @cronus-ui/ui component via the TypeScript compiler API (no module execution),",
    "// so the documented API can never drift from the source.",
    "",
    "export interface PropDef {",
    "  name: string;",
    "  type: string;",
    "  required: boolean;",
    "  description?: string;",
    "  default?: string;",
    "}",
    "",
    "export interface PropsDoc {",
    "  interfaceName: string;",
    "  extends?: string;",
    "  props: PropDef[];",
    "}",
    "",
    "export const COMPONENT_PROPS: Record<string, PropsDoc[]> = {",
  ];

  const body: string[] = [];
  for (const [slug, docs] of Object.entries(map)) {
    body.push(`  ${quote(slug)}: [`);
    for (const doc of docs) {
      body.push(serializeDoc(doc, "    "));
    }
    body.push("  ],");
  }

  const footer = ["};", ""];

  return `${[...header, ...body, ...footer].join("\n")}`;
}

/**
 * Pipe source through Biome's formatter (as `props.generated.ts`) so the emitted
 * text matches the repo's biome config exactly. Both the generator and the gate
 * call this, so the in-memory candidate and the committed file are byte-identical.
 */
function formatWithBiome(source: string): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    const proc = spawn("bunx", ["biome", "format", `--stdin-file-path=${outFile}`], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    proc.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`biome format failed (exit ${code}):\n${stderr}`));
        return;
      }
      resolvePromise(stdout);
    });

    proc.stdin.write(source);
    proc.stdin.end();
  });
}

/** Build the props map and return the final, Biome-formatted module source. */
export async function renderModule(): Promise<string> {
  const map = await buildPropsMap();
  return formatWithBiome(serializePropsModule(map));
}

async function main(): Promise<void> {
  const map = await buildPropsMap();
  const source = await formatWithBiome(serializePropsModule(map));
  await writeFile(outFile, source, "utf8");
  console.log(`props: wrote ${Object.keys(map).length} components to ${outFile}`);
}

// Only run when invoked directly (not when imported by check-props.ts).
if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

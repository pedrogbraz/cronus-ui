// GENERATED FILE — do not edit; run `bun run props` to regenerate.
//
// Props/API tables extracted from the exported `*Props` interfaces of every
// @cronus-ui/ui component via the TypeScript compiler API (no module execution),
// so the documented API can never drift from the source.

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

export const COMPONENT_PROPS: Record<string, PropsDoc[]> = {
  button: [
    {
      interfaceName: "ButtonProps",
      extends:
        "Extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "variant",
          type: '"primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"',
          required: false,
          default: '"primary"',
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg" | "icon" | "icon-sm"',
          required: false,
          default: '"md"',
        },
      ],
    },
  ],
  "animated-button": [
    {
      interfaceName: "AnimatedButtonProps",
      extends: "Extends ButtonProps",
      props: [],
    },
  ],
  toggle: [
    {
      interfaceName: "ToggleProps",
      extends:
        "Extends ComponentPropsWithoutRef<typeof TogglePrimitive.Root>, VariantProps<typeof toggleVariants>",
      props: [
        {
          name: "variant",
          type: '"default" | "outline"',
          required: false,
          default: '"default"',
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          required: false,
          default: '"md"',
        },
      ],
    },
  ],
  "copy-button": [
    {
      interfaceName: "CopyButtonProps",
      extends: 'Extends Omit<ButtonProps, "value" | "children">',
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          description: "Text written to the clipboard when the button is pressed.",
        },
        {
          name: "timeout",
          type: "number",
          required: false,
          description:
            'Milliseconds the "copied" state stays visible before reverting. Defaults to 1500.',
          default: "1500",
        },
        {
          name: "copyLabel",
          type: "string",
          required: false,
          description:
            'Accessible label shown to assistive tech in the idle state. Defaults to "Copy".',
          default: '"Copy"',
        },
        {
          name: "copiedLabel",
          type: "string",
          required: false,
          description: 'Accessible label announced after a successful copy. Defaults to "Copied".',
          default: '"Copied"',
        },
      ],
    },
  ],
  "button-group": [
    {
      interfaceName: "ButtonGroupProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          required: false,
          description: "Layout direction of the grouped buttons.",
          default: '"horizontal"',
        },
      ],
    },
  ],
  fab: [
    {
      interfaceName: "FabProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [
        {
          name: "icon",
          type: "ReactNode",
          required: true,
          description: "The main glyph shown inside the floating button.",
        },
        {
          name: "label",
          type: "string",
          required: true,
          description: "Accessible name for the main button — wired to `aria-label`.",
        },
        {
          name: "actions",
          type: "FabAction[]",
          required: false,
          description:
            "Optional speed-dial actions. When provided, clicking the FAB toggles an expanded vertical stack of smaller round buttons rendered above it.",
        },
      ],
    },
  ],
  "split-button": [
    {
      interfaceName: "SplitButtonProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onClick">',
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          description: "The primary action's label.",
        },
        {
          name: "onClick",
          type: "MouseEventHandler<HTMLButtonElement>",
          required: false,
          description: "Fires when the primary (left) segment is clicked.",
        },
        {
          name: "icon",
          type: "ReactNode",
          required: false,
          description:
            "Optional leading icon for the primary segment (replaced by a spinner while `loading`).",
        },
        {
          name: "items",
          type: "SplitButtonItem[]",
          required: false,
          description:
            "Declarative secondary actions. Ignored when a custom `menu` slot is supplied.",
        },
        {
          name: "menu",
          type: "ReactNode",
          required: false,
          description:
            "Escape hatch for fully custom menu content (compose `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuLabel`, …). Takes precedence over `items`.",
        },
        {
          name: "variant",
          type: "SplitButtonVariant",
          required: false,
          description: "Visual style, shared by both segments — mirrors `Button`'s variants.",
          default: '"primary"',
        },
        {
          name: "size",
          type: "SplitButtonSize",
          required: false,
          description: "Control height/density, shared by both segments.",
          default: '"md"',
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables both segments.",
          default: "false",
        },
        {
          name: "loading",
          type: "boolean",
          required: false,
          description: "Shows a spinner in the primary segment and disables the control.",
          default: "false",
        },
        {
          name: "menuLabel",
          type: "string",
          required: false,
          description: "Accessible name for the icon-only menu trigger.",
          default: '"More actions"',
        },
        {
          name: "align",
          type: '"start" | "center" | "end"',
          required: false,
          description: "Horizontal alignment of the menu relative to the trigger.",
          default: '"end"',
        },
        {
          name: "sideOffset",
          type: "number",
          required: false,
          description: "Gap in px between the trigger and the opened menu.",
          default: "6",
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Class applied to the dropdown menu surface.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          required: false,
          description: "Uncontrolled initial open state of the menu.",
        },
        {
          name: "open",
          type: "boolean",
          required: false,
          description: "Controlled open state of the menu.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          required: false,
          description: "Notified whenever the menu opens or closes.",
        },
      ],
    },
  ],
  "mode-toggle": [
    {
      interfaceName: "ModeToggleProps",
      extends: 'Extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">',
      props: [
        {
          name: "mode",
          type: "ModeToggleMode",
          required: true,
          description:
            "The current color mode. The component is fully controlled — it never stores mode itself.",
        },
        {
          name: "onModeChange",
          type: "(next: ModeToggleMode) => void",
          required: true,
          description:
            "Called with the opposite mode when the button is activated (click, Enter or Space).",
        },
        {
          name: "size",
          type: "ModeToggleSize",
          required: false,
          description:
            "Button footprint: `sm` (32px, 16px glyph) or `md` (36px, 20px glyph). Defaults to `md`.",
          default: '"md"',
        },
      ],
    },
  ],
  input: [
    {
      interfaceName: "InputProps",
      extends: "Extends InputHTMLAttributes<HTMLInputElement>",
      props: [
        {
          name: "invalid",
          type: "boolean",
          required: false,
          default: "false",
        },
      ],
    },
  ],
  "input-group": [
    {
      interfaceName: "InputGroupProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [],
    },
    {
      interfaceName: "InputGroupAddonProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "align",
          type: '"start" | "end"',
          required: false,
          description:
            'Which side the addon flanks. Affects the divider edge. Defaults to "start".',
          default: '"start"',
        },
      ],
    },
  ],
  "password-input": [
    {
      interfaceName: "PasswordInputProps",
      extends: 'Extends Omit<InputHTMLAttributes<HTMLInputElement>, "type">',
      props: [
        {
          name: "invalid",
          type: "boolean",
          required: false,
        },
        {
          name: "showStrength",
          type: "boolean",
          required: false,
          description: "Show a 4-segment strength meter + label below the field.",
          default: "false",
        },
      ],
    },
  ],
  textarea: [
    {
      interfaceName: "TextareaProps",
      extends: "Extends TextareaHTMLAttributes<HTMLTextAreaElement>",
      props: [
        {
          name: "invalid",
          type: "boolean",
          required: false,
          default: "false",
        },
      ],
    },
  ],
  combobox: [
    {
      interfaceName: "ComboboxProps",
      props: [
        {
          name: "options",
          type: "ComboboxOption[]",
          required: true,
          description: "The list of selectable options.",
        },
        {
          name: "value",
          type: "string",
          required: false,
          description: "Controlled selected value. Pair with `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
          description: "Initial value for uncontrolled usage.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          required: false,
          description: "Called with the new value when the selection changes.",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Text shown on the trigger when nothing is selected.",
          default: '"Select an option…"',
        },
        {
          name: "searchPlaceholder",
          type: "string",
          required: false,
          description: "Placeholder for the search input inside the popover.",
          default: '"Search…"',
        },
        {
          name: "emptyText",
          type: "string",
          required: false,
          description: "Message rendered when no option matches the search.",
          default: '"No results found."',
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables the trigger entirely.",
          default: "false",
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Extra classes for the trigger button.",
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the popover content.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name for the trigger when there is no visible label.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          description: "ID of an element labelling the trigger.",
        },
      ],
    },
  ],
  "multi-select": [
    {
      interfaceName: "MultiSelectProps",
      props: [
        {
          name: "options",
          type: "MultiSelectOption[]",
          required: true,
          description: "Options shown in the searchable list.",
        },
        {
          name: "value",
          type: "string[]",
          required: false,
          description: "Controlled selection. Provide together with `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "string[]",
          required: false,
          description: "Uncontrolled initial selection.",
        },
        {
          name: "onValueChange",
          type: "(value: string[]) => void",
          required: false,
          description: "Called with the next selection whenever it changes.",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Text shown in the trigger when nothing is selected.",
          default: '"Select…"',
        },
        {
          name: "searchPlaceholder",
          type: "string",
          required: false,
          description: "Placeholder for the search input inside the popover.",
          default: '"Search…"',
        },
        {
          name: "emptyText",
          type: "string",
          required: false,
          description: "Text shown when the search yields no results.",
          default: '"No results found."',
        },
        {
          name: "maxDisplay",
          type: "number",
          required: false,
          description:
            'Maximum number of chips to render before collapsing the rest into a "+N" badge. When omitted, every selected chip is rendered.',
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disable the whole control.",
          default: "false",
        },
        {
          name: "removeLastOnBackspace",
          type: "boolean",
          required: false,
          description:
            "When true (default), pressing Backspace with an empty search removes the last selected item.",
          default: "true",
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Extra classes for the trigger button.",
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the popover content.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible label for the trigger when no visible label is associated.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          description: "id of an element that labels the trigger.",
        },
        {
          name: "aria-invalid",
          type: 'boolean | "true" | "false"',
          required: false,
          description:
            "Marks the trigger as invalid (e.g. from a Form layer), applying error styling.",
        },
        {
          name: "open",
          type: "boolean",
          required: false,
          description: "Controls the popover open state (controlled).",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          required: false,
          description: "Initial popover open state (uncontrolled).",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          required: false,
          description: "Called when the popover open state changes.",
        },
      ],
    },
  ],
  "tags-input": [
    {
      interfaceName: "TagsInputProps",
      props: [
        {
          name: "value",
          type: "string[]",
          required: false,
          description: "Controlled list of committed tags. Pair with `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "string[]",
          required: false,
          description: "Initial tags for uncontrolled usage.",
        },
        {
          name: "onValueChange",
          type: "(tags: string[]) => void",
          required: false,
          description: "Called with the next list of tags whenever a tag is added or removed.",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Placeholder shown in the text field when it is empty.",
        },
        {
          name: "max",
          type: "number",
          required: false,
          description: "Maximum number of tags. Once reached, further additions are ignored.",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables typing and tag removal.",
          default: "false",
        },
        {
          name: "allowDuplicates",
          type: "boolean",
          required: false,
          description: "When true, the same tag may be added more than once. Defaults to false.",
          default: "false",
        },
        {
          name: "delimiter",
          type: "string | string[]",
          required: false,
          description:
            'Characters that commit the current input as a tag, in addition to Enter. Defaults to a comma, so both Enter and "," commit.',
          default: "DEFAULT_DELIMITERS",
        },
        {
          name: "validate",
          type: "(tag: string) => boolean",
          required: false,
          description: "Reject a tag when this returns false. Receives the trimmed candidate.",
        },
        {
          name: "aria-invalid",
          type: 'boolean | "true" | "false"',
          required: false,
          description: "Marks the field as invalid, applying error styling.",
        },
        {
          name: "id",
          type: "string",
          required: false,
          description: "Native id for the text input (for an external `<label htmlFor>`).",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name for the text input when there is no visible label.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          description: "id of an element that labels the text input.",
        },
        {
          name: "name",
          type: "string",
          required: false,
          description: "Native name for the text input.",
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Extra classes for the field wrapper.",
        },
        {
          name: "inputClassName",
          type: "string",
          required: false,
          description: "Extra classes for the inner text input.",
        },
      ],
    },
  ],
  "file-dropzone": [
    {
      interfaceName: "FileDropzoneProps",
      props: [
        {
          name: "onFiles",
          type: "(files: File[]) => void",
          required: true,
        },
        {
          name: "accept",
          type: "string",
          required: false,
        },
        {
          name: "multiple",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "className",
          type: "string",
          required: false,
        },
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description:
            'Accessible name for the file input. Defaults to `"Upload files"` so the control is never nameless.',
        },
        {
          name: "aria-describedby",
          type: "string",
          required: false,
          description: "IDs of element(s) that describe the dropzone (e.g. accepted types).",
        },
      ],
    },
  ],
  "number-input": [
    {
      interfaceName: "NumberInputProps",
      props: [
        {
          name: "value",
          type: "number | null",
          required: false,
          description: "Controlled value. Pair with `onValueChange`. Use `null` for empty.",
        },
        {
          name: "defaultValue",
          type: "number | null",
          required: false,
          description: "Initial value for uncontrolled usage.",
          default: "null",
        },
        {
          name: "onValueChange",
          type: "(value: number | null) => void",
          required: false,
          description: "Called with the new value (or `null` when cleared) on every change.",
        },
        {
          name: "min",
          type: "number",
          required: false,
          description: "Minimum allowed value. The decrement stepper disables at this bound.",
        },
        {
          name: "max",
          type: "number",
          required: false,
          description: "Maximum allowed value. The increment stepper disables at this bound.",
        },
        {
          name: "step",
          type: "number",
          required: false,
          description: "Increment for steppers and Arrow keys. Defaults to `1`.",
          default: "1",
        },
        {
          name: "largeStep",
          type: "number",
          required: false,
          description: "Larger increment for PageUp / PageDown. Defaults to `step * 10`.",
        },
        {
          name: "precision",
          type: "number",
          required: false,
          description: "Number of decimal places to round and display the committed value to.",
        },
        {
          name: "format",
          type: "(value: number) => string",
          required: false,
          description: "Custom formatter for the displayed value when not focused.",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables the input and both steppers.",
          default: "false",
        },
        {
          name: "invalid",
          type: "boolean",
          required: false,
          description: "Marks the field as invalid (forwarded to the underlying Input).",
          default: "false",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Placeholder shown when the field is empty.",
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Extra classes for the wrapper element.",
        },
        {
          name: "inputClassName",
          type: "string",
          required: false,
          description: "Extra classes for the underlying input.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name for the spinbutton when there is no visible label.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          description: "ID of an element labelling the spinbutton.",
        },
        {
          name: "aria-describedby",
          type: "string",
          required: false,
          description: "ID of an element describing the spinbutton.",
        },
        {
          name: "id",
          type: "string",
          required: false,
          description: "Native id for the input.",
        },
        {
          name: "name",
          type: "string",
          required: false,
          description: "Native name for the input (form submission).",
        },
        {
          name: "onBlur",
          type: "(event: FocusEvent<HTMLInputElement>) => void",
          required: false,
          description: "Called when the input loses focus.",
        },
      ],
    },
  ],
  autocomplete: [
    {
      interfaceName: "AutocompleteProps",
      extends:
        'Extends Omit< InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "onSelect" | "role" >',
      props: [
        {
          name: "options",
          type: "AutocompleteOption[]",
          required: false,
          description:
            "Static suggestions. When omitted, provide `onSearch` to fetch suggestions for the current query asynchronously.",
        },
        {
          name: "onSearch",
          type: "(query: string) => Promise<AutocompleteOption[]>",
          required: false,
          description:
            "Async resolver invoked (debounced) with the current query. Return the suggestions to render. Use together with `loading` for the busy state, or let the component manage `loading` automatically when `options` is omitted.",
        },
        {
          name: "value",
          type: "string",
          required: false,
          description: "Controlled free-text value. Pair with `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
          description: "Initial value for uncontrolled usage.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          required: false,
          description: "Called with the new free-text value on every keystroke or selection.",
        },
        {
          name: "onSelect",
          type: "(option: AutocompleteOption) => void",
          required: false,
          description: "Called when a suggestion is committed (click / Enter on a highlight).",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Placeholder for the text input.",
          default: '"Type to search…"',
        },
        {
          name: "emptyText",
          type: "string",
          required: false,
          description: "Message rendered when there are no suggestions for the query.",
          default: '"No results found."',
        },
        {
          name: "loading",
          type: "boolean",
          required: false,
          description:
            "Forces the busy state (spinner + skeletons). When `onSearch` is provided and this is left undefined, the component tracks pending searches itself.",
        },
        {
          name: "debounceMs",
          type: "number",
          required: false,
          description: "Debounce, in ms, before `onSearch` fires or local filtering re-runs.",
          default: "200",
        },
        {
          name: "allowCustomValue",
          type: "boolean",
          required: false,
          description:
            "When true (default), the committed value can be free text that is not in the suggestion list. When false, blurring or Enter with non-matching text reverts to the last valid value.",
          default: "true",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disable the whole control.",
          default: "false",
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the popover content.",
        },
        {
          name: "loadingSkeletonRows",
          type: "number",
          required: false,
          description: "Number of skeleton rows to show while loading.",
          default: "3",
        },
      ],
    },
  ],
  stepper: [
    {
      interfaceName: "StepperProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">',
      props: [
        {
          name: "value",
          type: "number",
          required: false,
          description:
            "Controlled active step index. When provided the stepper is fully controlled.",
        },
        {
          name: "defaultValue",
          type: "number",
          required: false,
          description: "Initial active step index for the uncontrolled case. Defaults to `0`.",
          default: "0",
        },
        {
          name: "onValueChange",
          type: "(value: number) => void",
          required: false,
          description: "Called whenever a step should become active (controlled or not).",
        },
        {
          name: "orientation",
          type: "StepperOrientation",
          required: false,
          description: 'Layout axis. Defaults to `"horizontal"`.',
          default: '"horizontal"',
        },
        {
          name: "labels",
          type: "Partial<StepperLabels>",
          required: false,
          description: "Localize the sr-only step-state announcements. See .",
        },
      ],
    },
    {
      interfaceName: "StepperItemProps",
      extends: "Extends HTMLAttributes<HTMLLIElement>",
      props: [
        {
          name: "step",
          type: "number",
          required: true,
          description:
            "This step's zero-based index. Required so the item can derive its state (completed / active / upcoming) from the stepper's active value.",
        },
        {
          name: "completed",
          type: "boolean",
          required: false,
          description: 'Mark the step done explicitly. Overrides the index-derived "completed".',
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disable interaction + dim the step.",
          default: "false",
        },
      ],
    },
    {
      interfaceName: "StepperIndicatorProps",
      extends:
        'Extends HTMLAttributes<HTMLSpanElement>, Omit<VariantProps<typeof stepperIndicatorVariants>, "state">',
      props: [
        {
          name: "children",
          type: 'HTMLAttributes<HTMLSpanElement>["children"]',
          required: false,
          description: "Override the auto-rendered content (step number / check).",
        },
      ],
    },
    {
      interfaceName: "StepperTriggerProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [],
    },
  ],
  "rich-text-editor": [
    {
      interfaceName: "RichTextEditorProps",
      props: [
        {
          name: "value",
          type: "string",
          required: false,
          description:
            "Controlled HTML value. When provided, external changes are synced into the editor.",
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
          description: "Uncontrolled initial HTML content. Ignored once the editor has mounted.",
        },
        {
          name: "onChange",
          type: "(html: string) => void",
          required: false,
          description: "Called with the serialized HTML whenever the document changes.",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Placeholder shown while the document is empty.",
        },
        {
          name: "editable",
          type: "boolean",
          required: false,
          description: "Whether the content is editable. Defaults to `true`.",
          default: "true",
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Extra classes for the editor shell (toolbar + content wrapper).",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible label for the editable region.",
        },
      ],
    },
  ],
  rating: [
    {
      interfaceName: "RatingProps",
      extends: "Extends VariantProps<typeof ratingVariants>",
      props: [
        {
          name: "value",
          type: "number",
          required: false,
          description: "Controlled value. Pair with `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "number",
          required: false,
          description: "Initial value for uncontrolled usage. Defaults to `0`.",
          default: "0",
        },
        {
          name: "onValueChange",
          type: "(value: number) => void",
          required: false,
          description: "Called with the new value whenever the rating changes.",
        },
        {
          name: "max",
          type: "number",
          required: false,
          description: "Number of stars. Defaults to `5`.",
          default: "5",
        },
        {
          name: "readOnly",
          type: "boolean",
          required: false,
          description: "Renders display-only with no interaction. Defaults to `false`.",
          default: "false",
        },
        {
          name: "allowHalf",
          type: "boolean",
          required: false,
          description: "Allows half-star (0.5) granularity. Defaults to `false`.",
          default: "false",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          required: false,
          description: 'Star size preset. Defaults to `"md"`.',
          default: '"md"',
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name for the rating when there is no visible label.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          description: "ID of an element labelling the rating.",
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Extra classes for the wrapper element.",
        },
      ],
    },
  ],
  "color-picker": [
    {
      interfaceName: "ColorPickerProps",
      props: [
        {
          name: "value",
          type: "string",
          required: false,
          description: "Controlled color as a CSS color string (ideally `oklch(l c h)`).",
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
          description: "Initial color for uncontrolled usage. Defaults to a brand-ish oklch.",
          default: "DEFAULT_VALUE",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          required: false,
          description: "Called with the new color, serialized as `oklch(l c h)`, on every change.",
        },
        {
          name: "swatches",
          type: "string[]",
          required: false,
          description: "Preset swatches shown as a row; clicking one selects it.",
          default: "DEFAULT_SWATCHES as unknown as string[]",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables the trigger and all panel controls.",
          default: "false",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name for the trigger when there is no visible label.",
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Extra classes for the trigger button.",
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the popover panel.",
        },
        {
          name: "id",
          type: "string",
          required: false,
          description: "Native id for the trigger.",
        },
      ],
    },
  ],
  "currency-input": [
    {
      interfaceName: "CurrencyInputProps",
      extends:
        'Extends Omit< InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "min" | "max" | "type" >',
      props: [
        {
          name: "value",
          type: "number | null",
          required: false,
          description:
            "Controlled amount in **minor units** (integer cents). Use `null` for empty. Pair with `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "number | null",
          required: false,
          description:
            "Initial amount in minor units for uncontrolled usage. Defaults to `null` (empty).",
          default: "null",
        },
        {
          name: "onValueChange",
          type: "(value: number | null, meta: CurrencyInputMeta) => void",
          required: false,
          description:
            "Fired on every edit with the amount in **minor units** (`null` when cleared) plus formatting `meta`.",
        },
        {
          name: "currencies",
          type: "CurrencyOption[]",
          required: false,
          description:
            "Selectable currencies. Defaults to BRL, USD and EUR. A single entry renders a static (non-interactive) prefix.",
        },
        {
          name: "currency",
          type: "string",
          required: false,
          description: "Controlled active currency code. Pair with `onCurrencyChange`.",
        },
        {
          name: "defaultCurrency",
          type: "string",
          required: false,
          description:
            "Initial active currency code for uncontrolled usage. Defaults to the first `currencies` entry.",
        },
        {
          name: "onCurrencyChange",
          type: "(code: string, meta: CurrencyInputMeta) => void",
          required: false,
          description:
            "Fired when the user picks a different currency (also re-fires `onValueChange` with the new `meta`).",
        },
        {
          name: "min",
          type: "number",
          required: false,
          description:
            "Lower clamp in minor units, enforced on blur. Defaults to `0` (no negatives).",
          default: "0",
        },
        {
          name: "max",
          type: "number",
          required: false,
          description:
            "Upper clamp in minor units — a hard live ceiling the value can never be typed past.",
        },
        {
          name: "invalid",
          type: "boolean",
          required: false,
          description: "Marks the field invalid (red border + `aria-invalid`).",
          default: "false",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables the field and the currency selector.",
          default: "false",
        },
        {
          name: "selectorLabel",
          type: "string",
          required: false,
          description: "Accessible name for the currency selector button.",
          default: '"Select currency"',
        },
        {
          name: "inputClassName",
          type: "string",
          required: false,
          description: "Extra classes for the underlying `<input>`.",
        },
      ],
    },
  ],
  "phone-input": [
    {
      interfaceName: "PhoneInputProps",
      extends:
        'Extends Omit< InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "type" >',
      props: [
        {
          name: "value",
          type: "string",
          required: false,
          description:
            'Controlled value as an E.164 string (e.g. `"+5511987654321"`). Pair with `onChange`.',
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
          description: "Initial E.164 (or bare national) value for uncontrolled usage.",
        },
        {
          name: "onChange",
          type: "(value: string) => void",
          required: false,
          description:
            "Called with the full E.164 string on every edit; empty string when no number is entered.",
        },
        {
          name: "defaultCountry",
          type: "string",
          required: false,
          description: 'ISO 3166-1 alpha-2 code selected on first render. Defaults to `"BR"`.',
          default: '"BR"',
        },
        {
          name: "countries",
          type: "PhoneCountry[]",
          required: false,
          description: "Overrides the built-in country list. Order controls the list order.",
          default: "DEFAULT_PHONE_COUNTRIES",
        },
        {
          name: "invalid",
          type: "boolean",
          required: false,
          description: "Marks the field invalid (red border/ring + `aria-invalid`).",
          default: "false",
        },
        {
          name: "searchPlaceholder",
          type: "string",
          required: false,
          description: "Placeholder for the country search box inside the selector.",
          default: '"Search country…"',
        },
        {
          name: "emptyText",
          type: "string",
          required: false,
          description: "Message shown when no country matches the search.",
          default: '"No country found."',
        },
        {
          name: "label",
          type: "string",
          required: false,
          description:
            'Accessible name for the whole control and the number field. Defaults to `"Phone number"`.',
          default: '"Phone number"',
        },
        {
          name: "countryLabel",
          type: "string",
          required: false,
          description:
            'Accessible name for the country selector trigger. Defaults to `"Select country"`.',
          default: '"Select country"',
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the country selector popover.",
        },
        {
          name: "name",
          type: "string",
          required: false,
          description:
            "Name for a hidden input carrying the E.164 value, so the field submits inside a form.",
        },
      ],
    },
  ],
  "credit-card-input": [
    {
      interfaceName: "CreditCardInputProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">',
      props: [
        {
          name: "label",
          type: "string",
          required: false,
          description: "Accessible group label announced to assistive tech.",
          default: '"Credit card"',
        },
        {
          name: "defaultNumber",
          type: "string",
          required: false,
          description: "Uncontrolled initial card number (digits or already-spaced).",
        },
        {
          name: "onChange",
          type: "(value: CreditCardValue) => void",
          required: false,
          description:
            "Fires on every keystroke with the parsed, validated card value. Display-side only — do not persist, log, or transmit the raw PAN/CVC.",
        },
        {
          name: "invalid",
          type: "boolean",
          required: false,
          description: "Forces the invalid styling and sets `aria-invalid` on every field.",
          default: "false",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables all three fields.",
          default: "false",
        },
        {
          name: "error",
          type: "string",
          required: false,
          description: 'Optional error message rendered under the group with `role="alert"`.',
        },
      ],
    },
  ],
  "floating-label-input": [
    {
      interfaceName: "FloatingLabelInputProps",
      extends: 'Extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder">',
      props: [
        {
          name: "label",
          type: "ReactNode",
          required: true,
          description:
            "The label text. Sits in the placeholder position, then floats up when the field is focused or filled.",
        },
        {
          name: "helperText",
          type: "ReactNode",
          required: false,
          description:
            "Optional caption rendered under the field and linked to the input via `aria-describedby`. Turns into an error message when `invalid`.",
        },
        {
          name: "invalid",
          type: "boolean",
          required: false,
          description:
            'Marks the field invalid — drives the error border/ring, error label color, and an announced (`role="alert"`) helper.',
          default: "false",
        },
        {
          name: "startAdornment",
          type: "ReactNode",
          required: false,
          description:
            "Decorative content (usually an icon) pinned to the left; the label and input inset to make room.",
        },
        {
          name: "endAdornment",
          type: "ReactNode",
          required: false,
          description:
            "Content (icon or button) pinned to the right; the input insets to make room.",
        },
        {
          name: "labelClassName",
          type: "string",
          required: false,
          description: "Extra classes for the floating `<label>`.",
        },
      ],
    },
  ],
  "signature-pad": [
    {
      interfaceName: "SignaturePadProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">',
      props: [
        {
          name: "onChange",
          type: "(dataUrl: string | null) => void",
          required: false,
          description:
            "Fired when a stroke is committed, undone, or the pad is cleared. Receives a PNG data URL of the drawing, or `null` once the pad is empty again.",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Freezes the pad: pointer input is ignored and the overlay actions disable.",
          default: "false",
        },
      ],
    },
  ],
  chip: [
    {
      interfaceName: "ChipProps",
      extends:
        'Extends Omit<HTMLAttributes<HTMLElement>, "color">, Omit<VariantProps<typeof chipVariants>, "interactive" | "selected">',
      props: [
        {
          name: "variant",
          type: '"solid" | "soft" | "outline"',
          required: false,
          description: "Visual treatment: `solid` fill, `soft` 15% tint, or `outline`.",
          default: '"soft"',
        },
        {
          name: "color",
          type: '"neutral" | "primary" | "success" | "warning" | "error" | "info"',
          required: false,
          description: "Semantic hue applied by the variant recipe.",
          default: '"neutral"',
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          required: false,
          description: "Pill height / typography preset.",
          default: '"md"',
        },
        {
          name: "selected",
          type: "boolean",
          required: false,
          description:
            "Toggle state for filter-style chips. Any non-`undefined` value renders the chip as a `<button>` with `aria-pressed`; while `true` it also gains a leading check mark and emphasized styling.",
          default: "undefined",
        },
        {
          name: "icon",
          type: "ReactNode",
          required: false,
          description: "Leading icon slot rendered before the label (e.g. a lucide icon).",
        },
        {
          name: "avatar",
          type: "ReactNode",
          required: false,
          description:
            "Leading avatar slot (an `img`, `Avatar`, …) clipped to a circle and sized by `size`.",
        },
        {
          name: "onRemove",
          type: "() => void",
          required: false,
          description:
            "Makes the chip dismissible. On a static chip this renders a real, focusable remove button (Enter/Space activate it); on an interactive chip the affordance is decorative and Delete or Backspace on the focused chip removes it instead. Removal never triggers `onClick`, and removal clicks never propagate to ancestor click handlers.",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables the chip and its remove affordance.",
          default: "false",
        },
        {
          name: "labels",
          type: "Partial<ChipLabels>",
          required: false,
          description: "Override any subset of the built-in screen-reader strings. See .",
        },
      ],
    },
    {
      interfaceName: "ChipGroupProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name announcing what the chip collection represents.",
        },
      ],
    },
  ],
  "avatar-group": [
    {
      interfaceName: "AvatarGroupProps",
      extends:
        "Extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarGroupItemVariants>",
      props: [
        {
          name: "avatars",
          type: "AvatarGroupAvatar[]",
          required: false,
          description:
            "Avatars to stack. Compose `<Avatar>` children, or pass `avatars` for the data-driven shorthand. `avatars` takes precedence when both are provided.",
        },
        {
          name: "max",
          type: "number",
          required: false,
          description: 'Show the first `max` avatars, then a "+N" overflow chip for the rest.',
        },
        {
          name: "spacing",
          type: "string",
          required: false,
          description:
            "Horizontal overlap between avatars as a Tailwind negative-margin class (e.g. `-space-x-2`). Defaults to a tasteful offset.",
          default: '"-space-x-2"',
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          required: false,
          default: '"md"',
        },
      ],
    },
  ],
  badge: [
    {
      interfaceName: "BadgeProps",
      extends: "Extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants>",
      props: [
        {
          name: "variant",
          type: '"default" | "primary" | "secondary" | "outline" | "success" | "warning" | "destructive" | "error" | "info"',
          required: false,
          default: '"default"',
        },
      ],
    },
  ],
  "data-table": [
    {
      interfaceName: "DataTableProps",
      props: [
        {
          name: "columns",
          type: "ColumnDef<TData, TValue>[]",
          required: true,
        },
        {
          name: "data",
          type: "TData[]",
          required: true,
        },
        {
          name: "searchable",
          type: "boolean",
          required: false,
          description: "Show the toolbar with a global search field.",
        },
        {
          name: "searchPlaceholder",
          type: "string",
          required: false,
          description: 'Placeholder for the global search field. Defaults to "Search…".',
        },
        {
          name: "globalFilter",
          type: "string",
          required: false,
          description: "Controlled global filter value. Implies a controlled toolbar search.",
        },
        {
          name: "onGlobalFilterChange",
          type: "OnChangeFn<string>",
          required: false,
          description: "Called when the global filter changes (controlled or uncontrolled).",
        },
        {
          name: "facetedFilters",
          type: "DataTableFacetedFilter[]",
          required: false,
          description: "Faceted (multi-select) column filters rendered in the toolbar.",
        },
        {
          name: "toolbarStart",
          type: "ReactNode",
          required: false,
          description: "Extra nodes rendered on the left side of the toolbar.",
        },
        {
          name: "toolbarEnd",
          type: "ReactNode",
          required: false,
          description:
            "Extra nodes rendered on the right side of the toolbar (before the View menu).",
        },
        {
          name: "enableColumnVisibility",
          type: "boolean",
          required: false,
          description: 'Show the "View" menu that toggles column visibility.',
        },
        {
          name: "columnVisibility",
          type: "VisibilityState",
          required: false,
          description: "Controlled column visibility state.",
        },
        {
          name: "onColumnVisibilityChange",
          type: "OnChangeFn<VisibilityState>",
          required: false,
          description: "Called when column visibility changes.",
        },
        {
          name: "sorting",
          type: "SortingState",
          required: false,
          description: "Controlled sorting state.",
        },
        {
          name: "onSortingChange",
          type: "OnChangeFn<SortingState>",
          required: false,
          description: "Called when sorting changes.",
        },
        {
          name: "manualSorting",
          type: "boolean",
          required: false,
          description: "Server-side sorting: skip the client sort model.",
        },
        {
          name: "columnFilters",
          type: "ColumnFiltersState",
          required: false,
          description: "Controlled column filters state.",
        },
        {
          name: "onColumnFiltersChange",
          type: "OnChangeFn<ColumnFiltersState>",
          required: false,
          description: "Called when column filters change.",
        },
        {
          name: "manualFiltering",
          type: "boolean",
          required: false,
          description: "Server-side filtering: skip the client filter model.",
        },
        {
          name: "pagination",
          type: "boolean",
          required: false,
          description: "Show the pagination footer.",
        },
        {
          name: "paginationState",
          type: "PaginationState",
          required: false,
          description: "Controlled pagination state.",
        },
        {
          name: "onPaginationChange",
          type: "OnChangeFn<PaginationState>",
          required: false,
          description: "Called when pagination changes (controlled).",
        },
        {
          name: "manualPagination",
          type: "boolean",
          required: false,
          description: "Server-side pagination: provide `pageCount` or `rowCount`.",
        },
        {
          name: "pageCount",
          type: "number",
          required: false,
          description: "Total page count for server-side pagination.",
        },
        {
          name: "rowCount",
          type: "number",
          required: false,
          description: "Total row count for server-side pagination (used to derive `pageCount`).",
        },
        {
          name: "initialPageSize",
          type: "number",
          required: false,
          description: "Initial page size when uncontrolled. Defaults to 10.",
        },
        {
          name: "pageSizeOptions",
          type: "number[]",
          required: false,
          description:
            "Page-size options offered in the footer select. Defaults to [10, 20, 30, 50].",
        },
        {
          name: "enableRowSelection",
          type: "boolean | ((row: Row<TData>) => boolean)",
          required: false,
          description: "Render a leading checkbox column with header select-all.",
        },
        {
          name: "rowSelection",
          type: "RowSelectionState",
          required: false,
          description: "Controlled row-selection state.",
        },
        {
          name: "onRowSelectionChange",
          type: "OnChangeFn<RowSelectionState>",
          required: false,
          description: "Called when row selection changes.",
        },
        {
          name: "bulkActions",
          type: "(rows: Row<TData>[]) => ReactNode",
          required: false,
          description:
            "Render slot for bulk actions. Receives the currently selected rows; shown in a bar above the table only while at least one row is selected.",
        },
        {
          name: "density",
          type: "DataTableDensity",
          required: false,
          description:
            "Controlled cell padding density. When provided, the toolbar toggle becomes controlled and you must update it via . Omit it to let the table manage density internally (see ).",
        },
        {
          name: "onDensityChange",
          type: "(density: DataTableDensity) => void",
          required: false,
          description: "Called when the density toggle is pressed (controlled or uncontrolled).",
        },
        {
          name: "initialDensity",
          type: "DataTableDensity",
          required: false,
          description: 'Initial density when uncontrolled. Defaults to "comfortable".',
        },
        {
          name: "enableDensityToggle",
          type: "boolean",
          required: false,
          description: "Show a comfortable/compact density toggle in the toolbar.",
        },
        {
          name: "enableCsvExport",
          type: "boolean",
          required: false,
          description: "Show a CSV export button in the toolbar.",
        },
        {
          name: "csvFileName",
          type: "string",
          required: false,
          description: 'Download file name (without extension). Defaults to "export".',
        },
        {
          name: "loading",
          type: "boolean",
          required: false,
          description: "Render skeleton rows instead of data.",
        },
        {
          name: "loadingRowCount",
          type: "number",
          required: false,
          description: "Number of skeleton rows while `loading`. Defaults to the page size or 5.",
        },
        {
          name: "error",
          type: "ReactNode",
          required: false,
          description: "Render an error state with an optional retry button.",
        },
        {
          name: "onRetry",
          type: "() => void",
          required: false,
          description: "Called when the error-state retry button is pressed.",
        },
        {
          name: "emptyState",
          type: "ReactNode",
          required: false,
          description: 'Custom empty-state content. Defaults to "No results.".',
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Class applied to the outer wrapper.",
        },
        {
          name: "toolbarLabel",
          type: "string",
          required: false,
          description: 'Accessible label for the toolbar region. Defaults to "Table controls".',
        },
        {
          name: "labels",
          type: "Partial<DataTableLabels>",
          required: false,
          description:
            "Override any subset of the built-in UI strings (selection checkbox labels, pagination, empty/loading/retry states…) for localization. Defaults are English; see .",
        },
        {
          name: "getRowLabel",
          type: "(row: Row<TData>) => string",
          required: false,
          description:
            'Accessible name for each row-selection checkbox, built from the row data (e.g. `(row) => "Select " + row.original.name`). Takes precedence over `labels.selectRow`. Only applies to the selection column injected by `enableRowSelection`.',
        },
      ],
    },
    {
      interfaceName: "DataTableColumnHeaderProps",
      props: [
        {
          name: "column",
          type: "Column<TData, TValue>",
          required: true,
        },
        {
          name: "title",
          type: "string",
          required: true,
        },
        {
          name: "className",
          type: "string",
          required: false,
        },
        {
          name: "labels",
          type: "Partial<DataTableColumnHeaderLabels>",
          required: false,
          description: "Localize the sort-button `aria-label`s. See .",
        },
      ],
    },
  ],
  metric: [
    {
      interfaceName: "MetricDeltaProps",
      extends: "Extends HTMLAttributes<HTMLSpanElement>",
      props: [
        {
          name: "trend",
          type: '"up" | "down" | "neutral"',
          required: false,
          default: '"neutral"',
        },
      ],
    },
  ],
  sparkline: [
    {
      interfaceName: "SparklineProps",
      extends: 'Extends Omit<SVGAttributes<SVGSVGElement>, "type">',
      props: [
        {
          name: "data",
          type: "number[]",
          required: true,
          description: "The series to plot. Order is preserved; values map left→right.",
        },
        {
          name: "width",
          type: "number",
          required: false,
          description: "Intrinsic width of the SVG in px.",
          default: "96",
        },
        {
          name: "height",
          type: "number",
          required: false,
          description: "Intrinsic height of the SVG in px.",
          default: "28",
        },
        {
          name: "type",
          type: "SparklineType",
          required: false,
          description: "Render a connected line or evenly spaced bars.",
          default: '"line"',
        },
        {
          name: "tone",
          type: "SparklineTone",
          required: false,
          description: "Color, mapped to a token via `currentColor`.",
          default: '"primary"',
        },
        {
          name: "area",
          type: "boolean",
          required: false,
          description: 'For `type="line"`, fill a soft token-tinted gradient under the line.',
          default: "false",
        },
        {
          name: "strokeWidth",
          type: "number",
          required: false,
          description: "Stroke width of the line (line type only).",
          default: "1.5",
        },
      ],
    },
  ],
  masonry: [
    {
      interfaceName: "MasonryProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "columns",
          type: "number | MasonryColumns",
          required: false,
          description:
            "Number of columns, either a fixed count or a responsive map keyed by breakpoint.",
          default: "DEFAULT_COLUMNS",
        },
        {
          name: "gap",
          type: "string",
          required: false,
          description:
            "CSS length used for both the column gap and the vertical gap between items.",
          default: '"1rem"',
        },
      ],
    },
  ],
  "comparison-slider": [
    {
      interfaceName: "ComparisonSliderProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">',
      props: [
        {
          name: "before",
          type: "ReactNode",
          required: true,
          description:
            'Content shown on the left, revealed by the clip (typically the "before" image).',
        },
        {
          name: "after",
          type: "ReactNode",
          required: true,
          description: 'Content shown as the full base layer (typically the "after" image).',
        },
        {
          name: "defaultPosition",
          type: "number",
          required: false,
          description: "Initial divider position as a percentage (0–100). Uncontrolled.",
          default: "50",
        },
        {
          name: "position",
          type: "number",
          required: false,
          description: "Controlled divider position as a percentage (0–100).",
        },
        {
          name: "onPositionChange",
          type: "(position: number) => void",
          required: false,
          description: "Called with the next position when the divider moves.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name for the divider handle.",
        },
      ],
    },
  ],
  heatmap: [
    {
      interfaceName: "HeatmapProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "HeatmapDay[]",
          required: true,
          description: "One item per day, laid out into week columns of 7 (top → bottom).",
        },
        {
          name: "levels",
          type: "number",
          required: false,
          description: "Number of discrete levels including the empty level 0.",
          default: "5",
        },
        {
          name: "weekCount",
          type: "number",
          required: false,
          description:
            "Hint for the intended number of week columns. Ignored — the data drives the layout — but accepted so callers can document intent.",
        },
      ],
    },
  ],
  "scroll-area": [
    {
      interfaceName: "ScrollAreaProps",
      extends: "Extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>",
      props: [
        {
          name: "aria-label",
          type: "string",
          required: false,
          description:
            'Accessible name for the scrollable viewport. Supply this when the content warrants a distinct name (e.g. "Release notes"); the viewport is always keyboard-focusable so it can be scrolled with the arrow keys regardless.',
        },
      ],
    },
  ],
  "code-block": [
    {
      interfaceName: "CodeBlockProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "children">',
      props: [
        {
          name: "code",
          type: "string",
          required: true,
          description: "Raw source to render and copy.",
        },
        {
          name: "language",
          type: "string",
          required: false,
          description: "Language label rendered as a Badge in the header.",
        },
        {
          name: "filename",
          type: "string",
          required: false,
          description: "File name rendered in the header.",
        },
        {
          name: "showLineNumbers",
          type: "boolean",
          required: false,
          description: "Render a gutter with 1-based line numbers. Defaults to false.",
          default: "false",
        },
      ],
    },
  ],
  "code-tabs": [
    {
      interfaceName: "CodeTabsProps",
      extends:
        'Extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "dir" | "onChange">',
      props: [
        {
          name: "items",
          type: "CodeTabsItem[]",
          required: true,
          description: "The snippets to switch between — one tab + one panel per item.",
        },
        {
          name: "defaultLabel",
          type: "string",
          required: false,
          description:
            "Label selected on first render. Falls back to the first item when omitted or unknown. When is set, a stored choice (applied after mount) wins over this.",
        },
        {
          name: "storageKey",
          type: "string",
          required: false,
          description:
            "Persist the chosen label to `localStorage` under this key and keep every `CodeTabs` sharing the key in sync — across the page *and* across browser tabs. The stored value is only read after mount, so server-rendered HTML and the first client render always agree (no hydration mismatch).",
        },
        {
          name: "onLabelChange",
          type: "(label: string) => void",
          required: false,
          description: "Called with the newly selected label on user-initiated changes.",
        },
      ],
    },
  ],
  "aspect-ratio": [
    {
      interfaceName: "AspectRatioProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ratio",
          type: "number",
          required: false,
          description:
            "The desired width-to-height ratio, expressed as a number (e.g. `16 / 9`, `1`, `4 / 3`). Defaults to `16 / 9`.",
          default: "16 / 9",
        },
      ],
    },
  ],
  "tree-view": [
    {
      interfaceName: "TreeViewProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">',
      props: [
        {
          name: "data",
          type: "TreeNode[]",
          required: true,
          description: "The hierarchy to render.",
        },
        {
          name: "value",
          type: "string",
          required: false,
          description: "Controlled selected node id.",
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
          description: "Initial selected node id for the uncontrolled case.",
        },
        {
          name: "onValueChange",
          type: "(id: string) => void",
          required: false,
          description: "Called when the selection changes (controlled or not).",
        },
        {
          name: "expandedIds",
          type: "string[]",
          required: false,
          description: "Controlled set of expanded branch ids.",
        },
        {
          name: "defaultExpandedIds",
          type: "string[]",
          required: false,
          description: "Initial expanded branch ids for the uncontrolled case.",
        },
        {
          name: "onExpandedChange",
          type: "(ids: string[]) => void",
          required: false,
          description: "Called whenever the expanded set changes (controlled or not).",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible label for the tree landmark.",
        },
      ],
    },
  ],
  timeline: [
    {
      interfaceName: "TimelineItemProps",
      extends: "Extends LiHTMLAttributes<HTMLLIElement>",
      props: [
        {
          name: "connector",
          type: "boolean",
          required: false,
          description:
            "Render the trailing connector line below this item's dot. Defaults to `true`; the rail draws a line down to the next event. Set `false` on the final item so the rail stops at its dot (auto-detected when the item is the last child of a , so this is rarely needed by hand).",
          default: "true",
        },
      ],
    },
    {
      interfaceName: "TimelineDotProps",
      extends:
        'Extends Omit<HTMLAttributes<HTMLSpanElement>, "color">, Omit<VariantProps<typeof timelineDotVariants>, "withIcon">',
      props: [
        {
          name: "icon",
          type: "ReactNode",
          required: false,
          description:
            "Optional glyph (e.g. a `lucide-react` icon) rendered inside the dot. When present the dot becomes a ring-bordered chip sized to hold it; otherwise it is a small solid disc.",
        },
      ],
    },
  ],
  kanban: [
    {
      interfaceName: "KanbanProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">',
      props: [
        {
          name: "columns",
          type: "KanbanColumn[]",
          required: true,
          description: "The board's columns and their cards (controlled).",
        },
        {
          name: "onColumnsChange",
          type: "(next: KanbanColumn[]) => void",
          required: true,
          description:
            "Called with the next columns after a reorder/move. The consumer owns state.",
        },
        {
          name: "renderItem",
          type: "(item: KanbanItem) => ReactNode",
          required: false,
          description:
            "Render a card's body. Defaults to the item's title + description in a Card-like tile. The drag handle and tile chrome are always provided.",
        },
      ],
    },
  ],
  "json-viewer": [
    {
      interfaceName: "JsonViewerProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "unknown",
          required: true,
          description: "The value to render. Objects and arrays become collapsible branches.",
        },
        {
          name: "defaultExpandedDepth",
          type: "number",
          required: false,
          description:
            "How many levels start expanded — a mount-time default, not a controlled value. Expansion state is uncontrolled per branch and seeded once when a branch first mounts, so later changes to this prop leave already-mounted branches untouched. The root value is depth 0, so the default of 1 shows the root's entries with every nested branch collapsed. Pass `Number.POSITIVE_INFINITY` to expand everything.",
          default: "1",
        },
      ],
    },
  ],
  "status-dot": [
    {
      interfaceName: "StatusDotProps",
      extends:
        'Extends Omit<HTMLAttributes<HTMLSpanElement>, "children">, VariantProps<typeof statusDotVariants>',
      props: [
        {
          name: "status",
          type: "StatusDotStatus",
          required: false,
          description:
            "Presence / semantic state the dot communicates. Drives the fill color and the default accessible name.",
          default: '"online"',
        },
        {
          name: "size",
          type: "StatusDotSize",
          required: false,
          description: "Dot size preset.",
          default: '"md"',
        },
        {
          name: "ring",
          type: "boolean",
          required: false,
          description:
            "Draws a surface-colored ring around the dot so it cuts out cleanly when overlaid on an avatar or icon.",
          default: "false",
        },
        {
          name: "label",
          type: "string",
          required: false,
          description:
            "Status text. Rendered next to the dot when `withLabel` is set; otherwise rendered as visually-hidden live-region content so screen readers announce both the initial status and later `status` changes.",
          default: 'The English name of `status` (e.g. `"Online"`).',
        },
        {
          name: "withLabel",
          type: "boolean",
          required: false,
          description:
            "Renders `label` visibly next to the dot (in `text-fg-secondary`) instead of exposing it only to assistive technology.",
          default: "false",
        },
        {
          name: "pulse",
          type: "boolean",
          required: false,
          description:
            'Animates an expanding "ping" halo behind the dot to draw attention. The halo reuses the dot\'s fill; the hollow `offline` dot gets a matching outline halo instead (its fill is transparent). The animation only runs for users who have not requested reduced motion.',
          default: "false",
        },
        {
          name: "position",
          type: "StatusDotPosition",
          required: false,
          description:
            'Absolute corner anchor for overlaying the dot on an avatar or icon — place the component inside a `relative` wrapper. The "right" corners map to the inline end, so they mirror under RTL.',
          default: '"none"',
        },
      ],
    },
  ],
  "image-zoom": [
    {
      interfaceName: "ImageZoomProps",
      extends:
        "Extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof imageZoomVariants>",
      props: [
        {
          name: "src",
          type: "string",
          required: false,
          description: "Image URL for the built-in `<img>`. Ignored when `children` is passed.",
        },
        {
          name: "alt",
          type: "string",
          required: false,
          description:
            "Describes the image for assistive tech. The root is a button whose `aria-label` overrides the inner image's alt, so the description is composed into the toggle's accessible name (`\"{labels.zoom}: {alt}\"`) in addition to serving as the built-in `<img>` alt.",
          default: '""',
        },
        {
          name: "zoom",
          type: "number",
          required: false,
          description: "Magnification applied while zoomed. Values below `1` clamp to `1`.",
          default: "2",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables all zoom interaction.",
          default: "false",
        },
        {
          name: "showIndicator",
          type: "boolean",
          required: false,
          description: "Renders the zoom-in indicator overlay, which fades out while zoomed.",
          default: "true",
        },
        {
          name: "labels",
          type: "Partial<ImageZoomLabels>",
          required: false,
          description: "Assistive strings, merged over the English defaults.",
        },
        {
          name: "zoomed",
          type: "boolean",
          required: false,
          description: "Controlled zoom state. Pair with `onZoomChange`.",
        },
        {
          name: "defaultZoomed",
          type: "boolean",
          required: false,
          description: "Initial zoom state for uncontrolled usage.",
          default: "false",
        },
        {
          name: "onZoomChange",
          type: "(zoomed: boolean) => void",
          required: false,
          description: "Called with the next state whenever zoom toggles on or off.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: false,
          description: "Custom image markup to zoom instead of the built-in `src` image.",
        },
      ],
    },
  ],
  "video-player": [
    {
      interfaceName: "VideoPlayerProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof videoPlayerVariants>",
      props: [
        {
          name: "src",
          type: "string",
          required: true,
          description: "Video source URL.",
        },
        {
          name: "poster",
          type: "string",
          required: false,
          description: "Preview image shown before the first frame is available.",
        },
        {
          name: "autoPlay",
          type: "boolean",
          required: false,
          description: "Starts playback automatically once the media can play.",
          default: "false",
        },
        {
          name: "loop",
          type: "boolean",
          required: false,
          description: "Restarts playback from the beginning when the video ends.",
          default: "false",
        },
        {
          name: "muted",
          type: "boolean",
          required: false,
          description: "Starts with the audio muted.",
          default: "false",
        },
        {
          name: "aspect",
          type: '"video" | "square" | "wide"',
          required: false,
          description: 'Frame aspect ratio: 16:9 (`"video"`), 1:1 (`"square"`) or 21:9 (`"wide"`).',
          default: '"video"',
        },
        {
          name: "labels",
          type: "Partial<VideoPlayerLabels>",
          required: false,
          description: "Control-label overrides for i18n. Every label defaults to English.",
        },
        {
          name: "videoRef",
          type: "Ref<HTMLVideoElement>",
          required: false,
          description: "Ref to the underlying `<video>` element, for imperative control.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: false,
          description:
            "Extra media children, e.g. a captions `<track>` or additional `<source>` elements.",
        },
      ],
    },
  ],
  "description-list": [
    {
      interfaceName: "DescriptionListProps",
      extends:
        "Extends HTMLAttributes<HTMLDListElement>, VariantProps<typeof descriptionListVariants>",
      props: [
        {
          name: "layout",
          type: '"stacked" | "horizontal" | "grid"',
          required: false,
          description:
            "How term/details pairs are arranged. `stacked` places each term above its details; `horizontal` aligns them into classic two-column rows with a divider between rows; `grid` spreads grouped pairs across a responsive 1 → 2 → 3 column set of card tiles.",
          default: '"stacked"',
        },
        {
          name: "size",
          type: '"sm" | "md"',
          required: false,
          description: "Density preset controlling the type scale and spacing.",
          default: '"md"',
        },
        {
          name: "striped",
          type: "boolean",
          required: false,
          description:
            "Tints alternate rows for scannability. The zebra counts only div-wrapped rows — wrap each pair in a row (or a plain `<div>`); raw `<dt>`/`<dd>` pairs are never counted or tinted.",
          default: "false",
        },
        {
          name: "bordered",
          type: "boolean",
          required: false,
          description: "Wraps the list in a rounded outer border and insets the content.",
          default: "false",
        },
        {
          name: "detailsAlign",
          type: '"start" | "end"',
          required: false,
          description:
            "Alignment of the details column. Logical (`text-start`/`text-end`), so `end` stays correct in RTL.",
          default: '"start"',
        },
      ],
    },
    {
      interfaceName: "DescriptionItemProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "term",
          type: "ReactNode",
          required: true,
          description: "The label rendered in the pair's .",
        },
      ],
    },
  ],
  alert: [
    {
      interfaceName: "AlertProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants>",
      props: [
        {
          name: "variant",
          type: '"default" | "info" | "success" | "warning" | "destructive"',
          required: false,
          default: '"default"',
        },
      ],
    },
  ],
  banner: [
    {
      interfaceName: "BannerProps",
      extends:
        'Extends Omit<HTMLAttributes<HTMLElement>, "title">, VariantProps<typeof bannerVariants>',
      props: [
        {
          name: "title",
          type: "ReactNode",
          required: false,
          description: "Headline text. Pair with `description`, or omit and pass `children`.",
        },
        {
          name: "description",
          type: "ReactNode",
          required: false,
          description: "Optional secondary line shown after the title.",
        },
        {
          name: "icon",
          type: "ReactNode",
          required: false,
          description: "Leading glyph rendered before the message (e.g. a lucide icon).",
        },
        {
          name: "action",
          type: "ReactNode",
          required: false,
          description: "Right-aligned call to action (a , link, etc.).",
        },
        {
          name: "dismissible",
          type: "boolean",
          required: false,
          description: "Render a trailing close button. Defaults to `true`.",
          default: "true",
        },
        {
          name: "onDismiss",
          type: "() => void",
          required: false,
          description: "Fired after the banner is dismissed (controlled or not).",
        },
        {
          name: "open",
          type: "boolean",
          required: false,
          description: "Controlled visibility. When provided, the component is fully controlled.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          required: false,
          description: "Initial visibility for the uncontrolled case. Defaults to `true`.",
          default: "true",
        },
        {
          name: "label",
          type: "string",
          required: false,
          description: 'Accessible label for the announcement region. Defaults to "Announcement".',
          default: '"Announcement"',
        },
        {
          name: "children",
          type: "ReactNode",
          required: false,
          description: "Free-form message body, used when `title`/`description` are not supplied.",
        },
        {
          name: "variant",
          type: '"default" | "brand" | "info" | "success" | "warning" | "error"',
          required: false,
          default: '"default"',
        },
        {
          name: "align",
          type: '"start" | "center"',
          required: false,
          default: '"center"',
        },
      ],
    },
  ],
  spinner: [
    {
      interfaceName: "SpinnerProps",
      extends: "Extends SVGAttributes<SVGSVGElement>, VariantProps<typeof spinnerVariants>",
      props: [
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          required: false,
          default: '"md"',
        },
      ],
    },
  ],
  "usage-meter": [
    {
      interfaceName: "UsageMeterProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "children">',
      props: [
        {
          name: "value",
          type: "number",
          required: true,
          description: "Current usage.",
        },
        {
          name: "max",
          type: "number",
          required: true,
          description: "The quota / limit the usage is measured against.",
        },
        {
          name: "label",
          type: "ReactNode",
          required: false,
          description: "Optional label shown beside (linear) or below (circular) the meter.",
        },
        {
          name: "unit",
          type: "string",
          required: false,
          description: 'Unit suffix appended to the value readout, e.g. "tokens".',
        },
        {
          name: "variant",
          type: "UsageMeterVariant",
          required: false,
          description: "Layout: a horizontal bar or an SVG ring.",
          default: '"linear"',
        },
        {
          name: "tone",
          type: "UsageMeterTone",
          required: false,
          description: "Color. `auto` derives severity from the usage ratio; others are explicit.",
          default: '"auto"',
        },
        {
          name: "formatValue",
          type: "(value: number, max: number) => string",
          required: false,
          description: "Override the `value / max` readout.",
        },
        {
          name: "showValue",
          type: "boolean",
          required: false,
          description: "Whether to render the textual value/percentage readout.",
          default: "true",
        },
        {
          name: "size",
          type: "number",
          required: false,
          description: "Diameter of the ring in px (circular variant only).",
          default: "96",
        },
      ],
    },
  ],
  sonner: [
    {
      interfaceName: "ToasterProps",
      extends: "Extends React.ComponentProps<typeof Sonner>",
      props: [],
    },
  ],
  dialog: [
    {
      interfaceName: "DialogContentProps",
      extends: "Extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>",
      props: [
        {
          name: "showCloseButton",
          type: "boolean",
          required: false,
          description:
            "Render the built-in top-right close button. Set `false` when the content supplies its own close affordance (e.g. a full-bleed gallery header).",
          default: "true",
        },
      ],
    },
  ],
  sheet: [
    {
      interfaceName: "SheetContentProps",
      extends:
        "Extends ComponentPropsWithoutRef<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants>",
      props: [
        {
          name: "side",
          type: '"top" | "right" | "bottom" | "left"',
          required: false,
          default: '"right"',
        },
      ],
    },
  ],
  "notification-center": [
    {
      interfaceName: "NotificationRowProps",
      extends:
        'Extends Omit<HTMLAttributes<HTMLButtonElement>, "id" | "title" | "onClick" | "onSelect">',
      props: [
        {
          name: "notification",
          type: "NotificationItem",
          required: true,
        },
        {
          name: "onSelect",
          type: "(id: string) => void",
          required: false,
          description: "Fired with the notification id when the row is activated.",
        },
      ],
    },
    {
      interfaceName: "NotificationListProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect">',
      props: [
        {
          name: "notifications",
          type: "readonly NotificationItem[]",
          required: true,
        },
        {
          name: "onSelect",
          type: "(id: string) => void",
          required: false,
          description: "Fired with the notification id when a row is activated.",
        },
        {
          name: "emptyState",
          type: "ReactNode",
          required: false,
          description: 'Replaces the built-in "You\'re all caught up" empty state.',
        },
      ],
    },
    {
      interfaceName: "NotificationCenterProps",
      extends:
        'Extends Omit<ComponentPropsWithoutRef<typeof PopoverContent>, "onSelect" | "title">',
      props: [
        {
          name: "notifications",
          type: "readonly NotificationItem[]",
          required: true,
          description: "Items to display in the inbox.",
        },
        {
          name: "onMarkAllRead",
          type: "() => void",
          required: false,
          description: 'Fired when the "Mark all read" affordance is activated.',
        },
        {
          name: "onNotificationClick",
          type: "(id: string) => void",
          required: false,
          description: "Fired with the notification id when a row is activated.",
        },
        {
          name: "title",
          type: "ReactNode",
          required: false,
          description: "Header heading text.",
          default: '"Notifications"',
        },
        {
          name: "emptyState",
          type: "ReactNode",
          required: false,
          description: 'Custom empty-state content (defaults to "You\'re all caught up").',
        },
        {
          name: "footer",
          type: "ReactNode",
          required: false,
          description: 'Optional footer rendered below the list (e.g. a "View all" link).',
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Class names for the popover panel.",
        },
      ],
    },
  ],
  command: [
    {
      interfaceName: "CommandDialogProps",
      extends: "Extends ComponentProps<typeof Dialog>",
      props: [
        {
          name: "title",
          type: "string",
          required: false,
          default: '"Command Menu"',
        },
        {
          name: "description",
          type: "string",
          required: false,
          default: '"Search for a command to run..."',
        },
      ],
    },
  ],
  lightbox: [
    {
      interfaceName: "LightboxProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "images",
          type: "LightboxImage[]",
          required: true,
          description: "The images to display in the gallery.",
        },
        {
          name: "open",
          type: "boolean",
          required: false,
          description: "Controlled open state.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          required: false,
          description: "Called when the open state should change.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          required: false,
          description: "Uncontrolled initial open state.",
          default: "false",
        },
        {
          name: "index",
          type: "number",
          required: false,
          description: "Controlled active image index.",
        },
        {
          name: "onIndexChange",
          type: "(index: number) => void",
          required: false,
          description: "Called when the active index should change.",
        },
        {
          name: "defaultIndex",
          type: "number",
          required: false,
          description: "Uncontrolled initial index.",
          default: "0",
        },
      ],
    },
  ],
  "confirmation-dialog": [
    {
      interfaceName: "ConfirmationDialogProps",
      extends:
        'Extends Omit<ComponentPropsWithoutRef<typeof AlertDialogContent>, "title" | "children">',
      props: [
        {
          name: "trigger",
          type: "ReactNode",
          required: false,
          description:
            "Element that opens the dialog. Rendered inside an `AlertDialogTrigger asChild`, so a single focusable child (e.g. a `Button`) is expected. Omit when driving the dialog purely via `open`.",
        },
        {
          name: "title",
          type: "ReactNode",
          required: true,
          description:
            "Dialog heading — labels the dialog for assistive tech (rendered as `AlertDialogTitle`).",
        },
        {
          name: "description",
          type: "ReactNode",
          required: false,
          description:
            "Supporting copy describing the consequence of the action (rendered as `AlertDialogDescription`).",
        },
        {
          name: "confirmLabel",
          type: "ReactNode",
          required: false,
          description: "Text for the confirm button.",
          default: '"Confirm"',
        },
        {
          name: "cancelLabel",
          type: "ReactNode",
          required: false,
          description: "Text for the cancel button.",
          default: '"Cancel"',
        },
        {
          name: "destructive",
          type: "boolean",
          required: false,
          description:
            "Style the confirm button as a destructive (red) action and default the header icon to a warning triangle.",
          default: "false",
        },
        {
          name: "icon",
          type: "ReactNode",
          required: false,
          description:
            "Icon shown in the header badge. Defaults to a warning triangle when `destructive`, otherwise none. Pass `null` to force it off.",
        },
        {
          name: "onConfirm",
          type: "() => void | Promise<void>",
          required: false,
          description:
            "Invoked when the user confirms. If it returns a promise, the confirm button shows a spinner and is disabled until it settles; on resolve the dialog closes, on reject it stays open and surfaces the error message.",
        },
        {
          name: "open",
          type: "boolean",
          required: false,
          description:
            "Controlled open state. Provide alongside `onOpenChange` to control the dialog externally.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          required: false,
          description: "Uncontrolled initial open state.",
          default: "false",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          required: false,
          description:
            "Called whenever the open state changes (opening, cancelling, or confirming). Dismissal is suppressed while a confirm promise is pending.",
        },
      ],
    },
  ],
  "invite-dialog": [
    {
      interfaceName: "InviteDialogProps",
      extends: 'Extends Omit<ComponentPropsWithoutRef<typeof DialogContent>, "title" | "children">',
      props: [
        {
          name: "trigger",
          type: "ReactNode",
          required: false,
          description:
            "Element that opens the dialog. Rendered inside a `DialogTrigger asChild`. Omit when driving the dialog purely via `open`.",
        },
        {
          name: "open",
          type: "boolean",
          required: false,
          description:
            "Controlled open state. Provide alongside `onOpenChange` to control the dialog externally.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          required: false,
          description: "Uncontrolled initial open state.",
          default: "false",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          required: false,
          description:
            "Called whenever the open state changes. Dismissal is suppressed while an invite promise is pending.",
        },
        {
          name: "roles",
          type: "readonly InviteRole[]",
          required: false,
          description: "Roles offered in the select. Defaults to Member and Admin.",
        },
        {
          name: "defaultRole",
          type: "string",
          required: false,
          description: "Initially selected role `value`. Falls back to the first role.",
        },
        {
          name: "onInvite",
          type: "(payload: { email: string; role: string }) => InviteHandlerReturn",
          required: false,
          description:
            "Invoked with the submitted email and role. If it returns a promise, the send button shows a spinner and actions are disabled until it settles. On reject the dialog stays open and surfaces the error. On resolve: a `{ url }` keeps the dialog open with a copyable link; otherwise the dialog closes.",
        },
        {
          name: "labels",
          type: "InviteDialogLabels",
          required: false,
          description: "Override any subset of the built-in English strings.",
        },
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
          description: "Forwarded to the dialog content surface.",
        },
      ],
    },
  ],
  breadcrumb: [
    {
      interfaceName: "BreadcrumbLinkProps",
      extends: "Extends AnchorHTMLAttributes<HTMLAnchorElement>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          default: "false",
        },
      ],
    },
  ],
  pagination: [
    {
      interfaceName: "PaginationLinkProps",
      extends: "Extends AnchorHTMLAttributes<HTMLAnchorElement>",
      props: [
        {
          name: "isActive",
          type: "boolean",
          required: false,
        },
        {
          name: "size",
          type: "PaginationLinkSize",
          required: false,
        },
      ],
    },
  ],
  sidebar: [
    {
      interfaceName: "SidebarProviderProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "defaultOpen",
          type: "boolean",
          required: false,
          description: "Default desktop open state when uncontrolled.",
          default: "true",
        },
        {
          name: "open",
          type: "boolean",
          required: false,
          description: "Controlled desktop open state.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          required: false,
        },
        {
          name: "enableKeyboardShortcut",
          type: "boolean",
          required: false,
          description: "Enable the Ctrl/Cmd+B toggle shortcut.",
          default: "true",
        },
      ],
    },
    {
      interfaceName: "SidebarProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "side",
          type: '"left" | "right"',
          required: false,
          default: '"left"',
        },
        {
          name: "variant",
          type: '"sidebar" | "floating" | "inset"',
          required: false,
          default: '"sidebar"',
        },
        {
          name: "collapsible",
          type: '"offcanvas" | "icon" | "none"',
          required: false,
          default: '"icon"',
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible label for the navigation landmark.",
        },
      ],
    },
    {
      interfaceName: "SidebarTriggerProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          description: "Render through a custom element while keeping the toggle behavior.",
          default: "false",
        },
      ],
    },
    {
      interfaceName: "SidebarGroupLabelProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          default: "false",
        },
      ],
    },
    {
      interfaceName: "SidebarMenuButtonProps",
      extends:
        "Extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof sidebarMenuButtonVariants>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "isActive",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "tooltip",
          type: "ReactNode | ComponentPropsWithoutRef<typeof TooltipContent>",
          required: false,
          description:
            "Tooltip content shown only when the sidebar is collapsed to icons on desktop. Accepts a string or full `TooltipContent` props.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          required: false,
          default: '"md"',
        },
      ],
    },
    {
      interfaceName: "SidebarMenuSubButtonProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "isActive",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          required: false,
          default: '"md"',
        },
      ],
    },
  ],
  "app-shell": [
    {
      interfaceName: "AppShellProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "sidebar",
          type: "ReactNode",
          required: true,
          description:
            "The sidebar element. Pass a `<Sidebar>` (and its trigger/menus). Rendered as the first child of the provider so it sits beside the content region.",
        },
        {
          name: "header",
          type: "ReactNode",
          required: false,
          description:
            'Optional topbar content rendered inside a sticky `<header role="banner">` at the top of the content region. Omit for a header-less shell.',
        },
        {
          name: "providerProps",
          type: 'Omit<SidebarProviderProps, "children">',
          required: false,
          description: "Props forwarded to the underlying `SidebarProvider`.",
        },
        {
          name: "inset",
          type: "boolean",
          required: false,
          description:
            'When `true`, wraps the content region in `SidebarInset` for the rounded, inset surface that pairs with `variant="inset" | "floating"` sidebars.',
          default: "false",
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the content region wrapper.",
        },
        {
          name: "headerClassName",
          type: "string",
          required: false,
          description: "Extra classes for the sticky header.",
        },
      ],
    },
  ],
  "workspace-switcher": [
    {
      interfaceName: "WorkspaceSwitcherProps",
      props: [
        {
          name: "workspaces",
          type: "readonly WorkspaceItem[]",
          required: true,
        },
        {
          name: "value",
          type: "string",
          required: false,
          description: "Controlled selected workspace id. Pair with `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
          description: "Uncontrolled initial workspace id. Defaults to the first workspace.",
        },
        {
          name: "onValueChange",
          type: "(id: string) => void",
          required: false,
          description: "Called with the selected workspace id.",
        },
        {
          name: "labels",
          type: "WorkspaceSwitcherLabels",
          required: false,
          description: "Override any subset of the built-in English strings.",
        },
        {
          name: "className",
          type: "string",
          required: false,
        },
        {
          name: "ref",
          type: "Ref<HTMLButtonElement>",
          required: false,
          description: "Forwarded to the trigger button.",
        },
      ],
    },
  ],
  resizable: [
    {
      interfaceName: "ResizableHandleProps",
      extends: "Extends ComponentProps<typeof ResizablePrimitiveHandle>",
      props: [
        {
          name: "withHandle",
          type: "boolean",
          required: false,
          description: "Render a centered grip affordance on the divider. Defaults to `false`.",
          default: "false",
        },
      ],
    },
  ],
  toolbar: [
    {
      interfaceName: "ToolbarProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          required: false,
          description: "Layout orientation; also drives which arrow keys move focus.",
          default: '"horizontal"',
        },
      ],
    },
    {
      interfaceName: "ToolbarButtonProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [
        {
          name: "pressed",
          type: "boolean",
          required: false,
          description: "Toggle-button pressed state; reflected as aria-pressed.",
        },
      ],
    },
  ],
  "table-of-contents": [
    {
      interfaceName: "TableOfContentsProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLElement>, "children">',
      props: [
        {
          name: "items",
          type: "TableOfContentsItem[]",
          required: false,
          description:
            "The entries to render, in document order. When omitted, headings are auto-discovered from the DOM via .",
        },
        {
          name: "selector",
          type: "string",
          required: false,
          description:
            'CSS selector used to auto-discover headings when is omitted. Only elements with an `id` participate; depth is derived from the heading level (the shallowest level found becomes depth 0). Defaults to `"h2, h3"`.',
          default: "DEFAULT_SELECTOR",
        },
        {
          name: "containerId",
          type: "string",
          required: false,
          description:
            "`id` of the element that scopes heading discovery. When that element is itself a scroll container (`overflow-y: auto | scroll`), it also becomes the scrollspy root and the target of click-to-scroll — otherwise the window scrolls. Defaults to the whole document.",
        },
        {
          name: "offset",
          type: "number",
          required: false,
          description:
            "Pixels between the top of the scroll root and the activation line — match your sticky-header height. Also subtracted when scrolling to a section on click. Defaults to `0`.",
          default: "0",
        },
      ],
    },
  ],
  countdown: [
    {
      interfaceName: "CountdownProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "children">',
      props: [
        {
          name: "target",
          type: "Date | string | number",
          required: true,
          description:
            "The moment the countdown reaches zero: a `Date`, an ISO-8601 string, or an epoch-ms number. An unparsable target keeps the `--` placeholder and never ticks or completes.",
        },
        {
          name: "onComplete",
          type: "() => void",
          required: false,
          description:
            "Fired exactly once when the countdown reaches zero (immediately after mount when the target is already in the past). Re-arms if `target` later changes to a new future moment.",
        },
        {
          name: "compact",
          type: "boolean",
          required: false,
          description: "Smaller tiles + type for tight spots (toolbars, banners, table cells).",
          default: "false",
        },
        {
          name: "labels",
          type: "Partial<CountdownLabels>",
          required: false,
          description: 'Override any subset of the unit captions, e.g. `{ days: "dias" }`.',
        },
      ],
    },
  ],
  "date-picker": [
    {
      interfaceName: "DatePickerProps",
      extends:
        'Extends Omit< ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange" | "disabled" | "name" >',
      props: [
        {
          name: "value",
          type: "Date",
          required: false,
          description: "Controlled selected date. Pair with `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "Date",
          required: false,
          description: "Initial date for uncontrolled usage.",
        },
        {
          name: "onValueChange",
          type: "(date: Date | undefined) => void",
          required: false,
          description:
            "Called with the new date (`undefined` when deselected) on every selection change.",
        },
        {
          name: "onChange",
          type: "(date: Date | undefined) => void",
          required: false,
          description: "Legacy change callback, fired with the same payload as `onValueChange`.",
        },
        {
          name: "open",
          type: "boolean",
          required: false,
          description: "Controlled open state of the calendar popover. Pair with `onOpenChange`.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          required: false,
          description: "Initial open state for uncontrolled usage.",
          default: "false",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          required: false,
          description: "Called whenever the popover opens or closes.",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Text shown on the trigger when no date is selected.",
          default: '"Pick a date"',
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables the trigger entirely.",
          default: "false",
        },
        {
          name: "invalid",
          type: "boolean",
          required: false,
          description: "Marks the trigger invalid (error border/ring + `aria-invalid`).",
          default: "false",
        },
        {
          name: "min",
          type: "Date",
          required: false,
          description: "Earliest selectable day (inclusive).",
        },
        {
          name: "max",
          type: "Date",
          required: false,
          description: "Latest selectable day (inclusive).",
        },
        {
          name: "disabledDates",
          type: "Matcher | Matcher[]",
          required: false,
          description: "Extra non-selectable days, merged with `min`/`max`.",
        },
        {
          name: "locale",
          type: "Locale",
          required: false,
          description: "`date-fns` locale used for both the trigger label and the calendar.",
        },
        {
          name: "dateFormat",
          type: "string",
          required: false,
          description: "`date-fns` format token for the trigger label.",
          default: '"PPP"',
        },
        {
          name: "formatValue",
          type: "(date: Date) => string",
          required: false,
          description: "Full override for the trigger label. Wins over `dateFormat`/`locale`.",
        },
        {
          name: "name",
          type: "string",
          required: false,
          description: "Form field name — renders a hidden input with the local `yyyy-MM-dd` date.",
        },
        {
          name: "align",
          type: 'ComponentPropsWithoutRef<typeof PopoverContent>["align"]',
          required: false,
          description: "Alignment of the popover against the trigger.",
          default: '"start"',
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the popover content.",
        },
      ],
    },
  ],
  "date-range-picker": [
    {
      interfaceName: "DateRangePickerProps",
      props: [
        {
          name: "value",
          type: "DateRange",
          required: false,
          description: "Controlled value. Pair with `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "DateRange",
          required: false,
          description: "Initial value for uncontrolled usage.",
        },
        {
          name: "onValueChange",
          type: "(range: DateRange | undefined) => void",
          required: false,
          description: "Called with the new range whenever the selection changes.",
        },
        {
          name: "presets",
          type: "DateRangePreset[]",
          required: false,
          description: "Optional shortcuts shown in a column beside the calendar.",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Text shown on the trigger when no range is selected.",
          default: '"Pick a date range"',
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables the trigger entirely.",
          default: "false",
        },
        {
          name: "min",
          type: "Date",
          required: false,
          description: "Earliest selectable day (inclusive).",
        },
        {
          name: "max",
          type: "Date",
          required: false,
          description: "Latest selectable day (inclusive).",
        },
        {
          name: "disabledDates",
          type: "Matcher | Matcher[]",
          required: false,
          description: "Extra non-selectable days, merged with `min`/`max`.",
        },
        {
          name: "locale",
          type: "Locale",
          required: false,
          description: "`date-fns` locale used for both the trigger label and the calendar.",
        },
        {
          name: "dateFormat",
          type: "string",
          required: false,
          description: "`date-fns` format token for each end of the range.",
          default: '"LLL dd, y"',
        },
        {
          name: "formatValue",
          type: "(range: DateRange) => string",
          required: false,
          description: "Full override for the trigger label. Wins over `dateFormat`/`locale`.",
        },
        {
          name: "align",
          type: 'ComponentPropsWithoutRef<typeof PopoverContent>["align"]',
          required: false,
          description: "Alignment of the popover against the trigger.",
          default: '"start"',
        },
        {
          name: "numberOfMonths",
          type: "number",
          required: false,
          description: "Number of months shown on wider viewports.",
          default: "2",
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Extra classes for the trigger button.",
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the popover content.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name for the trigger when there is no visible label.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          description: "ID of an element labelling the trigger.",
        },
      ],
    },
  ],
  scheduler: [
    {
      interfaceName: "SchedulerProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">',
      props: [
        {
          name: "month",
          type: "Date",
          required: false,
          description: "Controlled visible month. Provide together with `onMonthChange`.",
        },
        {
          name: "defaultMonth",
          type: "Date",
          required: false,
          description: 'Initial visible month for the uncontrolled case. Defaults to "today".',
        },
        {
          name: "onMonthChange",
          type: "(month: Date) => void",
          required: false,
          description: "Called with the first day of the next visible month on Prev/Today/Next.",
        },
        {
          name: "events",
          type: "SchedulerEvent[]",
          required: false,
          description: "Events to lay out across the grid. Bucketed by calendar day.",
          default: "[]",
        },
        {
          name: "onEventClick",
          type: "(event: SchedulerEvent) => void",
          required: false,
          description: "Fired when an event chip is activated.",
        },
        {
          name: "onDayClick",
          type: "(date: Date) => void",
          required: false,
          description: "Fired when a day cell (not a chip) is activated, with that day's date.",
        },
        {
          name: "today",
          type: "Date",
          required: false,
          description:
            'The day to highlight as "today". Optional and defaulting to `undefined` so server render and first client paint are deterministic — pass a stable Date (or compute one in an effect) to light up the current day without a hydration mismatch.',
        },
        {
          name: "weekStartsOn",
          type: "0 | 1 | 2 | 3 | 4 | 5 | 6",
          required: false,
          description:
            "Locale-aware start of the week (0 = Sunday … 6 = Saturday). Defaults to `0`, matching the Sun…Sat header.",
          default: "0",
        },
        {
          name: "ariaLabel",
          type: "string",
          required: false,
          description: 'Accessible label for the grid. Defaults to "Event calendar".',
          default: '"Event calendar"',
        },
      ],
    },
  ],
  "time-picker": [
    {
      interfaceName: "TimePickerProps",
      props: [
        {
          name: "value",
          type: "TimeValue | string",
          required: false,
          description:
            'Controlled value — a `{ hours, minutes, seconds }` object (24h `hours`) or a `"HH:mm"` / `"HH:mm:ss"` string.',
        },
        {
          name: "defaultValue",
          type: "TimeValue | string",
          required: false,
          description: "Initial value for uncontrolled usage.",
        },
        {
          name: "onChange",
          type: "(value: TimeValue) => void",
          required: false,
          description:
            "Fired with the normalized `{ hours, minutes, seconds }` whenever the time changes.",
        },
        {
          name: "hourCycle",
          type: "12 | 24",
          required: false,
          description:
            "`12` renders a 1–12 hour column plus an AM/PM column; `24` renders a 0–23 column.",
          default: "12",
        },
        {
          name: "minuteStep",
          type: "number",
          required: false,
          description: "Granularity of the minute column, in minutes.",
          default: "1",
        },
        {
          name: "showSeconds",
          type: "boolean",
          required: false,
          description: "Render a seconds column.",
          default: "false",
        },
        {
          name: "secondStep",
          type: "number",
          required: false,
          description: "Granularity of the seconds column, in seconds.",
          default: "1",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Text shown on the trigger when no value is set.",
          default: '"Select time"',
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disable the trigger and the whole panel.",
          default: "false",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name for the trigger when there is no visible label.",
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Extra classes for the trigger button.",
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the popover panel.",
        },
        {
          name: "id",
          type: "string",
          required: false,
          description: "Native id for the trigger.",
        },
        {
          name: "align",
          type: '"start" | "center" | "end"',
          required: false,
          description: "Popover alignment relative to the trigger.",
          default: '"start"',
        },
      ],
    },
  ],
  chart: [
    {
      interfaceName: "ChartCursorProps",
      props: [
        {
          name: "x",
          type: "number",
          required: false,
        },
        {
          name: "y",
          type: "number",
          required: false,
        },
        {
          name: "width",
          type: "number",
          required: false,
        },
        {
          name: "height",
          type: "number",
          required: false,
          default: "0",
        },
        {
          name: "top",
          type: "number",
          required: false,
          default: "0",
        },
        {
          name: "left",
          type: "number",
          required: false,
        },
        {
          name: "points",
          type: "{ x: number; y: number }[]",
          required: false,
        },
        {
          name: "payload",
          type: "TooltipPayloadItem[]",
          required: false,
        },
        {
          name: "labelKey",
          type: "string",
          required: false,
          description: "Field on the datum shown in the axis pill.",
        },
        {
          name: "showAxisLabel",
          type: "boolean",
          required: false,
          description:
            'Draw the hovered label as a pill on the x-axis. Turn off when the axis already prints that tick — otherwise the pill stacks on the label (e.g. "Aug 6" over "Aug 7").',
          default: "true",
        },
      ],
    },
  ],
  "area-chart": [
    {
      interfaceName: "AreaChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "Record<string, unknown>[]",
          required: true,
        },
        {
          name: "xKey",
          type: "string",
          required: false,
          description: "Category / time field.",
          default: '"date"',
        },
        {
          name: "series",
          type: "ChartSeries[]",
          required: true,
        },
        {
          name: "formatValue",
          type: "(value: number, name: string) => string",
          required: false,
        },
      ],
    },
  ],
  "line-chart": [
    {
      interfaceName: "LineChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "Record<string, unknown>[]",
          required: true,
        },
        {
          name: "xKey",
          type: "string",
          required: false,
          default: '"date"',
        },
        {
          name: "series",
          type: "ChartSeries[]",
          required: true,
        },
        {
          name: "formatValue",
          type: "(value: number, name: string) => string",
          required: false,
        },
      ],
    },
  ],
  "live-line-chart": [
    {
      interfaceName: "LiveLineChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "LiveLinePoint[]",
          required: true,
        },
        {
          name: "interval",
          type: "number",
          required: false,
          default: "1000",
        },
        {
          name: "maxPoints",
          type: "number",
          required: false,
          default: "24",
        },
      ],
    },
  ],
  "bar-chart": [
    {
      interfaceName: "BarChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "Record<string, unknown>[]",
          required: true,
        },
        {
          name: "xKey",
          type: "string",
          required: false,
          default: '"month"',
        },
        {
          name: "series",
          type: "ChartSeries[]",
          required: true,
        },
        {
          name: "stacked",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "formatValue",
          type: "(value: number, name: string) => string",
          required: false,
        },
      ],
    },
  ],
  "composed-chart": [
    {
      interfaceName: "ComposedChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "Record<string, unknown>[]",
          required: true,
        },
        {
          name: "xKey",
          type: "string",
          required: false,
          default: '"date"',
        },
        {
          name: "series",
          type: "ComposedChartSeries[]",
          required: true,
        },
        {
          name: "formatValue",
          type: "(value: number, name: string) => string",
          required: false,
        },
      ],
    },
  ],
  "candlestick-chart": [
    {
      interfaceName: "CandlestickChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "CandlestickPoint[]",
          required: true,
        },
      ],
    },
  ],
  "funnel-chart": [
    {
      interfaceName: "FunnelChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "FunnelChartItem[]",
          required: true,
        },
      ],
    },
  ],
  "gauge-chart": [
    {
      interfaceName: "GaugeChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "value",
          type: "number",
          required: true,
        },
        {
          name: "label",
          type: "string",
          required: false,
          default: '"Score"',
        },
        {
          name: "max",
          type: "number",
          required: false,
          default: "100",
        },
      ],
    },
  ],
  "pie-chart": [
    {
      interfaceName: "PieChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "PieChartItem[]",
          required: true,
        },
        {
          name: "series",
          type: "ChartSeries[]",
          required: true,
        },
      ],
    },
  ],
  "ring-chart": [
    {
      interfaceName: "RingChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "RingChartItem[]",
          required: true,
        },
        {
          name: "series",
          type: "ChartSeries[]",
          required: true,
        },
        {
          name: "centerLabel",
          type: "string",
          required: false,
          default: '"Total"',
        },
      ],
    },
  ],
  "radar-chart": [
    {
      interfaceName: "RadarChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "Record<string, unknown>[]",
          required: true,
        },
        {
          name: "angleKey",
          type: "string",
          required: false,
          default: '"metric"',
        },
        {
          name: "series",
          type: "ChartSeries[]",
          required: true,
        },
      ],
    },
  ],
  "scatter-chart": [
    {
      interfaceName: "ScatterChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "xKey",
          type: "string",
          required: false,
          default: '"x"',
        },
        {
          name: "yKey",
          type: "string",
          required: false,
          default: '"y"',
        },
        {
          name: "series",
          type: "ScatterChartSeries[]",
          required: true,
        },
      ],
    },
  ],
  "sankey-chart": [
    {
      interfaceName: "SankeyChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "SankeyChartData",
          required: true,
        },
      ],
    },
  ],
  "profit-loss-chart": [
    {
      interfaceName: "ProfitLossChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "ProfitLossPoint[]",
          required: true,
        },
      ],
    },
  ],
  "choropleth-chart": [
    {
      interfaceName: "ChoroplethChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "ChoroplethRegion[]",
          required: false,
          default: "CHOROPLETH_DEMO",
        },
      ],
    },
  ],
  "sunburst-chart": [
    {
      interfaceName: "SunburstChartProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "data",
          type: "SunburstNode[]",
          required: true,
        },
      ],
    },
  ],
  "heatmap-chart": [
    {
      interfaceName: "HeatmapChartProps",
      extends: "Extends HeatmapProps",
      props: [],
    },
  ],
  "gradient-border": [
    {
      interfaceName: "GradientBorderProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "innerClassName",
          type: "string",
          required: false,
        },
        {
          name: "glow",
          type: "boolean",
          required: false,
          default: "false",
        },
      ],
    },
  ],
  "gradient-text": [
    {
      interfaceName: "GradientTextProps",
      extends: "Extends HTMLAttributes<HTMLSpanElement>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          default: "false",
        },
      ],
    },
  ],
  "scroll-progress": [
    {
      interfaceName: "ScrollProgressProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "variant",
          type: "ScrollProgressVariant",
          required: false,
          description: "Render a thin horizontal bar or a circular ring.",
          default: '"bar"',
        },
        {
          name: "target",
          type: "RefObject<HTMLElement | null>",
          required: false,
          description:
            "The scroll container to track. When omitted, the window / document scrolling element is tracked instead.",
        },
        {
          name: "position",
          type: "ScrollProgressPosition",
          required: false,
          description: "Where to pin the bar variant (ignored for the circle).",
          default: '"top"',
        },
        {
          name: "size",
          type: "number",
          required: false,
          description: "Diameter of the ring in px (circle variant only).",
          default: "40",
        },
      ],
    },
  ],
  "logo-carousel": [
    {
      interfaceName: "LogoCarouselProps",
      extends: "Extends HTMLAttributes<HTMLUListElement>",
      props: [
        {
          name: "items",
          type: "LogoCarouselItem[]",
          required: true,
        },
        {
          name: "columns",
          type: "number",
          required: false,
        },
        {
          name: "columnCount",
          type: "number",
          required: false,
          description: "Alias kept for snippets that call this pattern `columnCount`.",
        },
        {
          name: "interval",
          type: "number",
          required: false,
          default: "2200",
        },
        {
          name: "staggerDelay",
          type: "number",
          required: false,
          default: "0.07",
        },
        {
          name: "pauseOnHover",
          type: "boolean",
          required: false,
          default: "true",
        },
        {
          name: "ariaLabel",
          type: "string",
          required: false,
          default: '"Logo carousel"',
        },
        {
          name: "variant",
          type: "LogoCarouselVariant",
          required: false,
          default: '"ghost"',
        },
        {
          name: "size",
          type: "LogoCarouselSize",
          required: false,
          default: '"lg"',
        },
        {
          name: "motionPreference",
          type: "LogoCarouselMotionPreference",
          required: false,
          default: '"user"',
        },
        {
          name: "itemClassName",
          type: "string",
          required: false,
        },
        {
          name: "logoClassName",
          type: "string",
          required: false,
        },
      ],
    },
  ],
  marquee: [
    {
      interfaceName: "MarqueeProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          description: "The items to scroll — logos, cards, testimonials, or a text ticker.",
        },
        {
          name: "direction",
          type: '"left" | "right"',
          required: false,
          description:
            'Scroll direction. Horizontal: `"left"` (default) | `"right"`. When is set, the same prop reads as `"up"` (default) | `"down"` — i.e. `"left"`/`"up"` share the forward sense and `"right"`/`"down"` the reverse, so one prop covers both axes.',
          default: '"left"',
        },
        {
          name: "vertical",
          type: "boolean",
          required: false,
          description: "Scroll the marquee on the vertical axis instead of the horizontal one.",
          default: "false",
        },
        {
          name: "speed",
          type: "number",
          required: false,
          description:
            "Travel speed in **pixels per second** — resolution-independent and stable across content widths (the loop duration is derived from the measured track size). Defaults to `40` (a tasteful, slow drift).",
          default: "DEFAULT_SPEED",
        },
        {
          name: "pauseOnHover",
          type: "boolean",
          required: false,
          description:
            "Pause the scroll while the pointer is over the marquee. Defaults to `true`.",
          default: "true",
        },
        {
          name: "fade",
          type: "boolean",
          required: false,
          description:
            "Fade the leading and trailing edges into the background with a gradient `mask-image`, so items dissolve rather than clip. Defaults to `true`.",
          default: "true",
        },
        {
          name: "gap",
          type: "string",
          required: false,
          description:
            'Spacing between repeated items. Accepts any CSS length. Defaults to `"1rem"`.',
          default: "DEFAULT_GAP",
        },
        {
          name: "repeat",
          type: "number",
          required: false,
          description:
            "How many copies of are rendered back-to-back. The track translates by exactly one copy, so any count ≥ 2 loops seamlessly. Defaults to `2`; raise it when a single copy cannot fill wide viewports (leaving a visible gap before the loop point).",
          default: "DEFAULT_REPEAT",
        },
        {
          name: "motionPreference",
          type: "MarqueeMotionPreference",
          required: false,
          description:
            'Whether the marquee scrolls vs. honours `prefers-reduced-motion`: `"respect"` (default), `"always"` (force motion), or `"never"` (force static). Defaults to `"respect"`.',
          default: '"respect"',
        },
        {
          name: "groupClassName",
          type: "string",
          required: false,
          description: "Class applied to each repeated copy (the flex row/column of items).",
        },
      ],
    },
  ],
  "morphing-popover": [
    {
      interfaceName: "MorphingPopoverProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "open",
          type: "boolean",
          required: false,
          description: "Controlled open state. When provided, the component is fully controlled.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          required: false,
          description: "Initial open state for the uncontrolled case.",
          default: "false",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          required: false,
          description: "Called whenever the open state should change (controlled or not).",
        },
        {
          name: "transition",
          type: "Transition",
          required: false,
          description:
            "Override the morph spring (advanced — defaults to the Cronus morph spring).",
          default: "MORPHING_POPOVER_TRANSITION",
        },
        {
          name: "reducedMotion",
          type: '"user" | "always" | "never"',
          required: false,
          description:
            'How `prefers-reduced-motion` is honoured. Defaults to `"user"`: users who opt out get a fade instead of the layout morph. Pass `"never"` to always play the morph (e.g. a showcase that must demonstrate the animation), or `"always"` to force the reduced variant for everyone.',
          default: '"user"',
        },
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
      ],
    },
    {
      interfaceName: "MorphingPopoverTriggerProps",
      extends:
        'Extends Omit< React.ComponentPropsWithoutRef<typeof motion.button>, "ref" | "children" | "onClick" >',
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
        {
          name: "onClick",
          type: "(event: React.MouseEvent<HTMLButtonElement>) => void",
          required: false,
          description: "Extra click handler; runs alongside the open toggle.",
        },
      ],
    },
    {
      interfaceName: "MorphingPopoverContentProps",
      extends:
        'Extends Omit<React.ComponentPropsWithoutRef<typeof motion.div>, "ref" | "children">',
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name when the content has no visible heading to point at.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          description: "Id of a visible heading element (e.g. a ).",
        },
      ],
    },
    {
      interfaceName: "MorphingPopoverCloseProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [],
    },
    {
      interfaceName: "MorphingPopoverHeaderProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [],
    },
    {
      interfaceName: "MorphingPopoverBodyProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [],
    },
    {
      interfaceName: "MorphingPopoverFooterProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [],
    },
    {
      interfaceName: "MorphingPopoverButtonProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [],
    },
  ],
  reveal: [
    {
      interfaceName: "RevealProps",
      extends: "Extends React.HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "delay",
          type: "number",
          required: false,
        },
        {
          name: "once",
          type: "boolean",
          required: false,
        },
      ],
    },
  ],
  "animated-number": [
    {
      interfaceName: "AnimatedNumberProps",
      extends: 'Extends Omit<React.ComponentPropsWithoutRef<typeof motion.span>, "children">',
      props: [
        {
          name: "value",
          type: "number",
          required: true,
          description:
            "Target value. Whenever it changes, the number tweens from its current displayed value to here.",
        },
        {
          name: "format",
          type: "(n: number) => string",
          required: false,
          description:
            "Custom formatter for the displayed string. When omitted, the value is formatted with `Intl.NumberFormat(locale, formatOptions)`.",
        },
        {
          name: "locale",
          type: "string",
          required: false,
          description:
            "Locale passed to the default `Intl.NumberFormat` formatter (ignored if `format` is set).",
        },
        {
          name: "formatOptions",
          type: "Intl.NumberFormatOptions",
          required: false,
          description:
            "Options passed to the default `Intl.NumberFormat` formatter (ignored if `format` is set).",
        },
        {
          name: "duration",
          type: "number",
          required: false,
          description:
            "Tween length in seconds. Defaults to ~0.8s; overrides the spring's natural duration.",
          default: "0.8",
        },
        {
          name: "spring",
          type: "AnimatedNumberSpring",
          required: false,
          description:
            "Override the settle spring (advanced — defaults to the Cronus count spring).",
        },
        {
          name: "reducedMotion",
          type: '"user" | "always" | "never"',
          required: false,
          description:
            'How `prefers-reduced-motion` is honoured. Defaults to `"user"` (snap for users who opt out). Pass `"never"` to always animate the count — e.g. a showcase that must demonstrate it — or `"always"` to force the snap.',
          default: '"user"',
        },
        {
          name: "announce",
          type: "boolean",
          required: false,
          description:
            'Announce the **settled** value to screen readers via a visually-hidden `aria-live="polite"` sibling. Defaults to `false`. Only the final value (once the tween completes / snaps) is announced — never the ~97 interpolated frames — so opting in stays quiet.',
          default: "false",
        },
      ],
    },
  ],
  carousel: [
    {
      interfaceName: "CarouselProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onScroll">',
      props: [
        {
          name: "opts",
          type: "CarouselOptions",
          required: false,
          description: "Tuning for snap alignment and looping.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
      ],
    },
    {
      interfaceName: "CarouselContentProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
      ],
    },
    {
      interfaceName: "CarouselItemProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
      ],
    },
    {
      interfaceName: "CarouselPreviousProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [],
    },
    {
      interfaceName: "CarouselNextProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [],
    },
    {
      interfaceName: "CarouselDotsProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [],
    },
  ],
  "segmented-control": [
    {
      interfaceName: "SegmentedControlProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">',
      props: [
        {
          name: "value",
          type: "string",
          required: false,
          description:
            "Controlled selected value. When provided the component is fully controlled.",
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
          description: "Initial selected value for the uncontrolled case.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          required: false,
          description: "Called whenever the selection should change (controlled or not).",
        },
        {
          name: "size",
          type: "SegmentedControlSize",
          required: false,
          description: 'Density of the items. Defaults to `"md"`.',
          default: '"md"',
        },
        {
          name: "transition",
          type: "Transition",
          required: false,
          description:
            "Override the thumb spring (advanced — defaults to the Cronus thumb spring).",
          default: "SEGMENTED_THUMB_TRANSITION",
        },
        {
          name: "reducedMotion",
          type: '"user" | "always" | "never"',
          required: false,
          description:
            'How `prefers-reduced-motion` is honoured. Defaults to `"user"` (snap the thumb for users who opt out). Pass `"never"` to always slide it — e.g. a showcase that must demonstrate it — or `"always"` to force the snap.',
        },
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
      ],
    },
    {
      interfaceName: "SegmentedControlItemProps",
      extends: 'Extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange">',
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          description: "The value this option selects. Required and unique within a group.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: false,
          description: "Visible label (text and/or icon).",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disable selection + skip in keyboard navigation.",
          default: "false",
        },
      ],
    },
  ],
  "text-effect": [
    {
      interfaceName: "TextEffectProps",
      extends: 'Extends Omit<React.HTMLAttributes<HTMLElement>, "children">',
      props: [
        {
          name: "children",
          type: "string",
          required: true,
          description:
            "The text to reveal. Must be a plain string so it can be split into words or characters — pass interpolated values as a single template string, not as child nodes.",
        },
        {
          name: "per",
          type: "TextEffectPer",
          required: false,
          description:
            'Split granularity. `"word"` (default) staggers words; `"char"` staggers letters.',
          default: '"word"',
        },
        {
          name: "preset",
          type: "TextEffectPreset",
          required: false,
          description: 'Which enter animation each unit plays. Defaults to `"blur"`.',
          default: '"blur"',
        },
        {
          name: "as",
          type: "React.ElementType",
          required: false,
          description:
            'The rendered wrapper element/tag (e.g. `"h1"`, `"span"`). Defaults to `"p"`. The wrapper itself is not animated — it carries the accessible label while inner `motion.span`s do the animating.',
        },
        {
          name: "delay",
          type: "number",
          required: false,
          description: "Delay (seconds) before the first unit animates. Defaults to `0`.",
          default: "0",
        },
        {
          name: "stagger",
          type: "number",
          required: false,
          description:
            "Time (seconds) between consecutive units. Defaults to `0.04` for words and `0.02` for characters.",
        },
        {
          name: "duration",
          type: "number",
          required: false,
          description: "Per-unit animation duration (seconds). Defaults to `0.4`.",
          default: "0.4",
        },
        {
          name: "trigger",
          type: "TextEffectTrigger",
          required: false,
          description:
            '`"inView"` (default) animates once when the element scrolls into view; `"mount"` animates immediately on mount.',
          default: '"inView"',
        },
        {
          name: "reducedMotion",
          type: '"user" | "always" | "never"',
          required: false,
          description:
            'How `prefers-reduced-motion` is honoured. Defaults to `"user"` (render the text statically for users who opt out). Pass `"never"` to always play the stagger — e.g. a showcase that must demonstrate it — or `"always"` to force the static render.',
          default: '"user"',
        },
      ],
    },
  ],
  frame: [
    {
      interfaceName: "FrameProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof frameVariants>",
      props: [
        {
          name: "variant",
          type: '"browser" | "window"',
          required: false,
          description:
            "Chrome style. `browser` shows an address bar; `window` is a plain title bar.",
          default: '"browser"',
        },
        {
          name: "url",
          type: "string",
          required: false,
          description: "URL shown in the address bar (browser variant only).",
        },
      ],
    },
  ],
  dock: [
    {
      interfaceName: "DockProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "items",
          type: "DockItem[]",
          required: true,
          description: "The dock entries, left to right.",
        },
        {
          name: "magnification",
          type: "number",
          required: false,
          description: "Peak scale an item reaches at the pointer's center. Defaults to `1.6`.",
          default: "DEFAULT_MAGNIFICATION",
        },
        {
          name: "baseItemSize",
          type: "number",
          required: false,
          description: "Resting item size in pixels. Defaults to `44`.",
          default: "DEFAULT_BASE_ITEM_SIZE",
        },
        {
          name: "distance",
          type: "number",
          required: false,
          description:
            "Pointer influence radius in pixels — how far the magnify reaches. Defaults to `120`.",
          default: "DEFAULT_DISTANCE",
        },
      ],
    },
  ],
  "border-beam": [
    {
      interfaceName: "BorderBeamProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "size",
          type: "number",
          required: false,
          description:
            "Length of the luminous head, in pixels. Also sets the corner radius of the travel path so the beam rounds the corners smoothly. Larger values read as a longer comet trail. Defaults to `60`.",
          default: "60",
        },
        {
          name: "duration",
          type: "number",
          required: false,
          description:
            "Seconds for one full lap around the perimeter. Defaults to `8` (a calm, premium drift).",
          default: "8",
        },
        {
          name: "delay",
          type: "number",
          required: false,
          description:
            "Phase offset in seconds — the beam starts as if it had already been running for this long, so two beams on stacked cards can be staggered around the loop instead of moving in lockstep. Defaults to `0`.",
          default: "0",
        },
        {
          name: "colorFrom",
          type: "string",
          required: false,
          description: "Colour of the leading edge of the beam. Defaults to `var(--cronus-fg)`.",
          default: '"var(--cronus-fg)"',
        },
        {
          name: "colorTo",
          type: "string",
          required: false,
          description:
            "Colour the trail fades through before it dissolves. Defaults to transparent.",
          default: '"transparent"',
        },
        {
          name: "borderWidth",
          type: "number",
          required: false,
          description:
            "Thickness of the border band the beam rides in, in pixels. Defaults to `1` (hairline).",
          default: "1",
        },
        {
          name: "reverse",
          type: "boolean",
          required: false,
          description: "Travel counter-clockwise instead of clockwise. Defaults to `false`.",
          default: "false",
        },
      ],
    },
  ],
  "flip-card": [
    {
      interfaceName: "FlipCardProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">',
      props: [
        {
          name: "trigger",
          type: "FlipCardTrigger",
          required: false,
          description:
            'What flips the card. `"hover"` flips on pointer hover **and** keyboard focus (so it is fully operable without a mouse); `"click"` toggles on click, Enter or Space and exposes `role="button"` + `aria-pressed`; `"controlled"` never self-flips — you drive it entirely through the prop.',
          default: '"hover"',
        },
        {
          name: "axis",
          type: "FlipCardAxis",
          required: false,
          description:
            'Axis the card rotates around. `"horizontal"` spins left↔right (`rotateY`); `"vertical"` tumbles top↔bottom (`rotateX`).',
          default: '"horizontal"',
        },
        {
          name: "flipped",
          type: "boolean",
          required: false,
          description:
            "Controlled flip state. When provided the card shows the back face iff `true` and its own hover/click toggling is suppressed (parent owns the state).",
        },
        {
          name: "defaultFlipped",
          type: "boolean",
          required: false,
          description: "Initial flip state when uncontrolled.",
          default: "false",
        },
        {
          name: "onFlippedChange",
          type: "(flipped: boolean) => void",
          required: false,
          description:
            "Fires with the next flip state whenever the card would flip. Still called while controlled, so you can lift the state up.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description:
            'Accessible name for the flip control. Strongly recommended for `trigger="click"`, where the whole card is a single button.',
        },
      ],
    },
  ],
  "tilt-card": [
    {
      interfaceName: "TiltCardProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "maxTilt",
          type: "number",
          required: false,
          description:
            "Maximum rotation, in degrees, reached on each axis at the card's edges. Higher feels more dramatic.",
          default: "12",
        },
        {
          name: "glare",
          type: "boolean",
          required: false,
          description: "Render a soft pointer-following glare sheen across the surface.",
          default: "false",
        },
        {
          name: "scale",
          type: "number",
          required: false,
          description: "Uniform zoom applied while the pointer is over the card (`1` = none).",
          default: "1.03",
        },
        {
          name: "parallax",
          type: "boolean",
          required: false,
          description:
            "Lift the content toward the viewer on hover for a layered parallax depth effect.",
          default: "false",
        },
      ],
    },
  ],
  magnetic: [
    {
      interfaceName: "MagneticProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "strength",
          type: "number",
          required: false,
          description:
            "How strongly the content is pulled toward the pointer, as a fraction of the pointer's offset from the wrapper's center. `0` is inert, `1` glues the content to the cursor. Values outside `0–1` are clamped.",
          default: "DEFAULT_STRENGTH",
        },
        {
          name: "radius",
          type: "number",
          required: false,
          description:
            "Radius of the magnetic field in pixels, measured from the wrapper's center. The pull is strongest near the center and eases back to zero at this distance, so crossing the field's edge never pops. Pad the wrapper (e.g. `className=\"p-10\"`) to give the field room beyond the content's own box — the attraction can only be felt where the wrapper is hovered.",
          default: "DEFAULT_RADIUS",
        },
      ],
    },
  ],
  orbit: [
    {
      interfaceName: "OrbitProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [],
    },
    {
      interfaceName: "OrbitRingProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "radius",
          type: "number",
          required: true,
          description:
            "Radius of the ring in pixels — the distance from the nucleus' centre to the centre of each orbiting item. The ring renders as a `2 × radius` circle absolutely centred on the stage.",
        },
        {
          name: "duration",
          type: "number",
          required: false,
          description:
            "Seconds for one full revolution. Larger is calmer; concentric rings look best with distinct durations so their items never sync up. Defaults to `24`.",
          default: "DEFAULT_DURATION",
        },
        {
          name: "reverse",
          type: "boolean",
          required: false,
          description: "Revolve counter-clockwise instead of clockwise. Defaults to `false`.",
          default: "false",
        },
        {
          name: "startAngle",
          type: "number",
          required: false,
          description:
            "Angle of the first item's slot in degrees, measured clockwise from 12 o'clock. Remaining items stay evenly distributed after the offset. Use it to de-align concentric rings' starting positions. Defaults to `0`.",
          default: "0",
        },
        {
          name: "guide",
          type: "boolean",
          required: false,
          description: "Draw the faint circular guide (`border-border/40`). Defaults to `true`.",
          default: "true",
        },
      ],
    },
    {
      interfaceName: "OrbitItemProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [],
    },
  ],
  terminal: [
    {
      interfaceName: "TerminalProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "children">',
      props: [
        {
          name: "lines",
          type: "TerminalLine[]",
          required: true,
          description: "The scripted session, played from first to last.",
        },
        {
          name: "title",
          type: "string",
          required: false,
          description: 'Title shown centered in the chrome bar (e.g. `"zsh"` or a file path).',
        },
        {
          name: "chrome",
          type: "boolean",
          required: false,
          description:
            "Render the macOS-style chrome bar (three dots + title). Defaults to `true`.",
          default: "true",
        },
        {
          name: "prompt",
          type: "string",
          required: false,
          description: 'Prompt glyph rendered before each input line. Defaults to `"$"`.',
          default: '"$"',
        },
        {
          name: "typingSpeed",
          type: "number",
          required: false,
          description: "Milliseconds per typed character. Defaults to `30`.",
          default: "DEFAULT_TYPING_SPEED",
        },
        {
          name: "loop",
          type: "boolean",
          required: false,
          description: "Restart the script from the top after it finishes. Defaults to `false`.",
          default: "false",
        },
        {
          name: "loopDelay",
          type: "number",
          required: false,
          description:
            "Milliseconds the finished transcript rests before a loop restarts. Defaults to `2000`.",
          default: "DEFAULT_LOOP_DELAY",
        },
        {
          name: "copyButton",
          type: "boolean",
          required: false,
          description:
            "Show a copy button that copies the joined `input` commands (one per line, without the prompt) — the exact text a reader wants to paste into their own shell. Defaults to `true`; hidden automatically when the script has no input lines.",
          default: "true",
        },
        {
          name: "motionPreference",
          type: "TerminalMotionPreference",
          required: false,
          description:
            'Whether the typing animation plays vs. honours `prefers-reduced-motion`: `"respect"` (default), `"always"` (force motion), or `"never"` (always static).',
          default: '"respect"',
        },
      ],
    },
  ],
  ripple: [
    {
      interfaceName: "RippleProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "count",
          type: "number",
          required: false,
          description: "Number of concentric rings. Clamped to `1–16`.",
          default: "8",
        },
        {
          name: "duration",
          type: "number",
          required: false,
          description: "Seconds for one expansion cycle.",
          default: "8",
        },
      ],
    },
  ],
  meteors: [
    {
      interfaceName: "MeteorsProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "count",
          type: "number",
          required: false,
          description: "Number of shooting stars. Clamped to `1–60`.",
          default: "20",
        },
      ],
    },
  ],
  "dot-pattern": [
    {
      interfaceName: "DotPatternProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "gap",
          type: "number",
          required: false,
          description: "Gap between dots, in pixels.",
          default: "16",
        },
        {
          name: "radius",
          type: "number",
          required: false,
          description: "Dot radius, in pixels.",
          default: "1",
        },
      ],
    },
  ],
  "grid-pattern": [
    {
      interfaceName: "GridPatternProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "size",
          type: "number",
          required: false,
          description: "Cell size, in pixels.",
          default: "24",
        },
        {
          name: "strokeWidth",
          type: "number",
          required: false,
          description: "Stroke width of the grid lines, in pixels.",
          default: "1",
        },
      ],
    },
  ],
  "retro-grid": [
    {
      interfaceName: "RetroGridProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "duration",
          type: "number",
          required: false,
          description: "Seconds for one floor-scroll cycle.",
          default: "8",
        },
        {
          name: "angle",
          type: "number",
          required: false,
          description: "Perspective tilt of the floor, in degrees.",
          default: "60",
        },
      ],
    },
  ],
  noise: [
    {
      interfaceName: "NoiseProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "opacity",
          type: "number",
          required: false,
          description: "Overlay opacity of the grain, `0–1`.",
          default: "0.08",
        },
      ],
    },
  ],
  "light-rays": [
    {
      interfaceName: "LightRaysProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "duration",
          type: "number",
          required: false,
          description: "Seconds for one full rotation of the ray fan.",
          default: "18",
        },
      ],
    },
  ],
  "progressive-blur": [
    {
      interfaceName: "ProgressiveBlurProps",
      extends:
        "Extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof progressiveBlurVariants>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "height",
          type: "string",
          required: false,
          description: "Height of the blur band.",
          default: '"6rem"',
        },
        {
          name: "side",
          type: '"top" | "bottom"',
          required: false,
          default: '"bottom"',
        },
      ],
    },
  ],
  "flickering-grid": [
    {
      interfaceName: "FlickeringGridProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "columns",
          type: "number",
          required: false,
          description: "Number of columns in the grid.",
          default: "16",
        },
        {
          name: "rows",
          type: "number",
          required: false,
          description: "Number of rows in the grid.",
          default: "10",
        },
      ],
    },
  ],
  "star-border": [
    {
      interfaceName: "StarBorderProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "duration",
          type: "number",
          required: false,
          description: "Seconds for one sparkle lap around the perimeter.",
          default: "6",
        },
      ],
    },
  ],
  "shiny-text": [
    {
      interfaceName: "ShinyTextProps",
      extends: "Extends HTMLAttributes<HTMLSpanElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLSpanElement>",
          required: false,
        },
        {
          name: "asChild",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "duration",
          type: "number",
          required: false,
          description: "Seconds for one sheen sweep.",
          default: "3",
        },
      ],
    },
  ],
  highlighter: [
    {
      interfaceName: "HighlighterProps",
      extends: "Extends HTMLAttributes<HTMLSpanElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLSpanElement>",
          required: false,
        },
        {
          name: "duration",
          type: "number",
          required: false,
          description: "Seconds the marker takes to draw on.",
          default: "0.6",
        },
      ],
    },
  ],
  "spinning-text": [
    {
      interfaceName: "SpinningTextProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "children">',
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "children",
          type: "string",
          required: true,
          description: "The phrase laid out around the circle.",
        },
        {
          name: "radius",
          type: "number",
          required: false,
          description: "Radius of the circle, in pixels.",
          default: "48",
        },
        {
          name: "duration",
          type: "number",
          required: false,
          description: "Seconds for one full revolution.",
          default: "16",
        },
        {
          name: "reverse",
          type: "boolean",
          required: false,
          description: "Spin counter-clockwise.",
          default: "false",
        },
      ],
    },
  ],
  "sparkles-text": [
    {
      interfaceName: "SparklesTextProps",
      extends: "Extends HTMLAttributes<HTMLSpanElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLSpanElement>",
          required: false,
        },
        {
          name: "count",
          type: "number",
          required: false,
          description: "Number of sparkles around the text. Clamped to `2–12`.",
          default: "4",
        },
      ],
    },
  ],
  "typing-text": [
    {
      interfaceName: "TypingTextProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLSpanElement>, "children">',
      props: [
        {
          name: "ref",
          type: "Ref<HTMLSpanElement>",
          required: false,
        },
        {
          name: "text",
          type: "string | string[]",
          required: true,
          description:
            "Phrases to type. A single string is treated as one phrase. When more than one is provided the component types, pauses, deletes, and moves on.",
        },
        {
          name: "typingSpeed",
          type: "number",
          required: false,
          description: "Milliseconds per typed character.",
          default: "50",
        },
        {
          name: "deletingSpeed",
          type: "number",
          required: false,
          description: "Milliseconds per deleted character.",
          default: "30",
        },
        {
          name: "pause",
          type: "number",
          required: false,
          description: "Milliseconds to rest on a finished phrase before deleting.",
          default: "1400",
        },
        {
          name: "loop",
          type: "boolean",
          required: false,
          description:
            "Loop back to the first phrase after the last. Defaults to `true` when more than one phrase is provided.",
        },
        {
          name: "reducedMotion",
          type: "TypingTextMotionPreference",
          required: false,
          description:
            'How `prefers-reduced-motion` is honoured. Defaults to `"respect"` (show the current phrase in full). `"always"` forces the typewriter; `"never"` always shows the first phrase statically.',
          default: '"respect"',
        },
      ],
    },
  ],
  "word-rotate": [
    {
      interfaceName: "WordRotateProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLSpanElement>, "children">',
      props: [
        {
          name: "ref",
          type: "Ref<HTMLSpanElement>",
          required: false,
        },
        {
          name: "words",
          type: "string[]",
          required: true,
          description: "Phrases to cycle through.",
        },
        {
          name: "interval",
          type: "number",
          required: false,
          description: "Milliseconds each word stays on screen.",
          default: "2200",
        },
        {
          name: "reducedMotion",
          type: '"user" | "always" | "never"',
          required: false,
          description:
            'How `prefers-reduced-motion` is honoured. Defaults to `"user"` (cross-fade becomes a cut). `"never"` always animates; `"always"` always cuts.',
          default: '"user"',
        },
        {
          name: "lockWidth",
          type: "boolean",
          required: false,
          description:
            "When true (default), the box stays as wide as the longest word so the line does not reflow. Set false when an underline or similar chrome should track the visible word.",
          default: "true",
        },
        {
          name: "announce",
          type: "boolean",
          required: false,
          description:
            "When false, skip the polite live region — use inside a heading so assistive tech is not re-announced every interval.",
          default: "true",
        },
      ],
    },
  ],
  "scramble-text": [
    {
      interfaceName: "ScrambleTextProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLSpanElement>, "children">',
      props: [
        {
          name: "ref",
          type: "Ref<HTMLSpanElement>",
          required: false,
        },
        {
          name: "children",
          type: "string",
          required: true,
          description: "The phrase to resolve to.",
        },
        {
          name: "speed",
          type: "number",
          required: false,
          description: "Milliseconds between scramble ticks.",
          default: "40",
        },
        {
          name: "ticksPerGlyph",
          type: "number",
          required: false,
          description: "How many ticks each glyph stays scrambled before locking.",
          default: "4",
        },
        {
          name: "charset",
          type: "string",
          required: false,
          description: "Glyphs used while scrambling. Defaults to a Latin + digit set.",
          default: "DEFAULT_CHARSET",
        },
        {
          name: "reducedMotion",
          type: "ScrambleTextMotionPreference",
          required: false,
          description:
            'How `prefers-reduced-motion` is honoured. Defaults to `"respect"` (show the resolved phrase immediately).',
          default: '"respect"',
        },
      ],
    },
  ],
  "glare-hover": [
    {
      interfaceName: "GlareHoverProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
      ],
    },
  ],
  "click-spark": [
    {
      interfaceName: "ClickSparkProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "sparkCount",
          type: "number",
          required: false,
          description: "Number of sparks emitted per click.",
          default: "8",
        },
      ],
    },
  ],
  "animated-list": [
    {
      interfaceName: "AnimatedListProps",
      extends: "Extends HTMLAttributes<HTMLUListElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLUListElement>",
          required: false,
        },
        {
          name: "stagger",
          type: "number",
          required: false,
          description: "Seconds between consecutive item reveals.",
          default: "0.08",
        },
        {
          name: "reducedMotion",
          type: '"user" | "always" | "never"',
          required: false,
          description:
            'How `prefers-reduced-motion` is honoured. Defaults to `"user"` (items appear without the stagger). `"never"` always animates.',
          default: '"user"',
        },
      ],
    },
  ],
  "card-stack": [
    {
      interfaceName: "CardStackProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLElement>, "children">',
      props: [
        {
          name: "ref",
          type: "Ref<HTMLElement>",
          required: false,
        },
        {
          name: "items",
          type: "CardStackItem[]",
          required: true,
        },
        {
          name: "labels",
          type: "{ region?: string; next?: string; }",
          required: false,
          description: 'Accessible name for the stack. Defaults to `"Card stack"`.',
        },
      ],
    },
  ],
  "pill-nav": [
    {
      interfaceName: "PillNavProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLElement>, "onChange">',
      props: [
        {
          name: "ref",
          type: "Ref<HTMLElement>",
          required: false,
        },
        {
          name: "items",
          type: "PillNavItem[]",
          required: true,
        },
        {
          name: "value",
          type: "string",
          required: false,
          description: "Controlled selected value.",
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
          description: "Initial selected value when uncontrolled.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          required: false,
        },
      ],
    },
  ],
  "expandable-tabs": [
    {
      interfaceName: "ExpandableTabsProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">',
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "items",
          type: "ExpandableTab[]",
          required: true,
        },
        {
          name: "value",
          type: "string",
          required: false,
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          required: false,
        },
      ],
    },
  ],
  "dynamic-island": [
    {
      interfaceName: "DynamicIslandProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "children">',
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "views",
          type: "DynamicIslandView[]",
          required: true,
        },
        {
          name: "value",
          type: "string",
          required: false,
          description: "Controlled active view id.",
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
        },
        {
          name: "onValueChange",
          type: "(id: string) => void",
          required: false,
        },
      ],
    },
  ],
  confetti: [
    {
      interfaceName: "ConfettiProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "count",
          type: "number",
          required: false,
          description: "Pieces spawned per burst.",
          default: "48",
        },
        {
          name: "fireOnMount",
          type: "boolean",
          required: false,
          description: "Fire a burst on mount.",
          default: "false",
        },
      ],
    },
  ],
  particles: [
    {
      interfaceName: "ParticlesProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ref",
          type: "Ref<HTMLDivElement>",
          required: false,
        },
        {
          name: "count",
          type: "number",
          required: false,
          description: "Number of drifting specks.",
          default: "40",
        },
      ],
    },
  ],
};

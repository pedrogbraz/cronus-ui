import { describe, expect, it } from "vitest";
import { emitCronusApp } from "./emit-cronus-fixture.js";
import { componentNameOf, getFixture, listFixtures } from "./fixture-catalog.js";
import { expectedTag } from "./logic-contract.js";
import { parseParityFixture } from "./parity-fixture.js";

describe("emitCronusApp", () => {
  it("emits top-level component + page use without source", () => {
    const fixture = getFixture("button", "primary-md");
    const src = emitCronusApp([fixture]);
    expect(src).toContain('app "audit-fixtures"');
    expect(src).toContain("component ButtonPrimaryMd layout:inline style:button+primary+md");
    expect(src).toContain('label "Save profile"');
    expect(src).toContain('page "/audit/button/primary-md" type:custom');
    expect(src).toContain("use ButtonPrimaryMd");
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("template ");
  });

  it("emits checked, pressed, and value colon-pairs without source", () => {
    const src = emitCronusApp([
      getFixture("checkbox", "on"),
      getFixture("switch", "on"),
      getFixture("toggle", "on"),
      getFixture("progress", "half"),
      getFixture("slider", "half"),
    ]);
    expect(src).toContain("component CheckboxOn layout:inline style:checkbox {");
    expect(src).toContain("  checked:true");
    expect(src).toContain("component SwitchOn layout:inline style:switch {");
    expect(src).toContain("component ToggleOn layout:inline style:toggle {");
    expect(src).toContain("  pressed:true");
    expect(src).toContain("component ProgressHalf layout:inline style:progress {");
    expect(src).toContain("  value:50");
    expect(src).toContain("component SliderHalf layout:inline style:slider {");
    expect(src).toContain("use CheckboxOn");
    expect(src).toContain("use SwitchOn");
    expect(src).toContain("use ToggleOn");
    expect(src).toContain("use ProgressHalf");
    expect(src).toContain("use SliderHalf");
    expect(src).toContain('page "/audit/checkbox/on" type:custom');
    expect(src).toContain('page "/audit/progress/half" type:custom');
    expect(src).toContain('page "/audit/slider/half" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
  });

  it("emits radio-group options as extra text lines without source", () => {
    const src = emitCronusApp([getFixture("radio-group", "default")]);
    expect(src).toContain("component RadioGroupDefault layout:inline style:radio-group {");
    expect(src).toContain('  text "Free"');
    expect(src).toContain('  text "Pro"');
    expect(src).toContain('  value:"Pro"');
    expect(src).toContain('page "/audit/radio-group/default" type:custom');
    expect(src).toContain("use RadioGroupDefault");
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("emits every catalog fixture as component + page use", () => {
    const fixtures = listFixtures();
    const src = emitCronusApp(fixtures);
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
    for (const fixture of fixtures) {
      const name = componentNameOf(fixture);
      expect(src).toContain(`component ${name} `);
      expect(src).toContain(`use ${name}`);
      expect(src).toContain(`page "/audit/${fixture.family}/${fixture.id}" type:custom`);
    }
  });

  it("maps expected tags for wave 1a families", () => {
    expect(expectedTag(getFixture("label", "default"))).toBe("label");
    expect(expectedTag(getFixture("textarea", "empty"))).toBe("textarea");
    expect(expectedTag(getFixture("checkbox", "off"))).toBe("button");
    expect(expectedTag(getFixture("switch", "off"))).toBe("button");
    expect(expectedTag(getFixture("spinner", "default"))).toBe("svg");
    expect(expectedTag(getFixture("separator", "horizontal"))).toBe("div");
    expect(expectedTag(getFixture("kbd", "default"))).toBe("kbd");
    expect(expectedTag(getFixture("toggle", "off"))).toBe("button");
    expect(expectedTag(getFixture("progress", "half"))).toBe("div");
  });

  it("maps expected tags for wave 1b families", () => {
    expect(expectedTag(getFixture("alert", "default"))).toBe("div");
    expect(expectedTag(getFixture("skeleton", "default"))).toBe("div");
    expect(expectedTag(getFixture("banner", "default"))).toBe("section");
    expect(expectedTag(getFixture("slider", "half"))).toBe("span");
    expect(expectedTag(getFixture("radio-group", "default"))).toBe("div");
    expect(expectedTag(getFixture("chip", "default"))).toBe("span");
    expect(expectedTag(getFixture("avatar", "fallback"))).toBe("span");
    expect(expectedTag(getFixture("card", "default"))).toBe("div");
    expect(expectedTag(getFixture("empty", "default"))).toBe("div");
  });

  it("emits items as extra text lines and numeric value without source", () => {
    const src = emitCronusApp([
      getFixture("rating", "default"),
      getFixture("toggle-group", "default"),
      getFixture("button-group", "default"),
      getFixture("avatar-group", "default"),
      getFixture("copy-button", "default"),
      getFixture("metric", "default"),
      getFixture("fab", "default"),
      getFixture("field", "default"),
      getFixture("input-group", "default"),
    ]);
    expect(src).toContain("component RatingDefault layout:inline style:rating {");
    expect(src).toContain("  value:3");
    expect(src).toContain("component ToggleGroupDefault layout:inline style:toggle-group {");
    expect(src).toContain('  text "Day"');
    expect(src).toContain('  text "Week"');
    expect(src).toContain('  value:"Day"');
    expect(src).toContain('  text "Save"');
    expect(src).toContain('  text "Cancel"');
    expect(src).toContain('  text "AL"');
    expect(src).toContain('  text "JB"');
    expect(src).toContain('  value:"cronus-ui"');
    expect(src).toContain('  value:"1,240"');
    expect(src).toContain('label "Create"');
    expect(src).toContain('label "Email"');
    expect(src).toContain('  text "$"');
    expect(src).toContain("use RatingDefault");
    expect(src).toContain("use ToggleGroupDefault");
    expect(src).toContain("use FabDefault");
    expect(src).toContain("use FieldDefault");
    expect(src).toContain("use InputGroupDefault");
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1c families", () => {
    expect(expectedTag(getFixture("field", "default"))).toBe("div");
    expect(expectedTag(getFixture("input-group", "default"))).toBe("div");
    expect(expectedTag(getFixture("rating", "default"))).toBe("div");
    expect(expectedTag(getFixture("copy-button", "default"))).toBe("button");
    expect(expectedTag(getFixture("fab", "default"))).toBe("div");
    expect(expectedTag(getFixture("toggle-group", "default"))).toBe("div");
    expect(expectedTag(getFixture("metric", "default"))).toBe("div");
    expect(expectedTag(getFixture("avatar-group", "default"))).toBe("div");
    expect(expectedTag(getFixture("button-group", "default"))).toBe("div");
  });

  it("emits combobox options and overlay content as extra text without source", () => {
    const src = emitCronusApp([
      getFixture("combobox", "default"),
      getFixture("stepper", "default"),
      getFixture("input-otp", "default"),
      getFixture("file-dropzone", "default"),
      getFixture("popover", "default"),
      getFixture("hover-card", "default"),
      getFixture("dropdown-menu", "default"),
      getFixture("collapsible", "default"),
      getFixture("mode-toggle", "default"),
    ]);
    expect(src).toContain("component ComboboxDefault layout:inline style:combobox {");
    expect(src).toContain('  text "Apple"');
    expect(src).toContain('  text "Banana"');
    expect(src).toContain('label "Onboarding"');
    expect(src).toContain('  text "Account"');
    expect(src).toContain('  text "Shipping"');
    expect(src).toContain('  text "Popover body"');
    expect(src).toContain('  text "Cronus UI"');
    expect(src).toContain('  text "Edit"');
    expect(src).toContain('  text "Delete"');
    expect(src).toContain('  text "Hidden body"');
    expect(src).toContain("use ComboboxDefault");
    expect(src).toContain("use StepperDefault");
    expect(src).toContain("use InputOtpDefault");
    expect(src).toContain("use FileDropzoneDefault");
    expect(src).toContain("use PopoverDefault");
    expect(src).toContain("use HoverCardDefault");
    expect(src).toContain("use DropdownMenuDefault");
    expect(src).toContain("use CollapsibleDefault");
    expect(src).toContain("use ModeToggleDefault");
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1d families", () => {
    expect(expectedTag(getFixture("combobox", "default"))).toBe("button");
    expect(expectedTag(getFixture("stepper", "default"))).toBe("div");
    expect(expectedTag(getFixture("input-otp", "default"))).toBe("input");
    expect(expectedTag(getFixture("file-dropzone", "default"))).toBe("label");
    expect(expectedTag(getFixture("popover", "default"))).toBe("div");
    expect(expectedTag(getFixture("hover-card", "default"))).toBe("div");
    expect(expectedTag(getFixture("dropdown-menu", "default"))).toBe("div");
    expect(expectedTag(getFixture("collapsible", "default"))).toBe("div");
    expect(expectedTag(getFixture("mode-toggle", "default"))).toBe("button");
  });

  it("emits command/menu items as extra text without source", () => {
    const src = emitCronusApp([
      getFixture("command", "default"),
      getFixture("menubar", "default"),
      getFixture("context-menu", "default"),
      getFixture("drawer", "default"),
      getFixture("sheet", "default"),
      getFixture("calendar", "default"),
      getFixture("date-picker", "default"),
      getFixture("time-picker", "default"),
      getFixture("date-range-picker", "default"),
    ]);
    expect(src).toContain("component CommandDefault layout:inline style:command {");
    expect(src).toContain('  text "Calendar"');
    expect(src).toContain('  text "Search"');
    expect(src).toContain('  text "New Tab"');
    expect(src).toContain('  text "Open"');
    expect(src).toContain('  text "Back"');
    expect(src).toContain('  text "Reload"');
    expect(src).toContain('label "Filters"');
    expect(src).toContain('label "Edit profile"');
    expect(src).toContain('label "June 2026"');
    expect(src).toContain('  text "Pick a date"');
    expect(src).toContain('  value:"2026-06-15"');
    expect(src).toContain('  value:"09:30"');
    expect(src).toContain('  text "Pick a date range"');
    expect(src).toContain("use CommandDefault");
    expect(src).toContain("use MenubarDefault");
    expect(src).toContain("use ContextMenuDefault");
    expect(src).toContain("use DrawerDefault");
    expect(src).toContain("use SheetDefault");
    expect(src).toContain("use CalendarDefault");
    expect(src).toContain("use DatePickerDefault");
    expect(src).toContain("use TimePickerDefault");
    expect(src).toContain("use DateRangePickerDefault");
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1e families", () => {
    expect(expectedTag(getFixture("command", "default"))).toBe("div");
    expect(expectedTag(getFixture("menubar", "default"))).toBe("div");
    expect(expectedTag(getFixture("context-menu", "default"))).toBe("div");
    expect(expectedTag(getFixture("drawer", "default"))).toBe("div");
    expect(expectedTag(getFixture("sheet", "default"))).toBe("div");
    expect(expectedTag(getFixture("calendar", "default"))).toBe("div");
    expect(expectedTag(getFixture("date-picker", "default"))).toBe("button");
    expect(expectedTag(getFixture("time-picker", "default"))).toBe("button");
    expect(expectedTag(getFixture("date-range-picker", "default"))).toBe("button");
  });

  it("emits wave 1f labels and items as extra text without source", () => {
    const src = emitCronusApp([
      getFixture("area-chart", "default"),
      getFixture("bar-chart", "default"),
      getFixture("line-chart", "default"),
      getFixture("sparkline", "default"),
      getFixture("pie-chart", "default"),
      getFixture("data-table", "default"),
      getFixture("sidebar", "default"),
      getFixture("sonner", "default"),
      getFixture("navigation-menu", "default"),
    ]);
    expect(src).toContain("component AreaChartDefault layout:inline style:area-chart {");
    expect(src).toContain('label "Sessions"');
    expect(src).toContain('  text "Jan"');
    expect(src).toContain('  text "Feb"');
    expect(src).toContain("component BarChartDefault layout:inline style:bar-chart {");
    expect(src).toContain("component LineChartDefault layout:inline style:line-chart {");
    expect(src).toContain("component SparklineDefault layout:inline style:sparkline {");
    expect(src).toContain('label "Trend"');
    expect(src).toContain('  aria-label:"Trend"');
    expect(src).toContain("component PieChartDefault layout:inline style:pie-chart {");
    expect(src).toContain('  text "Desktop"');
    expect(src).toContain('  text "Mobile"');
    expect(src).toContain("component DataTableDefault layout:inline style:data-table {");
    expect(src).toContain('  text "Ada"');
    expect(src).toContain('  text "Linus"');
    expect(src).toContain("component SidebarDefault layout:inline style:sidebar {");
    expect(src).toContain('  text "Home"');
    expect(src).toContain('  text "Inbox"');
    expect(src).toContain("component SonnerDefault layout:inline style:sonner {");
    expect(src).toContain('  aria-label:"Notifications"');
    expect(src).toContain("component NavigationMenuDefault layout:inline style:navigation-menu {");
    expect(src).toContain('label "Products"');
    expect(src).toContain('  text "Analytics"');
    expect(src).toContain('  text "Docs"');
    expect(src).toContain("use AreaChartDefault");
    expect(src).toContain("use BarChartDefault");
    expect(src).toContain("use LineChartDefault");
    expect(src).toContain("use SparklineDefault");
    expect(src).toContain("use PieChartDefault");
    expect(src).toContain("use DataTableDefault");
    expect(src).toContain("use SidebarDefault");
    expect(src).toContain("use SonnerDefault");
    expect(src).toContain("use NavigationMenuDefault");
    expect(src).toContain('page "/audit/area-chart/default" type:custom');
    expect(src).toContain('page "/audit/sparkline/default" type:custom');
    expect(src).toContain('page "/audit/sonner/default" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1f families", () => {
    expect(expectedTag(getFixture("area-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("bar-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("line-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("sparkline", "default"))).toBe("svg");
    expect(expectedTag(getFixture("pie-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("data-table", "default"))).toBe("div");
    expect(expectedTag(getFixture("sidebar", "default"))).toBe("aside");
    expect(expectedTag(getFixture("sonner", "default"))).toBe("div");
    expect(expectedTag(getFixture("navigation-menu", "default"))).toBe("nav");
  });

  it("emits wave 1g labels, items, and values without source", () => {
    const src = emitCronusApp([
      getFixture("radar-chart", "default"),
      getFixture("scatter-chart", "default"),
      getFixture("ring-chart", "default"),
      getFixture("phone-input", "default"),
      getFixture("currency-input", "default"),
      getFixture("color-picker", "default"),
      getFixture("scroll-area", "default"),
      getFixture("toolbar", "default"),
      getFixture("status-dot", "default"),
    ]);
    expect(src).toContain("component RadarChartDefault layout:inline style:radar-chart {");
    expect(src).toContain('label "Metrics"');
    expect(src).toContain('  text "Speed"');
    expect(src).toContain('  text "Reliability"');
    expect(src).toContain("component ScatterChartDefault layout:inline style:scatter-chart {");
    expect(src).toContain('label "Reach"');
    expect(src).toContain('  text "A"');
    expect(src).toContain("component RingChartDefault layout:inline style:ring-chart {");
    expect(src).toContain('  text "Desktop"');
    expect(src).toContain('  text "Mobile"');
    expect(src).toContain("component PhoneInputDefault layout:inline style:phone-input {");
    expect(src).toContain('label "Phone number"');
    expect(src).toContain('  value:"+5511987654321"');
    expect(src).toContain("component CurrencyInputDefault layout:inline style:currency-input {");
    expect(src).toContain('label "Amount"');
    expect(src).toContain("  value:12345");
    expect(src).toContain("component ColorPickerDefault layout:inline style:color-picker {");
    expect(src).toContain('label "Color"');
    expect(src).toContain('  value:"oklch(0.62 0.21 256)"');
    expect(src).toContain("component ScrollAreaDefault layout:inline style:scroll-area {");
    expect(src).toContain('  text "v1.2.0-beta.12"');
    expect(src).toContain('  text "v1.2.0-beta.1"');
    expect(src).toContain("component ToolbarDefault layout:inline style:toolbar {");
    expect(src).toContain('  text "Bold"');
    expect(src).toContain('  text "Italic"');
    expect(src).toContain("component StatusDotDefault layout:inline style:status-dot {");
    expect(src).toContain("use RadarChartDefault");
    expect(src).toContain("use ScatterChartDefault");
    expect(src).toContain("use RingChartDefault");
    expect(src).toContain("use PhoneInputDefault");
    expect(src).toContain("use CurrencyInputDefault");
    expect(src).toContain("use ColorPickerDefault");
    expect(src).toContain("use ScrollAreaDefault");
    expect(src).toContain("use ToolbarDefault");
    expect(src).toContain("use StatusDotDefault");
    expect(src).toContain('page "/audit/radar-chart/default" type:custom');
    expect(src).toContain('page "/audit/phone-input/default" type:custom');
    expect(src).toContain('page "/audit/color-picker/default" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1g families", () => {
    expect(expectedTag(getFixture("radar-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("scatter-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("ring-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("phone-input", "default"))).toBe("div");
    expect(expectedTag(getFixture("currency-input", "default"))).toBe("div");
    expect(expectedTag(getFixture("color-picker", "default"))).toBe("button");
    expect(expectedTag(getFixture("scroll-area", "default"))).toBe("div");
    expect(expectedTag(getFixture("toolbar", "default"))).toBe("div");
    expect(expectedTag(getFixture("status-dot", "default"))).toBe("span");
  });

  it("emits wave 1h labels, items, and values without source", () => {
    const src = emitCronusApp([
      getFixture("tags-input", "default"),
      getFixture("autocomplete", "default"),
      getFixture("multi-select", "default"),
      getFixture("credit-card-input", "default"),
      getFixture("floating-label-input", "default"),
      getFixture("split-button", "default"),
      getFixture("pill-nav", "default"),
      getFixture("dock", "default"),
      getFixture("workspace-switcher", "default"),
    ]);
    expect(src).toContain("component TagsInputDefault layout:inline style:tags-input {");
    expect(src).toContain('label "Add a tag"');
    expect(src).toContain('  text "Design"');
    expect(src).toContain('  text "System"');
    expect(src).toContain("component AutocompleteDefault layout:inline style:autocomplete {");
    expect(src).toContain('  text "Lisbon"');
    expect(src).toContain('  text "Lima"');
    expect(src).toContain('  text "London"');
    expect(src).toContain('  value:"L"');
    expect(src).toContain("component MultiSelectDefault layout:inline style:multi-select {");
    expect(src).toContain('  text "React"');
    expect(src).toContain('  text "Vue"');
    expect(src).toContain("component CreditCardInputDefault layout:inline style:credit-card-input {");
    expect(src).toContain('label "Credit card"');
    expect(src).toContain('  value:"4242424242424242"');
    expect(src).toContain(
      "component FloatingLabelInputDefault layout:inline style:floating-label-input {",
    );
    expect(src).toContain('label "Email"');
    expect(src).toContain('  value:"ada@cronus.dev"');
    expect(src).toContain("component SplitButtonDefault layout:inline style:split-button {");
    expect(src).toContain('label "Save"');
    expect(src).toContain('  text "Duplicate"');
    expect(src).toContain('  text "Archive"');
    expect(src).toContain("component PillNavDefault layout:inline style:pill-nav {");
    expect(src).toContain('  text "Home"');
    expect(src).toContain('  text "Work"');
    expect(src).toContain("component DockDefault layout:inline style:dock {");
    expect(src).toContain("component WorkspaceSwitcherDefault layout:inline style:workspace-switcher {");
    expect(src).toContain('  text "Cronus"');
    expect(src).toContain('  text "Northwind"');
    expect(src).toContain("use TagsInputDefault");
    expect(src).toContain("use AutocompleteDefault");
    expect(src).toContain("use MultiSelectDefault");
    expect(src).toContain("use CreditCardInputDefault");
    expect(src).toContain("use FloatingLabelInputDefault");
    expect(src).toContain("use SplitButtonDefault");
    expect(src).toContain("use PillNavDefault");
    expect(src).toContain("use DockDefault");
    expect(src).toContain("use WorkspaceSwitcherDefault");
    expect(src).toContain('page "/audit/tags-input/default" type:custom');
    expect(src).toContain('page "/audit/autocomplete/default" type:custom');
    expect(src).toContain('page "/audit/multi-select/default" type:custom');
    expect(src).toContain('page "/audit/workspace-switcher/default" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1h families", () => {
    expect(expectedTag(getFixture("tags-input", "default"))).toBe("div");
    expect(expectedTag(getFixture("autocomplete", "default"))).toBe("div");
    expect(expectedTag(getFixture("multi-select", "default"))).toBe("div");
    expect(expectedTag(getFixture("credit-card-input", "default"))).toBe("div");
    expect(expectedTag(getFixture("floating-label-input", "default"))).toBe("div");
    expect(expectedTag(getFixture("split-button", "default"))).toBe("div");
    expect(expectedTag(getFixture("pill-nav", "default"))).toBe("nav");
    expect(expectedTag(getFixture("dock", "default"))).toBe("div");
    expect(expectedTag(getFixture("workspace-switcher", "default"))).toBe("button");
  });

  it("emits wave 1i labels and items without source", () => {
    const src = emitCronusApp([
      getFixture("app-shell", "default"),
      getFixture("table-of-contents", "default"),
      getFixture("form", "default"),
      getFixture("signature-pad", "default"),
      getFixture("resizable", "default"),
      getFixture("scheduler", "default"),
      getFixture("alert-dialog", "default"),
      getFixture("lightbox", "default"),
      getFixture("notification-center", "default"),
    ]);
    expect(src).toContain("component AppShellDefault layout:inline style:app-shell {");
    expect(src).toContain('label "Acme"');
    expect(src).toContain('  text "Home"');
    expect(src).toContain('  text "Inbox"');
    expect(src).toContain(
      "component TableOfContentsDefault layout:inline style:table-of-contents {",
    );
    expect(src).toContain('  text "Overview"');
    expect(src).toContain('  text "Usage"');
    expect(src).toContain("component FormDefault layout:inline style:form {");
    expect(src).toContain('label "Email"');
    expect(src).toContain('  text "ada@cronus.dev"');
    expect(src).toContain("component SignaturePadDefault layout:inline style:signature-pad {");
    expect(src).toContain('label "Signature pad"');
    expect(src).toContain("component ResizableDefault layout:inline style:resizable {");
    expect(src).toContain('  text "One"');
    expect(src).toContain('  text "Two"');
    expect(src).toContain("component SchedulerDefault layout:inline style:scheduler {");
    expect(src).toContain('label "June 2026"');
    expect(src).toContain('  text "Launch call"');
    expect(src).toContain('  text "Webinar"');
    expect(src).toContain("component AlertDialogDefault layout:inline style:alert-dialog {");
    expect(src).toContain('label "Delete account"');
    expect(src).toContain('  text "Confirm"');
    expect(src).toContain("component LightboxDefault layout:inline style:lightbox {");
    expect(src).toContain('  text "First image"');
    expect(src).toContain('  text "Second image"');
    expect(src).toContain(
      "component NotificationCenterDefault layout:inline style:notification-center {",
    );
    expect(src).toContain('label "Notifications"');
    expect(src).toContain('  text "New comment"');
    expect(src).toContain('  text "Payout sent"');
    expect(src).toContain("use AppShellDefault");
    expect(src).toContain("use TableOfContentsDefault");
    expect(src).toContain("use FormDefault");
    expect(src).toContain("use SignaturePadDefault");
    expect(src).toContain("use ResizableDefault");
    expect(src).toContain("use SchedulerDefault");
    expect(src).toContain("use AlertDialogDefault");
    expect(src).toContain("use LightboxDefault");
    expect(src).toContain("use NotificationCenterDefault");
    expect(src).toContain('page "/audit/app-shell/default" type:custom');
    expect(src).toContain('page "/audit/table-of-contents/default" type:custom');
    expect(src).toContain('page "/audit/form/default" type:custom');
    expect(src).toContain('page "/audit/signature-pad/default" type:custom');
    expect(src).toContain('page "/audit/resizable/default" type:custom');
    expect(src).toContain('page "/audit/scheduler/default" type:custom');
    expect(src).toContain('page "/audit/alert-dialog/default" type:custom');
    expect(src).toContain('page "/audit/lightbox/default" type:custom');
    expect(src).toContain('page "/audit/notification-center/default" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1i families", () => {
    expect(expectedTag(getFixture("app-shell", "default"))).toBe("div");
    expect(expectedTag(getFixture("table-of-contents", "default"))).toBe("nav");
    expect(expectedTag(getFixture("form", "default"))).toBe("div");
    expect(expectedTag(getFixture("signature-pad", "default"))).toBe("div");
    expect(expectedTag(getFixture("resizable", "default"))).toBe("div");
    expect(expectedTag(getFixture("scheduler", "default"))).toBe("div");
    expect(expectedTag(getFixture("alert-dialog", "default"))).toBe("div");
    expect(expectedTag(getFixture("lightbox", "default"))).toBe("div");
    expect(expectedTag(getFixture("notification-center", "default"))).toBe("div");
  });

  it("drops data-size from expect.attrs", () => {
    const parsed = parseParityFixture({
      id: "x",
      family: "button",
      props: { children: "A" },
      expect: {
        slot: "button",
        attrs: { "data-slot": "button", "data-size": "md" },
      },
    });
    expect(parsed.expect.attrs).not.toHaveProperty("data-size");
  });
});

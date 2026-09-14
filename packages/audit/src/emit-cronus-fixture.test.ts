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
    expect(src).toContain(
      "component CreditCardInputDefault layout:inline style:credit-card-input {",
    );
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
    expect(src).toContain(
      "component WorkspaceSwitcherDefault layout:inline style:workspace-switcher {",
    );
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

  it("emits wave 1j labels, items, and values without source", () => {
    const src = emitCronusApp([
      getFixture("segmented-control", "default"),
      getFixture("usage-meter", "default"),
      getFixture("masonry", "default"),
      getFixture("heatmap", "default"),
      getFixture("comparison-slider", "default"),
      getFixture("code-tabs", "default"),
      getFixture("expandable-tabs", "default"),
      getFixture("live-line-chart", "default"),
      getFixture("sunburst-chart", "default"),
    ]);
    expect(src).toContain(
      "component SegmentedControlDefault layout:inline style:segmented-control {",
    );
    expect(src).toContain('  text "Day"');
    expect(src).toContain('  text "Week"');
    expect(src).toContain('  value:"Day"');
    expect(src).toContain("component UsageMeterDefault layout:inline style:usage-meter {");
    expect(src).toContain('label "Tokens"');
    expect(src).toContain("  value:40");
    expect(src).toContain("component MasonryDefault layout:inline style:masonry {");
    expect(src).toContain('  text "Alpha"');
    expect(src).toContain('  text "Delta"');
    expect(src).toContain("component HeatmapDefault layout:inline style:heatmap {");
    expect(src).toContain('label "Activity"');
    expect(src).toContain(
      "component ComparisonSliderDefault layout:inline style:comparison-slider {",
    );
    expect(src).toContain('  text "Before"');
    expect(src).toContain('  text "After"');
    expect(src).toContain("component CodeTabsDefault layout:inline style:code-tabs {");
    expect(src).toContain('  text "bun"');
    expect(src).toContain('  text "npm"');
    expect(src).toContain("component ExpandableTabsDefault layout:inline style:expandable-tabs {");
    expect(src).toContain('  text "Home"');
    expect(src).toContain('  text "Search"');
    expect(src).toContain("component LiveLineChartDefault layout:inline style:live-line-chart {");
    expect(src).toContain('label "Live"');
    expect(src).toContain('  text "0"');
    expect(src).toContain('  text "1"');
    expect(src).toContain("component SunburstChartDefault layout:inline style:sunburst-chart {");
    expect(src).toContain('label "Traffic"');
    expect(src).toContain('  text "Desktop"');
    expect(src).toContain('  text "Mobile"');
    expect(src).toContain("use SegmentedControlDefault");
    expect(src).toContain("use UsageMeterDefault");
    expect(src).toContain("use MasonryDefault");
    expect(src).toContain("use HeatmapDefault");
    expect(src).toContain("use ComparisonSliderDefault");
    expect(src).toContain("use CodeTabsDefault");
    expect(src).toContain("use ExpandableTabsDefault");
    expect(src).toContain("use LiveLineChartDefault");
    expect(src).toContain("use SunburstChartDefault");
    expect(src).toContain('page "/audit/segmented-control/default" type:custom');
    expect(src).toContain('page "/audit/usage-meter/default" type:custom');
    expect(src).toContain('page "/audit/masonry/default" type:custom');
    expect(src).toContain('page "/audit/heatmap/default" type:custom');
    expect(src).toContain('page "/audit/comparison-slider/default" type:custom');
    expect(src).toContain('page "/audit/code-tabs/default" type:custom');
    expect(src).toContain('page "/audit/expandable-tabs/default" type:custom');
    expect(src).toContain('page "/audit/live-line-chart/default" type:custom');
    expect(src).toContain('page "/audit/sunburst-chart/default" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1j families", () => {
    expect(expectedTag(getFixture("segmented-control", "default"))).toBe("div");
    expect(expectedTag(getFixture("usage-meter", "default"))).toBe("div");
    expect(expectedTag(getFixture("masonry", "default"))).toBe("div");
    expect(expectedTag(getFixture("heatmap", "default"))).toBe("div");
    expect(expectedTag(getFixture("comparison-slider", "default"))).toBe("div");
    expect(expectedTag(getFixture("code-tabs", "default"))).toBe("div");
    expect(expectedTag(getFixture("expandable-tabs", "default"))).toBe("div");
    expect(expectedTag(getFixture("live-line-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("sunburst-chart", "default"))).toBe("div");
  });

  it("emits wave 1k labels, items, and values without source", () => {
    const src = emitCronusApp([
      getFixture("choropleth-chart", "default"),
      getFixture("profit-loss-chart", "default"),
      getFixture("scroll-progress", "default"),
      getFixture("rich-text-editor", "default"),
      getFixture("confirmation-dialog", "default"),
      getFixture("invite-dialog", "default"),
      getFixture("shimmer", "default"),
      getFixture("reveal", "default"),
      getFixture("text-shimmer", "default"),
    ]);
    expect(src).toContain(
      "component ChoroplethChartDefault layout:inline style:choropleth-chart {",
    );
    expect(src).toContain('label "Regions"');
    expect(src).toContain('  text "Northwest"');
    expect(src).toContain('  text "Southeast"');
    expect(src).toContain(
      "component ProfitLossChartDefault layout:inline style:profit-loss-chart {",
    );
    expect(src).toContain('label "P/L"');
    expect(src).toContain('  text "Jan"');
    expect(src).toContain('  text "Mar"');
    expect(src).toContain("component ScrollProgressDefault layout:inline style:scroll-progress {");
    expect(src).toContain("  value:40");
    expect(src).toContain('  aria-label:"Scroll progress"');
    expect(src).toContain("component RichTextEditorDefault layout:inline style:rich-text-editor {");
    expect(src).toContain('label "Write something…"');
    expect(src).toContain('  text "Write something…"');
    expect(src).toContain('  aria-label:"Post body"');
    expect(src).toContain(
      "component ConfirmationDialogDefault layout:inline style:confirmation-dialog {",
    );
    expect(src).toContain('label "Delete project"');
    expect(src).toContain("component InviteDialogDefault layout:inline style:invite-dialog {");
    expect(src).toContain('label "Invite member"');
    expect(src).toContain("component ShimmerDefault layout:inline style:shimmer {");
    expect(src).toContain("component RevealDefault layout:inline style:reveal {");
    expect(src).toContain('label "Revealed"');
    expect(src).toContain("component TextShimmerDefault layout:inline style:text-shimmer {");
    expect(src).toContain('label "Loading"');
    expect(src).toContain("use ChoroplethChartDefault");
    expect(src).toContain("use ProfitLossChartDefault");
    expect(src).toContain("use ScrollProgressDefault");
    expect(src).toContain("use RichTextEditorDefault");
    expect(src).toContain("use ConfirmationDialogDefault");
    expect(src).toContain("use InviteDialogDefault");
    expect(src).toContain("use ShimmerDefault");
    expect(src).toContain("use RevealDefault");
    expect(src).toContain("use TextShimmerDefault");
    expect(src).toContain('page "/audit/choropleth-chart/default" type:custom');
    expect(src).toContain('page "/audit/profit-loss-chart/default" type:custom');
    expect(src).toContain('page "/audit/scroll-progress/default" type:custom');
    expect(src).toContain('page "/audit/rich-text-editor/default" type:custom');
    expect(src).toContain('page "/audit/confirmation-dialog/default" type:custom');
    expect(src).toContain('page "/audit/invite-dialog/default" type:custom');
    expect(src).toContain('page "/audit/shimmer/default" type:custom');
    expect(src).toContain('page "/audit/reveal/default" type:custom');
    expect(src).toContain('page "/audit/text-shimmer/default" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1k families", () => {
    expect(expectedTag(getFixture("choropleth-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("profit-loss-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("scroll-progress", "default"))).toBe("div");
    expect(expectedTag(getFixture("rich-text-editor", "default"))).toBe("div");
    expect(expectedTag(getFixture("confirmation-dialog", "default"))).toBe("div");
    expect(expectedTag(getFixture("invite-dialog", "default"))).toBe("div");
    expect(expectedTag(getFixture("shimmer", "default"))).toBe("div");
    expect(expectedTag(getFixture("reveal", "default"))).toBe("div");
    expect(expectedTag(getFixture("text-shimmer", "default"))).toBe("p");
  });

  it("emits wave 1l labels, items, and words without source", () => {
    const src = emitCronusApp([
      getFixture("particles", "default"),
      getFixture("sparkles-text", "default"),
      getFixture("noise", "default"),
      getFixture("morphing-popover", "default"),
      getFixture("bouncy-accordion", "default"),
      getFixture("typing-text", "default"),
      getFixture("word-rotate", "default"),
      getFixture("timeline", "default"),
      getFixture("tree-view", "default"),
    ]);
    expect(src).toContain("component ParticlesDefault layout:inline style:particles {");
    expect(src).toContain('label "Field"');
    expect(src).toContain("component SparklesTextDefault layout:inline style:sparkles-text {");
    expect(src).toContain('label "Launch"');
    expect(src).toContain("component NoiseDefault layout:inline style:noise {");
    expect(src).toContain('label "Grain"');
    expect(src).toContain(
      "component MorphingPopoverDefault layout:inline style:morphing-popover {",
    );
    expect(src).toContain('label "Open"');
    expect(src).toContain('  text "Popover body"');
    expect(src).toContain(
      "component BouncyAccordionDefault layout:inline style:bouncy-accordion {",
    );
    expect(src).toContain('  text "Type"');
    expect(src).toContain('  text "Schedule"');
    expect(src).toContain("component TypingTextDefault layout:inline style:typing-text {");
    expect(src).toContain('label "Shipping"');
    expect(src).toContain("component WordRotateDefault layout:inline style:word-rotate {");
    expect(src).toContain('label "Design"');
    expect(src).toContain('  text "Design"');
    expect(src).toContain('  text "System"');
    expect(src).toContain("component TimelineDefault layout:inline style:timeline {");
    expect(src).toContain('label "Order history"');
    expect(src).toContain('  text "Order placed"');
    expect(src).toContain('  text "Order shipped"');
    expect(src).toContain("component TreeViewDefault layout:inline style:tree-view {");
    expect(src).toContain('  text "src"');
    expect(src).toContain('  text "README.md"');
    expect(src).toContain("use ParticlesDefault");
    expect(src).toContain("use SparklesTextDefault");
    expect(src).toContain("use NoiseDefault");
    expect(src).toContain("use MorphingPopoverDefault");
    expect(src).toContain("use BouncyAccordionDefault");
    expect(src).toContain("use TypingTextDefault");
    expect(src).toContain("use WordRotateDefault");
    expect(src).toContain("use TimelineDefault");
    expect(src).toContain("use TreeViewDefault");
    expect(src).toContain('page "/audit/particles/default" type:custom');
    expect(src).toContain('page "/audit/sparkles-text/default" type:custom');
    expect(src).toContain('page "/audit/noise/default" type:custom');
    expect(src).toContain('page "/audit/morphing-popover/default" type:custom');
    expect(src).toContain('page "/audit/bouncy-accordion/default" type:custom');
    expect(src).toContain('page "/audit/typing-text/default" type:custom');
    expect(src).toContain('page "/audit/word-rotate/default" type:custom');
    expect(src).toContain('page "/audit/timeline/default" type:custom');
    expect(src).toContain('page "/audit/tree-view/default" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1l families", () => {
    expect(expectedTag(getFixture("particles", "default"))).toBe("div");
    expect(expectedTag(getFixture("sparkles-text", "default"))).toBe("span");
    expect(expectedTag(getFixture("noise", "default"))).toBe("div");
    expect(expectedTag(getFixture("morphing-popover", "default"))).toBe("div");
    expect(expectedTag(getFixture("bouncy-accordion", "default"))).toBe("div");
    expect(expectedTag(getFixture("typing-text", "default"))).toBe("span");
    expect(expectedTag(getFixture("word-rotate", "default"))).toBe("span");
    expect(expectedTag(getFixture("timeline", "default"))).toBe("ol");
    expect(expectedTag(getFixture("tree-view", "default"))).toBe("div");
  });

  it("emits wave 1m labels and items without source", () => {
    const src = emitCronusApp([
      getFixture("tilt-card", "default"),
      getFixture("star-border", "default"),
      getFixture("glass-card", "default"),
      getFixture("terminal", "default"),
      getFixture("video-player", "default"),
      getFixture("text-effect", "default"),
      getFixture("spotlight-card", "default"),
      getFixture("animated-list", "default"),
      getFixture("toast", "default"),
    ]);
    expect(src).toContain("component TiltCardDefault layout:inline style:tilt-card {");
    expect(src).toContain('label "Hover me"');
    expect(src).toContain("component StarBorderDefault layout:inline style:star-border {");
    expect(src).toContain('label "Twinkle"');
    expect(src).toContain("component GlassCardDefault layout:inline style:glass-card {");
    expect(src).toContain('label "Frosted"');
    expect(src).toContain("component TerminalDefault layout:inline style:terminal {");
    expect(src).toContain('label "zsh"');
    expect(src).toContain('  text "bunx cronus-ui add button"');
    expect(src).toContain('  text "added button"');
    expect(src).toContain("component VideoPlayerDefault layout:inline style:video-player {");
    expect(src).toContain('label "Launch video"');
    expect(src).toContain("component TextEffectDefault layout:inline style:text-effect {");
    expect(src).toContain('label "Headline"');
    expect(src).toContain("component SpotlightCardDefault layout:inline style:spotlight-card {");
    expect(src).toContain('label "Spotlight"');
    expect(src).toContain("component AnimatedListDefault layout:inline style:animated-list {");
    expect(src).toContain('  text "Alpha"');
    expect(src).toContain('  text "Beta"');
    expect(src).toContain("component ToastDefault layout:inline style:toast {");
    expect(src).toContain('label "Saved"');
    expect(src).toContain("use TiltCardDefault");
    expect(src).toContain("use StarBorderDefault");
    expect(src).toContain("use GlassCardDefault");
    expect(src).toContain("use TerminalDefault");
    expect(src).toContain("use VideoPlayerDefault");
    expect(src).toContain("use TextEffectDefault");
    expect(src).toContain("use SpotlightCardDefault");
    expect(src).toContain("use AnimatedListDefault");
    expect(src).toContain("use ToastDefault");
    expect(src).toContain('page "/audit/tilt-card/default" type:custom');
    expect(src).toContain('page "/audit/star-border/default" type:custom');
    expect(src).toContain('page "/audit/glass-card/default" type:custom');
    expect(src).toContain('page "/audit/terminal/default" type:custom');
    expect(src).toContain('page "/audit/video-player/default" type:custom');
    expect(src).toContain('page "/audit/text-effect/default" type:custom');
    expect(src).toContain('page "/audit/spotlight-card/default" type:custom');
    expect(src).toContain('page "/audit/animated-list/default" type:custom');
    expect(src).toContain('page "/audit/toast/default" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1m families", () => {
    expect(expectedTag(getFixture("tilt-card", "default"))).toBe("div");
    expect(expectedTag(getFixture("star-border", "default"))).toBe("div");
    expect(expectedTag(getFixture("glass-card", "default"))).toBe("div");
    expect(expectedTag(getFixture("terminal", "default"))).toBe("div");
    expect(expectedTag(getFixture("video-player", "default"))).toBe("div");
    expect(expectedTag(getFixture("text-effect", "default"))).toBe("p");
    expect(expectedTag(getFixture("spotlight-card", "default"))).toBe("div");
    expect(expectedTag(getFixture("animated-list", "default"))).toBe("ul");
    expect(expectedTag(getFixture("toast", "default"))).toBe("div");
  });

  it("emits wave 1n labels, items, code, and values without source", () => {
    const src = emitCronusApp([
      getFixture("carousel", "default"),
      getFixture("code-block", "default"),
      getFixture("description-list", "default"),
      getFixture("kanban", "default"),
      getFixture("json-viewer", "default"),
      getFixture("animated-number", "default"),
      getFixture("marquee", "default"),
      getFixture("gradient-text", "default"),
      getFixture("shiny-text", "default"),
    ]);
    expect(src).toContain("component CarouselDefault layout:inline style:carousel {");
    expect(src).toContain('  text "One"');
    expect(src).toContain('  text "Two"');
    expect(src).toContain("component CodeBlockDefault layout:inline style:code-block {");
    expect(src).toContain('label "const n = 1;"');
    expect(src).toContain('  text "const n = 1;"');
    expect(src).toContain(
      "component DescriptionListDefault layout:inline style:description-list {",
    );
    expect(src).toContain('  text "Name"');
    expect(src).toContain('  text "Ada"');
    expect(src).toContain('  text "Status"');
    expect(src).toContain('  text "Paid"');
    expect(src).toContain("component KanbanDefault layout:inline style:kanban {");
    expect(src).toContain('label "Board"');
    expect(src).toContain('  text "Todo"');
    expect(src).toContain('  text "Ship"');
    expect(src).toContain('  text "Doing"');
    expect(src).toContain('  text "Review"');
    expect(src).toContain("component JsonViewerDefault layout:inline style:json-viewer {");
    expect(src).toContain('label "Payload"');
    expect(src).toContain("component AnimatedNumberDefault layout:inline style:animated-number {");
    expect(src).toContain('label "Count"');
    expect(src).toContain("  value:1234");
    expect(src).toContain("component MarqueeDefault layout:inline style:marquee {");
    expect(src).toContain('label "Logos"');
    expect(src).toContain('  text "Acme"');
    expect(src).toContain('  text "Globex"');
    expect(src).toContain("component GradientTextDefault layout:inline style:gradient-text {");
    expect(src).toContain('label "Aurora"');
    expect(src).toContain("component ShinyTextDefault layout:inline style:shiny-text {");
    expect(src).toContain('label "Sheen"');
    expect(src).toContain("use CarouselDefault");
    expect(src).toContain("use CodeBlockDefault");
    expect(src).toContain("use DescriptionListDefault");
    expect(src).toContain("use KanbanDefault");
    expect(src).toContain("use JsonViewerDefault");
    expect(src).toContain("use AnimatedNumberDefault");
    expect(src).toContain("use MarqueeDefault");
    expect(src).toContain("use GradientTextDefault");
    expect(src).toContain("use ShinyTextDefault");
    expect(src).toContain('page "/audit/carousel/default" type:custom');
    expect(src).toContain('page "/audit/code-block/default" type:custom');
    expect(src).toContain('page "/audit/description-list/default" type:custom');
    expect(src).toContain('page "/audit/kanban/default" type:custom');
    expect(src).toContain('page "/audit/json-viewer/default" type:custom');
    expect(src).toContain('page "/audit/animated-number/default" type:custom');
    expect(src).toContain('page "/audit/marquee/default" type:custom');
    expect(src).toContain('page "/audit/gradient-text/default" type:custom');
    expect(src).toContain('page "/audit/shiny-text/default" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1n families", () => {
    expect(expectedTag(getFixture("carousel", "default"))).toBe("div");
    expect(expectedTag(getFixture("code-block", "default"))).toBe("div");
    expect(expectedTag(getFixture("description-list", "default"))).toBe("dl");
    expect(expectedTag(getFixture("kanban", "default"))).toBe("div");
    expect(expectedTag(getFixture("json-viewer", "default"))).toBe("div");
    expect(expectedTag(getFixture("animated-number", "default"))).toBe("span");
    expect(expectedTag(getFixture("marquee", "default"))).toBe("div");
    expect(expectedTag(getFixture("gradient-text", "default"))).toBe("span");
    expect(expectedTag(getFixture("shiny-text", "default"))).toBe("span");
  });

  it("emits wave 1o labels, items, and values without source", () => {
    const src = emitCronusApp([
      getFixture("aspect-ratio", "default"),
      getFixture("frame", "default"),
      getFixture("flip-card", "default"),
      getFixture("countdown", "default"),
      getFixture("animated-button", "default"),
      getFixture("card-stack", "default"),
      getFixture("gauge-chart", "default"),
      getFixture("funnel-chart", "default"),
      getFixture("candlestick-chart", "default"),
    ]);
    expect(src).toContain("component AspectRatioDefault layout:inline style:aspect-ratio {");
    expect(src).toContain('label "Framed"');
    expect(src).toContain("component FrameDefault layout:inline style:frame {");
    expect(src).toContain('label "Checkout"');
    expect(src).toContain("component FlipCardDefault layout:inline style:flip-card {");
    expect(src).toContain('label "Plan"');
    expect(src).toContain('  text "Front"');
    expect(src).toContain('  text "Back"');
    expect(src).toContain("component CountdownDefault layout:inline style:countdown {");
    expect(src).toContain('label "Launch"');
    expect(src).toContain("component AnimatedButtonDefault layout:inline style:animated-button {");
    expect(src).toContain('label "Get started"');
    expect(src).toContain("component CardStackDefault layout:inline style:card-stack {");
    expect(src).toContain('label "Stack"');
    expect(src).toContain('  text "One"');
    expect(src).toContain('  text "Two"');
    expect(src).toContain("component GaugeChartDefault layout:inline style:gauge-chart {");
    expect(src).toContain('label "Score"');
    expect(src).toContain("  value:72");
    expect(src).toContain("component FunnelChartDefault layout:inline style:funnel-chart {");
    expect(src).toContain('label "Pipeline"');
    expect(src).toContain('  text "Visit"');
    expect(src).toContain('  text "Signup"');
    expect(src).toContain(
      "component CandlestickChartDefault layout:inline style:candlestick-chart {",
    );
    expect(src).toContain('label "OHLC"');
    expect(src).toContain('  text "Mon"');
    expect(src).toContain('  text "Tue"');
    expect(src).toContain('  text "Wed"');
    expect(src).toContain("use AspectRatioDefault");
    expect(src).toContain("use FrameDefault");
    expect(src).toContain("use FlipCardDefault");
    expect(src).toContain("use CountdownDefault");
    expect(src).toContain("use AnimatedButtonDefault");
    expect(src).toContain("use CardStackDefault");
    expect(src).toContain("use GaugeChartDefault");
    expect(src).toContain("use FunnelChartDefault");
    expect(src).toContain("use CandlestickChartDefault");
    expect(src).toContain('page "/audit/aspect-ratio/default" type:custom');
    expect(src).toContain('page "/audit/frame/default" type:custom');
    expect(src).toContain('page "/audit/flip-card/default" type:custom');
    expect(src).toContain('page "/audit/countdown/default" type:custom');
    expect(src).toContain('page "/audit/animated-button/default" type:custom');
    expect(src).toContain('page "/audit/card-stack/default" type:custom');
    expect(src).toContain('page "/audit/gauge-chart/default" type:custom');
    expect(src).toContain('page "/audit/funnel-chart/default" type:custom');
    expect(src).toContain('page "/audit/candlestick-chart/default" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1o families", () => {
    expect(expectedTag(getFixture("aspect-ratio", "default"))).toBe("div");
    expect(expectedTag(getFixture("frame", "default"))).toBe("div");
    expect(expectedTag(getFixture("flip-card", "default"))).toBe("div");
    expect(expectedTag(getFixture("countdown", "default"))).toBe("div");
    expect(expectedTag(getFixture("animated-button", "default"))).toBe("button");
    expect(expectedTag(getFixture("card-stack", "default"))).toBe("section");
    expect(expectedTag(getFixture("gauge-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("funnel-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("candlestick-chart", "default"))).toBe("div");
  });

  it("emits wave 1p labels, items, and values without source", () => {
    const src = emitCronusApp([
      getFixture("logo-carousel", "default"),
      getFixture("dynamic-island", "default"),
      getFixture("image-zoom", "default"),
      getFixture("aurora-background", "default"),
      getFixture("border-beam", "default"),
      getFixture("confetti", "default"),
      getFixture("composed-chart", "default"),
      getFixture("heatmap-chart", "default"),
      getFixture("chart", "default"),
    ]);
    expect(src).toContain("component LogoCarouselDefault layout:inline style:logo-carousel {");
    expect(src).toContain('label "Logos"');
    expect(src).toContain('  text "Acme"');
    expect(src).toContain('  text "Globex"');
    expect(src).toContain("component DynamicIslandDefault layout:inline style:dynamic-island {");
    expect(src).toContain('  text "Idle"');
    expect(src).toContain('  text "Active"');
    expect(src).toContain("component ImageZoomDefault layout:inline style:image-zoom {");
    expect(src).toContain('label "Zoom"');
    expect(src).toContain(
      "component AuroraBackgroundDefault layout:inline style:aurora-background {",
    );
    expect(src).toContain('label "Aurora"');
    expect(src).toContain("component BorderBeamDefault layout:inline style:border-beam {");
    expect(src).toContain('label "Beam"');
    expect(src).toContain("component ConfettiDefault layout:inline style:confetti {");
    expect(src).toContain('label "Celebrate"');
    expect(src).toContain("component ComposedChartDefault layout:inline style:composed-chart {");
    expect(src).toContain('label "Mix"');
    expect(src).toContain('  text "Jan"');
    expect(src).toContain('  text "Feb"');
    expect(src).toContain('  text "Mar"');
    expect(src).toContain("component HeatmapChartDefault layout:inline style:heatmap-chart {");
    expect(src).toContain('label "Activity"');
    expect(src).toContain('  text "1"');
    expect(src).toContain('  text "3"');
    expect(src).toContain('  text "5"');
    expect(src).toContain('  text "2"');
    expect(src).toContain("component ChartDefault layout:inline style:chart {");
    expect(src).toContain('label "Series"');
    expect(src).toContain('  text "4"');
    expect(src).toContain('  text "8"');
    expect(src).toContain('  text "6"');
    expect(src).toContain("use LogoCarouselDefault");
    expect(src).toContain("use DynamicIslandDefault");
    expect(src).toContain("use ImageZoomDefault");
    expect(src).toContain("use AuroraBackgroundDefault");
    expect(src).toContain("use BorderBeamDefault");
    expect(src).toContain("use ConfettiDefault");
    expect(src).toContain("use ComposedChartDefault");
    expect(src).toContain("use HeatmapChartDefault");
    expect(src).toContain("use ChartDefault");
    expect(src).toContain('page "/audit/logo-carousel/default" type:custom');
    expect(src).toContain('page "/audit/dynamic-island/default" type:custom');
    expect(src).toContain('page "/audit/image-zoom/default" type:custom');
    expect(src).toContain('page "/audit/aurora-background/default" type:custom');
    expect(src).toContain('page "/audit/border-beam/default" type:custom');
    expect(src).toContain('page "/audit/confetti/default" type:custom');
    expect(src).toContain('page "/audit/composed-chart/default" type:custom');
    expect(src).toContain('page "/audit/heatmap-chart/default" type:custom');
    expect(src).toContain('page "/audit/chart/default" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1p families", () => {
    expect(expectedTag(getFixture("logo-carousel", "default"))).toBe("ul");
    expect(expectedTag(getFixture("dynamic-island", "default"))).toBe("div");
    expect(expectedTag(getFixture("image-zoom", "default"))).toBe("button");
    expect(expectedTag(getFixture("aurora-background", "default"))).toBe("div");
    expect(expectedTag(getFixture("border-beam", "default"))).toBe("div");
    expect(expectedTag(getFixture("confetti", "default"))).toBe("div");
    expect(expectedTag(getFixture("composed-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("heatmap-chart", "default"))).toBe("div");
    expect(expectedTag(getFixture("chart", "default"))).toBe("div");
  });

  it("emits wave 1q labels without source", () => {
    const src = emitCronusApp([
      getFixture("click-spark", "default"),
      getFixture("glare-hover", "default"),
      getFixture("magnetic", "default"),
      getFixture("dot-pattern", "default"),
      getFixture("flickering-grid", "default"),
      getFixture("grid-pattern", "default"),
      getFixture("highlighter", "default"),
      getFixture("scramble-text", "default"),
      getFixture("spinning-text", "default"),
    ]);
    expect(src).toContain("component ClickSparkDefault layout:inline style:click-spark {");
    expect(src).toContain('label "Spark"');
    expect(src).toContain("component GlareHoverDefault layout:inline style:glare-hover {");
    expect(src).toContain('label "Glare"');
    expect(src).toContain("component MagneticDefault layout:inline style:magnetic {");
    expect(src).toContain('label "Pull"');
    expect(src).toContain("component DotPatternDefault layout:inline style:dot-pattern {");
    expect(src).toContain('label "Dots"');
    expect(src).toContain("component FlickeringGridDefault layout:inline style:flickering-grid {");
    expect(src).toContain('label "Flicker"');
    expect(src).toContain("component GridPatternDefault layout:inline style:grid-pattern {");
    expect(src).toContain('label "Grid"');
    expect(src).toContain("component HighlighterDefault layout:inline style:highlighter {");
    expect(src).toContain('label "Marked"');
    expect(src).toContain("component ScrambleTextDefault layout:inline style:scramble-text {");
    expect(src).toContain('label "Decode"');
    expect(src).toContain("component SpinningTextDefault layout:inline style:spinning-text {");
    expect(src).toContain('label "SPIN"');
    expect(src).toContain("use ClickSparkDefault");
    expect(src).toContain("use GlareHoverDefault");
    expect(src).toContain("use MagneticDefault");
    expect(src).toContain("use DotPatternDefault");
    expect(src).toContain("use FlickeringGridDefault");
    expect(src).toContain("use GridPatternDefault");
    expect(src).toContain("use HighlighterDefault");
    expect(src).toContain("use ScrambleTextDefault");
    expect(src).toContain("use SpinningTextDefault");
    expect(src).toContain('page "/audit/click-spark/default" type:custom');
    expect(src).toContain('page "/audit/glare-hover/default" type:custom');
    expect(src).toContain('page "/audit/magnetic/default" type:custom');
    expect(src).toContain('page "/audit/dot-pattern/default" type:custom');
    expect(src).toContain('page "/audit/flickering-grid/default" type:custom');
    expect(src).toContain('page "/audit/grid-pattern/default" type:custom');
    expect(src).toContain('page "/audit/highlighter/default" type:custom');
    expect(src).toContain('page "/audit/scramble-text/default" type:custom');
    expect(src).toContain('page "/audit/spinning-text/default" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1q families", () => {
    expect(expectedTag(getFixture("click-spark", "default"))).toBe("div");
    expect(expectedTag(getFixture("glare-hover", "default"))).toBe("div");
    expect(expectedTag(getFixture("magnetic", "default"))).toBe("div");
    expect(expectedTag(getFixture("dot-pattern", "default"))).toBe("div");
    expect(expectedTag(getFixture("flickering-grid", "default"))).toBe("div");
    expect(expectedTag(getFixture("grid-pattern", "default"))).toBe("div");
    expect(expectedTag(getFixture("highlighter", "default"))).toBe("span");
    expect(expectedTag(getFixture("scramble-text", "default"))).toBe("span");
    expect(expectedTag(getFixture("spinning-text", "default"))).toBe("div");
  });

  it("emits wave 1r labels without source", () => {
    const src = emitCronusApp([
      getFixture("gradient-border", "default"),
      getFixture("light-rays", "default"),
      getFixture("orbit", "default"),
      getFixture("progressive-blur", "default"),
      getFixture("retro-grid", "default"),
      getFixture("ripple", "default"),
      getFixture("motion-presets", "default"),
    ]);
    expect(src).toContain("component GradientBorderDefault layout:inline style:gradient-border {");
    expect(src).toContain('label "Border"');
    expect(src).toContain("component LightRaysDefault layout:inline style:light-rays {");
    expect(src).toContain('label "Rays"');
    expect(src).toContain("component OrbitDefault layout:inline style:orbit {");
    expect(src).toContain('label "Orbit"');
    expect(src).toContain('  text "A"');
    expect(src).toContain('  text "B"');
    expect(src).toContain('  text "C"');
    expect(src).toContain("component ProgressiveBlurDefault layout:inline style:progressive-blur {");
    expect(src).toContain('label "Blur"');
    expect(src).toContain("component RetroGridDefault layout:inline style:retro-grid {");
    expect(src).toContain('label "Grid"');
    expect(src).toContain("component RippleDefault layout:inline style:ripple {");
    expect(src).toContain('label "Pulse"');
    expect(src).toContain("component MotionPresetsDefault layout:inline style:motion-presets {");
    expect(src).toContain('  text "fade-in"');
    expect(src).toContain('  text "fade-in-up"');
    expect(src).toContain('  text "scale-in"');
    expect(src).toContain("use GradientBorderDefault");
    expect(src).toContain("use LightRaysDefault");
    expect(src).toContain("use OrbitDefault");
    expect(src).toContain("use ProgressiveBlurDefault");
    expect(src).toContain("use RetroGridDefault");
    expect(src).toContain("use RippleDefault");
    expect(src).toContain("use MotionPresetsDefault");
    expect(src).toContain('page "/audit/gradient-border/default" type:custom');
    expect(src).toContain('page "/audit/light-rays/default" type:custom');
    expect(src).toContain('page "/audit/orbit/default" type:custom');
    expect(src).toContain('page "/audit/progressive-blur/default" type:custom');
    expect(src).toContain('page "/audit/retro-grid/default" type:custom');
    expect(src).toContain('page "/audit/ripple/default" type:custom');
    expect(src).toContain('page "/audit/motion-presets/default" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("maps expected tags for wave 1r families", () => {
    expect(expectedTag(getFixture("gradient-border", "default"))).toBe("div");
    expect(expectedTag(getFixture("light-rays", "default"))).toBe("div");
    expect(expectedTag(getFixture("orbit", "default"))).toBe("div");
    expect(expectedTag(getFixture("progressive-blur", "default"))).toBe("div");
    expect(expectedTag(getFixture("retro-grid", "default"))).toBe("div");
    expect(expectedTag(getFixture("ripple", "default"))).toBe("div");
    expect(expectedTag(getFixture("motion-presets", "default"))).toBe("div");
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

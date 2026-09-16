import { c } from "./ansi.js";
import type { PackageManager } from "./package-manager.js";
import { isComposedTemplate, isGoldPathTemplate, type TemplateName } from "./scaffold-options.js";

/**
 * Next-step lines printed after a successful scaffold. Pure so tests can assert
 * the copy without scraping stdout. `template` is optional for back-compat: omit
 * it (or pass a bundled template) to keep the component-add path; composed
 * templates (`saas`/`store`/`landing`) get add-page / theme / upgrade instead.
 * saas/admin list `db:push` before `dev` unless the scaffolder already ran it.
 */
export function outroLines(
  name: string,
  pm: PackageManager,
  installed: boolean,
  template?: TemplateName,
  dbPushed = false,
): string[] {
  const dev = pm === "npm" ? "npm run dev" : `${pm} dev`;
  const install = pm === "yarn" ? "yarn" : `${pm} install`;
  const dbPush = pm === "npm" ? "npm run db:push" : `${pm} run db:push`;
  const dollar = c.dim("$");
  const composed = template !== undefined && isComposedTemplate(template);
  const goldPath = template !== undefined && isGoldPathTemplate(template);
  const grow = composed
    ? [
        "Grow the app anytime:",
        `  ${dollar} npx cronus-ui add-page --route /pricing --blocks pricing,cta --nav Pricing`,
        `  ${dollar} npx cronus-ui theme set aurora --mode dark`,
        `  ${dollar} npx cronus-ui upgrade --all --dry-run`,
      ]
    : [
        `Add more components anytime:  ${dollar} npx cronus-ui add dialog table tabs`,
        `Want a multi-page app?        ${dollar} npx cronus-ui compose saas`,
      ];
  return [
    "",
    `${c.green(c.bold("Done!"))} Your Cronus UI app is ready in ${c.cyan(name)}.`,
    "",
    "Next steps:",
    `  ${dollar} cd ${name}`,
    ...(installed ? [] : [`  ${dollar} ${install}`]),
    ...(goldPath && !dbPushed ? [`  ${dollar} ${dbPush}`] : []),
    `  ${dollar} ${dev}`,
    "",
    `Then open the URL printed by ${c.cyan(dev)}.`,
    "",
    ...grow,
    "",
  ];
}

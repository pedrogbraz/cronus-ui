/**
 * jsdom setup for the @cronus-ui/ui component render tests (the "ui-dom" Vitest
 * project). Adds Testing Library DOM matchers + axe a11y matchers, and unmounts
 * every render between tests so jsdom state never leaks across cases.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import * as axeMatchers from "vitest-axe/matchers";

expect.extend(axeMatchers);

afterEach(() => {
  cleanup();
});

/**
 * jsdom setup for the @kronus-ui/theme render tests (the "theme-dom" Vitest
 * project). Adds Testing Library DOM matchers and unmounts every render between
 * tests so jsdom state never leaks across cases.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

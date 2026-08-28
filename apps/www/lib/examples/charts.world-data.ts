"use client";

import type { ChoroplethChartProps } from "@cronus-ui/ui/charts";
import { useEffect, useState } from "react";

const WORLD_URL =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

type WorldCollection = ChoroplethChartProps["data"];

let cache: WorldCollection | null = null;
let inflight: Promise<WorldCollection | null> | null = null;

function loadWorld(): Promise<WorldCollection | null> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = fetch(WORLD_URL)
    .then((response) => {
      if (!response.ok) throw new Error("world geojson failed");
      return response.json() as Promise<WorldCollection>;
    })
    .then((json) => {
      cache = json;
      return json;
    })
    .catch(() => null);
  return inflight;
}

export function useWorldCountries() {
  const [worldData, setWorldData] = useState<WorldCollection | null>(cache);
  const [isLoading, setIsLoading] = useState(!cache);

  useEffect(() => {
    let cancelled = false;
    loadWorld().then((next) => {
      if (cancelled) return;
      setWorldData(next);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { worldData, isLoading };
}

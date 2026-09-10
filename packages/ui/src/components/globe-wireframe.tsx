"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { type GeoPermissibleObjects, geoGraticule, geoOrthographic, geoPath } from "d3-geo";
import {
  type PointerEvent,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

/** Natural Earth 110m countries, same source ScrollX fetches. */
const WORLD_ATLAS_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const globeWireframeVariants = cva("relative aspect-square w-full text-fg", {
  variants: {
    variant: {
      wireframe: "",
      wireframesolid: "",
      solid: "",
    },
  },
  defaultVariants: { variant: "wireframe" },
});

export interface GlobeWireframeLabels {
  /** Accessible name for the globe. @default "Globe" */
  globe: string;
}

const DEFAULT_LABELS: GlobeWireframeLabels = {
  globe: "Globe",
};

export interface GlobeWireframeProps extends VariantProps<typeof globeWireframeVariants> {
  ref?: Ref<HTMLDivElement>;
  className?: string;
  width?: number;
  height?: number;
  /** Country / graticule / outline stroke. @default "currentColor" */
  strokeColor?: string;
  /** @default 1 */
  strokeWidth?: number;
  /** @default "currentColor" */
  graticuleColor?: string;
  /** @default 0.2 */
  graticuleOpacity?: number;
  /** @default "currentColor" */
  sphereOutlineColor?: string;
  /** @default 1 */
  sphereOutlineWidth?: number;
  /** @default true */
  autoRotate?: boolean;
  /** Degrees per animation frame. @default 0.5 */
  autoRotateSpeed?: number;
  /** @default [0, 0] */
  initialRotation?: [number, number];
  /** @default true */
  enableInteraction?: boolean;
  /** @default true */
  showGraticule?: boolean;
  /** @default 1 */
  scale?: number;
  countryFillColor?: string;
  labels?: Partial<GlobeWireframeLabels>;
}

type Ring = [number, number][];
type PolygonCoords = Ring[];
type MultiPolygonCoords = PolygonCoords[];

interface LandFeature {
  type: "Feature";
  id: string;
  properties: Record<string, unknown>;
  geometry:
    | { type: "Polygon"; coordinates: PolygonCoords }
    | { type: "MultiPolygon"; coordinates: MultiPolygonCoords };
}

interface TopoTransform {
  scale: [number, number];
  translate: [number, number];
}

interface TopoGeometry {
  type: string;
  id?: string | number;
  arcs?: number[][] | number[][][];
  properties?: Record<string, unknown>;
}

interface Topology {
  type: "Topology";
  transform?: TopoTransform;
  arcs: number[][][];
  objects: {
    countries: {
      type: "GeometryCollection";
      geometries: TopoGeometry[];
    };
  };
}

function decodeArc(topology: Topology, index: number): Ring {
  const absolute = index < 0 ? ~index : index;
  const raw = topology.arcs[absolute];
  if (!raw) return [];
  const transform = topology.transform;
  let x = 0;
  let y = 0;
  const points: Ring = raw.map((pair) => {
    x += pair[0] ?? 0;
    y += pair[1] ?? 0;
    if (!transform) return [x, y];
    return [
      x * transform.scale[0] + transform.translate[0],
      y * transform.scale[1] + transform.translate[1],
    ];
  });
  return index < 0 ? points.reverse() : points;
}

function stitchRing(topology: Topology, arcs: number[]): Ring {
  const ring: Ring = [];
  for (const arc of arcs) {
    const pts = decodeArc(topology, arc);
    if (ring.length > 0 && pts.length > 0) {
      ring.push(...pts.slice(1));
    } else {
      ring.push(...pts);
    }
  }
  return ring;
}

function featureFromGeometry(
  topology: Topology,
  geom: TopoGeometry,
  fallbackId: string,
): LandFeature | null {
  const id = geom.id === undefined ? fallbackId : String(geom.id);
  if (geom.type === "Polygon" && Array.isArray(geom.arcs)) {
    const coordinates = (geom.arcs as number[][]).map((arcs) => stitchRing(topology, arcs));
    return {
      type: "Feature",
      id,
      properties: geom.properties ?? {},
      geometry: { type: "Polygon", coordinates },
    };
  }
  if (geom.type === "MultiPolygon" && Array.isArray(geom.arcs)) {
    const coordinates = (geom.arcs as number[][][]).map((polygon) =>
      polygon.map((arcs) => stitchRing(topology, arcs)),
    );
    return {
      type: "Feature",
      id,
      properties: geom.properties ?? {},
      geometry: { type: "MultiPolygon", coordinates },
    };
  }
  return null;
}

function countriesFromTopology(world: Topology): LandFeature[] {
  const geometries = world.objects?.countries?.geometries;
  if (!geometries) return [];
  const features: LandFeature[] = [];
  for (const [index, geom] of geometries.entries()) {
    const feature = featureFromGeometry(world, geom, `country-${index}`);
    if (feature) features.push(feature);
  }
  return features;
}

function variantStyle(
  variant: "wireframe" | "wireframesolid" | "solid",
  strokeWidth: number,
  showGraticule: boolean,
  graticuleOpacity: number,
  sphereOutlineWidth: number,
  countryFillColor: string | undefined,
) {
  if (variant === "solid") {
    return {
      countryFill: countryFillColor ?? "currentColor",
      strokeWidth: strokeWidth * 0.5,
      opacity: 0.3,
      renderGraticule: false,
      graticuleOpacity: 0,
      sphereOutlineWidth: 1.5,
      sphereOpacity: 0.8,
    };
  }
  if (variant === "wireframesolid") {
    return {
      countryFill: "none",
      strokeWidth,
      opacity: 1,
      renderGraticule: false,
      graticuleOpacity: 0,
      sphereOutlineWidth: 1.5,
      sphereOpacity: 0.8,
    };
  }
  return {
    countryFill: "none",
    strokeWidth,
    opacity: 1,
    renderGraticule: showGraticule,
    graticuleOpacity,
    sphereOutlineWidth,
    sphereOpacity: 1,
  };
}

export function GlobeWireframe({
  ref,
  className,
  width,
  height,
  strokeColor = "currentColor",
  strokeWidth = 1,
  graticuleColor = "currentColor",
  graticuleOpacity = 0.2,
  sphereOutlineColor = "currentColor",
  sphereOutlineWidth = 1,
  autoRotate = true,
  autoRotateSpeed = 0.5,
  initialRotation = [0, 0],
  enableInteraction = true,
  showGraticule = true,
  variant = "wireframe",
  scale = 1,
  countryFillColor,
  labels,
}: GlobeWireframeProps) {
  const copy = { ...DEFAULT_LABELS, ...labels };
  const titleId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPointer = useRef<[number, number]>([0, 0]);
  const [rotation, setRotation] = useState<[number, number]>(initialRotation);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [land, setLand] = useState<LandFeature[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const setContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const useResponsive = !width && !height;
  const finalWidth = useResponsive ? size.width : (width ?? 800);
  const finalHeight = useResponsive ? size.height : (height ?? 500);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      if (!useResponsive) return;
      const next = container.offsetWidth || 300;
      setSize({ width: next, height: next });
    };
    updateSize();

    const resize = new ResizeObserver(updateSize);
    if (useResponsive) resize.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry) setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    io.observe(container);

    return () => {
      resize.disconnect();
      io.disconnect();
    };
  }, [useResponsive]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch(WORLD_ATLAS_URL);
        if (!response.ok) return;
        const world = (await response.json()) as Topology;
        if (!cancelled) setLand(countriesFromTopology(world));
      } catch {
        if (!cancelled) setLand([]);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!autoRotate || !isVisible || isDragging || reduceMotion) return;
    let frame = 0;
    const rotate = () => {
      setRotation((prev) => [(prev[0] + autoRotateSpeed) % 360, prev[1]]);
      frame = requestAnimationFrame(rotate);
    };
    frame = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(frame);
  }, [autoRotate, autoRotateSpeed, isVisible, isDragging, reduceMotion]);

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (!enableInteraction) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    lastPointer.current = [event.clientX, event.clientY];
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!isDragging || !enableInteraction) return;
    const dx = event.clientX - lastPointer.current[0];
    const dy = event.clientY - lastPointer.current[1];
    lastPointer.current = [event.clientX, event.clientY];
    setRotation((prev) => [prev[0] + dx * 0.5, Math.max(-90, Math.min(90, prev[1] - dy * 0.5))]);
  };

  const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  const style = variantStyle(
    variant ?? "wireframe",
    strokeWidth,
    showGraticule,
    graticuleOpacity,
    sphereOutlineWidth,
    countryFillColor,
  );

  const ready = finalWidth > 0 && finalHeight > 0;
  let countryPaths: { id: string; d: string }[] = [];
  let graticulePath = "";
  let spherePath = "";

  if (ready) {
    const projection = geoOrthographic()
      .scale((Math.min(finalWidth, finalHeight) / 2) * scale * 0.9)
      .translate([finalWidth / 2, finalHeight / 2])
      .rotate([rotation[0], rotation[1]])
      .clipAngle(90)
      .precision(0.1);
    const path = geoPath(projection);
    countryPaths = land.flatMap((feature) => {
      const d = path(feature as GeoPermissibleObjects) ?? "";
      if (d.length === 0 || d.includes("NaN")) return [];
      return [{ id: feature.id, d }];
    });
    if (style.renderGraticule && style.graticuleOpacity > 0) {
      graticulePath = path(geoGraticule()() as GeoPermissibleObjects) ?? "";
    }
    spherePath = path({ type: "Sphere" } as GeoPermissibleObjects) ?? "";
  }

  return (
    <div
      ref={setContainerRef}
      data-slot="globe-wireframe"
      data-variant={variant ?? "wireframe"}
      role="img"
      aria-labelledby={titleId}
      className={cn(globeWireframeVariants({ variant }), className)}
    >
      <span id={titleId} className="sr-only">
        {copy.globe}
      </span>
      <svg
        width={finalWidth}
        height={finalHeight}
        viewBox={ready ? `0 0 ${finalWidth} ${finalHeight}` : undefined}
        aria-hidden="true"
        className={cn(
          "h-full w-full select-none",
          useResponsive && "opacity-0 transition-opacity duration-1000",
        )}
        style={{
          cursor: enableInteraction ? (isDragging ? "grabbing" : "grab") : "default",
          opacity: useResponsive ? (size.width > 0 ? 1 : 0) : 1,
          touchAction: enableInteraction ? "none" : undefined,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {graticulePath ? (
          <path
            d={graticulePath}
            fill="none"
            stroke={graticuleColor}
            strokeWidth={1}
            opacity={style.graticuleOpacity}
          />
        ) : null}
        {countryPaths.map((country) => (
          <path
            key={country.id}
            d={country.d}
            fill={style.countryFill}
            stroke={strokeColor}
            strokeWidth={style.strokeWidth}
            opacity={style.opacity}
          />
        ))}
        {spherePath ? (
          <path
            d={spherePath}
            fill="none"
            stroke={sphereOutlineColor}
            strokeWidth={style.sphereOutlineWidth}
            opacity={style.sphereOpacity}
          />
        ) : null}
      </svg>
    </div>
  );
}

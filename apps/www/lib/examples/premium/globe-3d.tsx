"use client";

import { Globe3D, type GlobeMarker } from "@cronus-ui/ui/globe-3d";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

/**
 * TextEffect: staggers a headline in by character (blur) and a subtitle by word
 * (slide). "Replay" remounts the block so the mount-triggered animation runs
 * again.
 */
const GLOBE_3D_MARKERS: GlobeMarker[] = [
  {
    lat: 40.7128,
    lng: -74.006,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "New York",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "London",
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    src: "https://assets.aceternity.com/avatars/3.webp",
    label: "Tokyo",
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    src: "https://assets.aceternity.com/avatars/4.webp",
    label: "Sydney",
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    src: "https://assets.aceternity.com/avatars/5.webp",
    label: "Paris",
  },
  {
    lat: 28.6139,
    lng: 77.209,
    src: "https://assets.aceternity.com/avatars/6.webp",
    label: "New Delhi",
  },
  {
    lat: 55.7558,
    lng: 37.6173,
    src: "https://assets.aceternity.com/avatars/7.webp",
    label: "Moscow",
  },
  {
    lat: -22.9068,
    lng: -43.1729,
    src: "https://assets.aceternity.com/avatars/8.webp",
    label: "Rio de Janeiro",
  },
  {
    lat: 31.2304,
    lng: 121.4737,
    src: "https://assets.aceternity.com/avatars/9.webp",
    label: "Shanghai",
  },
  {
    lat: 25.2048,
    lng: 55.2708,
    src: "https://assets.aceternity.com/avatars/10.webp",
    label: "Dubai",
  },
  {
    lat: -34.6037,
    lng: -58.3816,
    src: "https://assets.aceternity.com/avatars/11.webp",
    label: "Buenos Aires",
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    src: "https://assets.aceternity.com/avatars/12.webp",
    label: "Singapore",
  },
  {
    lat: 37.5665,
    lng: 126.978,
    src: "https://assets.aceternity.com/avatars/13.webp",
    label: "Seoul",
  },
];

function Globe3DDemo() {
  return (
    <Globe3D
      markers={GLOBE_3D_MARKERS}
      config={{
        atmosphereColor: "#4da6ff",
        atmosphereIntensity: 20,
        bumpScale: 5,
        autoRotateSpeed: 0.3,
      }}
      className="h-[420px]"
    />
  );
}

export const examples: Example[] = [
  {
    id: "team",
    title: "Distributed team",
    description:
      "NASA Blue Marble globe with avatar pins, orbit drag, and a slow auto-rotate. Optional peers: three, @react-three/fiber, @react-three/drei.",
    code: `<Globe3D
  markers={markers}
  config={{
    atmosphereColor: "#4da6ff",
    atmosphereIntensity: 20,
    bumpScale: 5,
    autoRotateSpeed: 0.3,
  }}
/>`,
    preview: <Globe3DDemo />,
  },
];

/** Stacked list view for `/components/globe-3d`; loaded on its own by the premium family. */
export default function Globe3dExamples() {
  return <ExampleList examples={examples} />;
}

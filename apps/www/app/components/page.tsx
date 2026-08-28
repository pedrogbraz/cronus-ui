import { Suspense } from "react";
import { ComponentsCatalog } from "../../components/components-catalog";

export default function ComponentsOverview() {
  return (
    <Suspense>
      <ComponentsCatalog />
    </Suspense>
  );
}

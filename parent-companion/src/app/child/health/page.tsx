"use client";

import { RequireRole } from "@/components/RequireRole";
import { ChildTaskPage } from "@/components/ChildTaskPage";

export default function HealthPage() {
  return (
    <RequireRole role="child">
      <ChildTaskPage types={["meal", "supplement", "appointment", "assessment"]} backHref="/child" />
    </RequireRole>
  );
}

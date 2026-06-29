"use client";

import { RequireRole } from "@/components/RequireRole";
import { ChildTaskPage } from "@/components/ChildTaskPage";

export default function StudyPage() {
  return (
    <RequireRole role="child">
      <ChildTaskPage types={["study"]} backHref="/child" />
    </RequireRole>
  );
}

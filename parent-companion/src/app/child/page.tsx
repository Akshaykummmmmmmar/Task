import { RequireRole } from "@/components/RequireRole";
import { ChildDashboard } from "@/components/ChildDashboard";

export default function ChildPage() {
  return (
    <RequireRole role="child">
      <ChildDashboard />
    </RequireRole>
  );
}

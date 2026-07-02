import { CocoAssistant } from "@/components/child/CocoAssistant";

export default function ChildLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CocoAssistant />
    </>
  );
}

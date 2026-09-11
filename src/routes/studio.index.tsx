import { createFileRoute } from "@tanstack/react-router";
import { StudioHome } from "@/components/studio-home";

export const Route = createFileRoute("/studio/")({ component: StudioPage });

function StudioPage() {
  return <StudioHome />;
}

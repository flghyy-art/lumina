import { createFileRoute } from "@tanstack/react-router";
import { StudioEditor } from "@/components/studio-editor";

export const Route = createFileRoute("/studio/$id")({ component: ProjectPage });

function ProjectPage() {
  const { id } = Route.useParams();
  return <StudioEditor id={id} />;
}

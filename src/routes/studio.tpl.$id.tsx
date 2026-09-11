import { createFileRoute } from "@tanstack/react-router";
import { TemplatePreview } from "@/components/template-preview";

export const Route = createFileRoute("/studio/tpl/$id")({
  component: TemplatePage,
});

function TemplatePage() {
  const { id } = Route.useParams();
  return <TemplatePreview id={id} />;
}

import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/cn";

export function Brand({
  compact,
  onPaper,
  className,
}: {
  compact?: boolean;
  onPaper?: boolean;
  className?: string;
}) {
  return (
    <Link
      to="/"
      className={cn("brand", compact && "compact", onPaper && "on-paper", className)}
      aria-label="Lumina 首页"
    >
      <span className="brand-mark">
        <span>▶</span>
      </span>
      <span className="brand-word">Lumina</span>
    </Link>
  );
}

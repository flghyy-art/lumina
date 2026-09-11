import { useSyncExternalStore } from "react";
import { getToasts, subscribeToasts, type Toast } from "@/lib/toast";

const EMPTY: Toast[] = [];

export function ToastHost() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, () => EMPTY);
  if (!toasts.length) return null;
  return (
    <div className="toast-stack" role="status">
      {toasts.map((t) => (
        <div key={t.id} className="toast-pill">
          {t.text}
        </div>
      ))}
    </div>
  );
}

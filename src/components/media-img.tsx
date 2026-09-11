import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { idbKey, isIdbUrl, loadImage } from "@/lib/idb";

export function MediaImg({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [resolved, setResolved] = useState<string | undefined>(
    src && !isIdbUrl(src) ? src : undefined,
  );

  useEffect(() => {
    let live = true;
    if (!src) {
      setResolved(undefined);
      return;
    }
    if (!isIdbUrl(src)) {
      setResolved(src);
      return;
    }
    void loadImage(idbKey(src)).then((v) => {
      if (live) setResolved(v);
    });
    return () => {
      live = false;
    };
  }, [src]);

  if (!resolved) {
    return <div className={cn("bg-line", className)} aria-hidden />;
  }
  return <img src={resolved} alt={alt} className={className} />;
}

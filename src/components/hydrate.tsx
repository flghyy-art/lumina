import { useEffect } from "react";
import { rehydrateStudio } from "@/lib/store";

export function HydrateStudio() {
  useEffect(() => {
    rehydrateStudio();
  }, []);
  return null;
}

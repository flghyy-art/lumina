import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEMO_PROJECTS } from "./demo";
import type { Project } from "./types";

type StudioState = {
  projects: Project[];
  hydrated: boolean;
  imageCount: number;
  nickname: string;
  credits: number;
  markHydrated: () => void;
  setNickname: (name: string) => void;
  createProject: (project: Project) => void;
  updateProject: (
    id: string,
    patch: Partial<Project> | ((project: Project) => Project),
  ) => void;
  deleteProject: (id: string) => void;
  bumpImageCount: () => boolean;
};

const IMAGE_CAP = 8;

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      projects: DEMO_PROJECTS,
      hydrated: false,
      imageCount: 0,
      nickname: "创作者",
      credits: 3280,
      markHydrated: () => set({ hydrated: true }),
      setNickname: (nickname) => set({ nickname }),
      createProject: (project) =>
        set((s) => ({ projects: [project, ...s.projects] })),
      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== id) return p;
            const next =
              typeof patch === "function" ? patch(p) : { ...p, ...patch };
            return { ...next, updatedAt: Date.now() };
          }),
        })),
      deleteProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
      bumpImageCount: () => {
        if (get().imageCount >= IMAGE_CAP) return false;
        set((s) => ({ imageCount: s.imageCount + 1 }));
        return true;
      },
    }),
    {
      name: "lumina-studio-v1",
      skipHydration: true,
      partialize: (s) => ({
        projects: s.projects,
        imageCount: s.imageCount,
        nickname: s.nickname,
        credits: s.credits,
      }),
    },
  ),
);

export function rehydrateStudio() {
  void Promise.resolve(useStudio.persist.rehydrate()).then(() => {
    const s = useStudio.getState();
    if (!s.projects.length) {
      useStudio.setState({ projects: DEMO_PROJECTS });
    }
    s.markHydrated();
  });
}

export const IMAGE_CAP_COUNT = IMAGE_CAP;

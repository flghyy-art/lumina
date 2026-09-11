import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Clapperboard,
  Images,
  LayoutGrid,
  Pause,
  Play,
  Settings2,
  Sparkles,
  Users,
} from "lucide-react";
import { generateStill } from "@/lib/ai";
import { cn } from "@/lib/cn";
import { saveImage } from "@/lib/idb";
import { IMAGE_CAP_COUNT, useStudio } from "@/lib/store";
import { pushToast } from "@/lib/toast";
import {
  ASPECTS,
  STYLES,
  styleById,
  uid,
  type Project,
  type Shot,
  type StudioTab,
} from "@/lib/types";
import { MediaImg } from "@/components/media-img";
import { HydrateStudio } from "@/components/hydrate";

const TABS: { id: StudioTab; label: string; icon: typeof Play }[] = [
  { id: "script", label: "剧本", icon: Clapperboard },
  { id: "assets", label: "资产", icon: Users },
  { id: "board", label: "故事板", icon: LayoutGrid },
  { id: "play", label: "成片", icon: Play },
  { id: "settings", label: "设置", icon: Settings2 },
];

export function StudioEditor({ id }: { id: string }) {
  const hydrated = useStudio((s) => s.hydrated);
  const project = useStudio((s) => s.projects.find((p) => p.id === id));
  const updateProject = useStudio((s) => s.updateProject);
  const bumpImageCount = useStudio((s) => s.bumpImageCount);
  const [tab, setTab] = useState<StudioTab>("board");
  const [shotId, setShotId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (project && !shotId && project.shots[0]) setShotId(project.shots[0].id);
  }, [project, shotId]);

  if (!hydrated) {
    return (
      <div className="grid min-h-dvh place-items-center bg-paper">
        <HydrateStudio />
        <p className="font-extrabold">载入项目…</p>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="grid min-h-dvh place-items-center bg-paper px-6 text-center">
        <HydrateStudio />
        <div>
          <p className="text-2xl font-extrabold">找不到这个项目</p>
          <Link to="/studio" className="mt-4 inline-block font-bold underline">
            返回创作者空间
          </Link>
        </div>
      </div>
    );
  }

  return (
    <EditorBody
      project={project}
      shotId={shotId}
      setShotId={setShotId}
      busyId={busyId}
      setBusyId={setBusyId}
      tab={tab}
      setTab={setTab}
      updateProject={updateProject}
      bumpImageCount={bumpImageCount}
    />
  );
}

function EditorBody({
  project,
  shotId,
  setShotId,
  busyId,
  setBusyId,
  tab,
  setTab,
  updateProject,
  bumpImageCount,
}: {
  project: Project;
  shotId: string | null;
  setShotId: (id: string) => void;
  busyId: string | null;
  setBusyId: (id: string | null) => void;
  tab: StudioTab;
  setTab: (t: StudioTab) => void;
  updateProject: (
    id: string,
    patch: Partial<Project> | ((project: Project) => Project),
  ) => void;
  bumpImageCount: () => boolean;
}) {
  const shot = project.shots.find((s) => s.id === shotId) ?? project.shots[0];

  function patch(next: Partial<Project>) {
    updateProject(project.id, next);
  }

  function patchShot(sid: string, next: Partial<Shot>) {
    updateProject(project.id, (p) => ({
      ...p,
      shots: p.shots.map((s) => (s.id === sid ? { ...s, ...next } : s)),
    }));
  }

  async function genShot(target: Shot) {
    setBusyId(target.id);
    try {
      const result = await generateStill({
        data: { prompt: target.imagePrompt, styleId: project.styleId },
      });
      if (!result.ok) {
        pushToast(result.error);
        return;
      }
      if (!bumpImageCount()) {
        pushToast(`本机最多生成 ${IMAGE_CAP_COUNT} 张图，先预览示范项目。`);
        return;
      }
      const key = uid("img");
      await saveImage(key, result.dataUrl);
      const url = `idb:${key}`;
      updateProject(project.id, (p) => ({
        ...p,
        coverUrl: p.coverUrl ?? url,
        shots: p.shots.map((s) =>
          s.id === target.id ? { ...s, imageUrl: url } : s,
        ),
      }));
      pushToast(`第 ${target.index} 镜画面已生成`);
    } catch {
      pushToast("生图失败，请稍后再试。");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-paper text-ink">
      <HydrateStudio />
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line px-3 sm:px-5">
        <Link
          to="/studio"
          className="grid size-10 place-items-center rounded-full border border-ink"
          aria-label="返回"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="min-w-0 flex-1">
          <input
            value={project.title}
            onChange={(e) => patch({ title: e.target.value })}
            className="w-full bg-transparent text-lg font-extrabold outline-none"
          />
        </div>
        <span className="hidden rounded-full bg-yellow px-3 py-1 text-xs font-bold sm:inline">
          {styleById(project.styleId).name}
        </span>
      </header>

      <div className="flex min-h-0 flex-1">
        <nav className="hidden w-[200px] shrink-0 flex-col gap-1 border-r border-line p-3 sm:flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold",
                tab === t.id ? "bg-yellow" : "hover:bg-white",
              )}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 overflow-y-auto">
          {tab === "script" ? (
            <ScriptPanel project={project} onChange={patch} />
          ) : null}
          {tab === "assets" ? <AssetsPanel project={project} /> : null}
          {tab === "board" && shot ? (
            <BoardPanel
              project={project}
              shot={shot}
              busyId={busyId}
              onSelect={setShotId}
              onPatchShot={patchShot}
              onGenerate={() => void genShot(shot)}
            />
          ) : null}
          {tab === "play" ? <PlayPanel project={project} /> : null}
          {tab === "settings" ? (
            <SettingsPanel project={project} onChange={patch} />
          ) : null}
        </div>
      </div>

      <nav className="flex border-t border-line sm:hidden">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-bold",
              tab === t.id ? "bg-yellow" : "bg-paper",
            )}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function ScriptPanel({
  project,
  onChange,
}: {
  project: Project;
  onChange: (p: Partial<Project>) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <p className="font-display text-[11px] tracking-[2px]">SCRIPT</p>
      <label className="mt-4 block text-sm font-semibold">
        标题
        <input
          value={project.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="mt-1 h-12 w-full rounded-xl border border-ink bg-white px-3 text-lg font-extrabold"
        />
      </label>
      <label className="mt-4 block text-sm font-semibold">
        一句话
        <input
          value={project.logline}
          onChange={(e) => onChange({ logline: e.target.value })}
          className="mt-1 h-12 w-full rounded-xl border border-ink bg-white px-3 font-normal"
        />
      </label>
      <label className="mt-4 block text-sm font-semibold">
        剧本
        <textarea
          value={project.script}
          onChange={(e) => onChange({ script: e.target.value })}
          rows={12}
          className="mt-1 w-full rounded-xl border border-ink bg-white px-3 py-3 font-normal leading-relaxed"
        />
      </label>
    </div>
  );
}

function AssetsPanel({ project }: { project: Project }) {
  const items = [...project.characters, ...project.locations];
  if (!items.length) {
    return (
      <div className="grid h-full place-items-center px-6 text-center text-muted-ink">
        还没有资产。从一句话成片生成后，角色和场景会出现在这里。
      </div>
    );
  }
  return (
    <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((a) => (
        <article
          key={a.id}
          className="overflow-hidden rounded-2xl border border-ink bg-white"
        >
          <div className="aspect-[3/4] bg-line">
            <MediaImg src={a.imageUrl} alt={a.name} className="h-full w-full object-cover" />
          </div>
          <div className="p-4">
            <p className="text-[11px] font-bold tracking-wider text-fog">
              {a.kind === "character" ? "角色" : "场景"}
            </p>
            <h3 className="text-xl font-extrabold">{a.name}</h3>
            <p className="mt-1 text-sm text-muted-ink">{a.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function BoardPanel({
  project,
  shot,
  busyId,
  onSelect,
  onPatchShot,
  onGenerate,
}: {
  project: Project;
  shot: Shot;
  busyId: string | null;
  onSelect: (id: string) => void;
  onPatchShot: (id: string, next: Partial<Shot>) => void;
  onGenerate: () => void;
}) {
  const ratio =
    project.aspect === "9:16"
      ? "aspect-916 max-h-[70dvh]"
      : project.aspect === "2.35"
        ? "aspect-235"
        : "aspect-169";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex gap-3 overflow-x-auto border-b border-line p-3">
        {project.shots.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            className={cn(
              "w-36 shrink-0 overflow-hidden rounded-xl border text-left",
              s.id === shot.id ? "border-ink ring-2 ring-yellow" : "border-line",
            )}
          >
            <div className="aspect-video bg-ink">
              <MediaImg
                src={s.imageUrl}
                alt={`镜 ${s.index}`}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="px-2 py-1 text-xs font-bold">
              {String(s.index).padStart(2, "0")} · {s.shotType}
            </p>
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="grid place-items-center bg-[#161616] p-4">
          <div className={cn("w-full overflow-hidden rounded-xl bg-black", ratio)}>
            {shot.imageUrl ? (
              <MediaImg
                src={shot.imageUrl}
                alt={shot.action}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-white/60">
                这一镜还没有画面
              </div>
            )}
          </div>
        </div>
        <div className="overflow-y-auto border-t border-line p-5 lg:border-t-0 lg:border-l">
          <p className="font-display text-[11px] tracking-[2px]">
            SHOT {String(shot.index).padStart(2, "0")}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field
              label="景别"
              value={shot.shotType}
              onChange={(v) => onPatchShot(shot.id, { shotType: v })}
            />
            <Field
              label="运镜"
              value={shot.camera}
              onChange={(v) => onPatchShot(shot.id, { camera: v })}
            />
          </div>
          <label className="mt-3 block text-sm font-semibold">
            动作
            <textarea
              value={shot.action}
              onChange={(e) => onPatchShot(shot.id, { action: e.target.value })}
              rows={3}
              className="mt-1 w-full rounded-xl border border-ink bg-white px-3 py-2 font-normal"
            />
          </label>
          <label className="mt-3 block text-sm font-semibold">
            对白
            <input
              value={shot.dialogue}
              onChange={(e) => onPatchShot(shot.id, { dialogue: e.target.value })}
              className="mt-1 h-11 w-full rounded-xl border border-ink bg-white px-3 font-normal"
            />
          </label>
          <label className="mt-3 block text-sm font-semibold">
            画面提示词
            <textarea
              value={shot.imagePrompt}
              onChange={(e) =>
                onPatchShot(shot.id, { imagePrompt: e.target.value })
              }
              rows={4}
              className="mt-1 w-full rounded-xl border border-ink bg-white px-3 py-2 font-normal"
            />
          </label>
          <button
            type="button"
            onClick={onGenerate}
            disabled={busyId === shot.id}
            className="btn-primary mt-4 h-12 w-full text-base"
          >
            <Sparkles size={16} />
            {busyId === shot.id ? "生成中…" : "生成这一镜"}
          </button>
          <p className="mt-2 text-xs text-fog">
            生图会消耗额度，每台设备最多 {IMAGE_CAP_COUNT} 张。示范项目已有成片可预览。
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-11 w-full rounded-xl border border-ink bg-white px-3 font-normal"
      />
    </label>
  );
}

function PlayPanel({ project }: { project: Project }) {
  const shots = project.shots;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const shot = shots[index];
  const ratio =
    project.aspect === "9:16"
      ? "aspect-916 max-h-[72dvh]"
      : project.aspect === "2.35"
        ? "aspect-235"
        : "aspect-169";

  const durationMs = useMemo(
    () => (shot ? shot.duration * 1000 : 4000),
    [shot],
  );

  useEffect(() => {
    if (!playing || !shots.length) return;
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % shots.length);
    }, durationMs);
    return () => window.clearTimeout(t);
  }, [playing, index, durationMs, shots.length]);

  if (!shot) {
    return <div className="grid h-full place-items-center">还没有分镜。</div>;
  }

  return (
    <div className="flex h-full flex-col bg-[#111]">
      <div className="grid flex-1 place-items-center p-4">
        <div className={cn("relative w-full max-w-5xl overflow-hidden rounded-xl bg-black", ratio)}>
          {shot.imageUrl ? (
            <MediaImg
              key={shot.id}
              src={shot.imageUrl}
              alt={shot.action}
              className="ken h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-white/50">无画面</div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-white">
            <p className="font-display text-[11px] tracking-[2px] text-yellow">
              {String(shot.index).padStart(2, "0")} / {String(shots.length).padStart(2, "0")} · {shot.shotType}
            </p>
            <p className="mt-1 text-lg font-bold">{shot.action}</p>
            {shot.dialogue ? (
              <p className="mt-2 text-base italic opacity-90">「{shot.dialogue}」</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-white/10 px-4 py-3 text-white">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="grid size-11 place-items-center rounded-full bg-yellow text-ink"
          aria-label={playing ? "暂停" : "播放"}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="flex flex-1 gap-1">
          {shots.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i === index ? "bg-yellow" : "bg-white/20",
              )}
              aria-label={`跳到第 ${s.index} 镜`}
            />
          ))}
        </div>
        <Images size={16} className="opacity-50" />
      </div>
    </div>
  );
}

function SettingsPanel({
  project,
  onChange,
}: {
  project: Project;
  onChange: (p: Partial<Project>) => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-5 py-8">
      <p className="font-display text-[11px] tracking-[2px]">PROJECT SETTINGS</p>
      <h2 className="mt-2 text-3xl font-black">项目设置</h2>
      <p className="mt-4 text-sm font-semibold">画风 SP</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange({ styleId: s.id })}
            className={cn(
              "rounded-full border px-3 py-2 text-sm font-bold",
              project.styleId === s.id ? "border-ink bg-yellow" : "border-line bg-white",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm font-semibold">画幅</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {ASPECTS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onChange({ aspect: a.id })}
            className={cn(
              "rounded-full border px-3 py-2 text-sm font-bold",
              project.aspect === a.id ? "border-ink bg-yellow" : "border-line bg-white",
            )}
          >
            {a.name}
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-ink">
        当前类型：{project.genre} · 工作流：
        {project.workflow === "novel"
          ? "小说改编"
          : project.workflow === "image"
            ? "图生分镜"
            : "一句话成片"}
      </p>
    </div>
  );
}

import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";
import { HydrateStudio } from "@/components/hydrate";
import { useStudio } from "@/lib/store";
import {
  buildRemix,
  templateById,
  templateSource,
} from "@/lib/templates";
import { styleById } from "@/lib/types";
import { pushToast } from "@/lib/toast";

export function TemplatePreview({ id }: { id: string }) {
  const navigate = useNavigate();
  const createProject = useStudio((s) => s.createProject);
  const template = templateById(id);
  const source = template ? templateSource(template.sourceId) : undefined;

  const [title, setTitle] = useState(template ? `${template.title}（跟拍）` : "");
  const [names, setNames] = useState<Record<string, string>>(() => {
    const next: Record<string, string> = {};
    for (const c of source?.characters ?? []) next[c.id] = c.name;
    return next;
  });
  const [dialogues, setDialogues] = useState<Record<string, string>>(() => {
    const next: Record<string, string> = {};
    for (const s of source?.shots ?? []) next[s.id] = s.dialogue;
    return next;
  });

  const shots = source?.shots ?? [];
  const styleName = source ? styleById(source.styleId).name : "";

  const ready = useMemo(() => !!template && !!source, [template, source]);

  function remix() {
    if (!template || !source) return;
    const project = buildRemix(source, template, { title, names, dialogues });
    createProject(project);
    pushToast("已跟拍到大师工坊，可改分镜和画面");
    void navigate({ to: "/studio/$id", params: { id: project.id } });
  }

  if (!template) {
    return (
      <div className="grid min-h-dvh place-items-center bg-mist px-6 text-center text-char">
        <HydrateStudio />
        <div>
          <p className="text-2xl font-extrabold">找不到这个模板</p>
          <Link to="/studio" className="mt-4 inline-block font-bold underline">
            返回工作空间
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-mist text-char">
      <HydrateStudio />
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-hair bg-snow px-3 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/studio"
            className="grid size-10 place-items-center rounded-full border border-soft"
            aria-label="返回工作空间"
          >
            <ArrowLeft size={16} />
          </Link>
          <Brand compact onPaper />
        </div>
        <p className="hidden text-sm text-fog md:block">跟拍同款 · Clip Remix</p>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 p-3 pb-28 md:p-6">
        <section className="overflow-hidden rounded-2xl bg-snow shadow-[0_1px_2px_rgba(0,0,0,0.08)] md:grid md:grid-cols-[1.2fr_0.8fr]">
          <div className="relative aspect-video bg-night md:aspect-auto md:min-h-[320px]">
            <img
              src={template.cover}
              alt={template.title}
              className="h-full w-full object-cover"
            />
            <span className="ws-uses">{template.uses}次</span>
          </div>
          <div className="flex flex-col justify-center p-5 md:p-7">
            <p className="text-xs font-bold tracking-wide text-hub">CLIP REMIX</p>
            <h1 className="mt-2 text-3xl font-black">{template.title}</h1>
            <p className="mt-2 text-sm text-muted-ink">{source?.logline}</p>
            <p className="mt-3 text-sm text-fog">
              {template.genre} · 上手难度{template.difficulty}
              {source ? ` · ${styleName} · ${shots.length} 镜` : ""}
            </p>
            <div className="mt-5 hidden gap-2 md:flex">
              {source ? (
                <Link
                  to="/studio/$id"
                  params={{ id: source.id }}
                  className="flex h-11 flex-1 items-center justify-center rounded-xl bg-mist text-sm font-bold"
                >
                  打开示范
                </Link>
              ) : null}
              <button
                type="button"
                className="flex h-11 flex-1 items-center justify-center rounded-xl bg-gold text-sm font-bold"
                onClick={remix}
                disabled={!ready}
              >
                跟拍同款
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-snow p-5">
          <h2 className="text-lg font-black">编辑人物 / 台词</h2>
          <p className="mt-1 text-sm text-muted-ink">
            不用写提示词。改名字和对白后跟拍，分镜和画面会带到你的项目里。
          </p>
          <label className="mt-4 block text-sm font-semibold">
            项目名称
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-soft bg-snow px-3 font-normal"
            />
          </label>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(source?.characters ?? []).map((c) => (
              <label key={c.id} className="flex items-center gap-3 rounded-xl bg-mist p-3">
                {c.imageUrl ? (
                  <img
                    src={c.imageUrl}
                    alt=""
                    className="size-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="size-12 rounded-full bg-soft" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] text-fog">
                    {c.kind === "character" ? "角色" : "场景"}
                  </span>
                  <input
                    value={names[c.id] ?? c.name}
                    onChange={(e) =>
                      setNames((prev) => ({ ...prev, [c.id]: e.target.value }))
                    }
                    className="h-9 w-full bg-transparent font-bold outline-none"
                    aria-label={`角色 ${c.name}`}
                  />
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-snow p-5">
          <h2 className="text-lg font-black">分镜预览</h2>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {shots.map((s) => (
              <figure key={s.id} className="w-40 shrink-0">
                <div className="aspect-video overflow-hidden rounded-lg bg-night">
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <figcaption className="mt-1 text-[11px] text-fog">
                  {String(s.index).padStart(2, "0")} · {s.shotType}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {shots.map((s) => (
              <label key={`d-${s.id}`} className="block text-sm">
                <span className="font-semibold">
                  {String(s.index).padStart(2, "0")} {s.action}
                </span>
                <input
                  value={dialogues[s.id] ?? ""}
                  onChange={(e) =>
                    setDialogues((prev) => ({ ...prev, [s.id]: e.target.value }))
                  }
                  placeholder="对白（可空）"
                  className="mt-1 h-11 w-full rounded-xl border border-soft bg-mist px-3"
                />
              </label>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-hair bg-snow/95 px-3 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden">
        <button
          type="button"
          className="h-12 w-full rounded-xl bg-gold font-bold"
          onClick={remix}
          disabled={!ready}
        >
          跟拍同款
        </button>
      </div>
    </div>
  );
}

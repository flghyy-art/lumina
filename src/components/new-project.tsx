import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { generateStoryboard } from "@/lib/ai";
import { useStudio } from "@/lib/store";
import { pushToast } from "@/lib/toast";
import {
  ASPECTS,
  STYLES,
  WORKFLOWS,
  uid,
  type Aspect,
  type Workflow,
} from "@/lib/types";
import { cn } from "@/lib/cn";

export function NewProjectDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const createProject = useStudio((s) => s.createProject);
  const [idea, setIdea] = useState("");
  const [workflow, setWorkflow] = useState<Workflow>("one-liner");
  const [styleId, setStyleId] = useState("cinema");
  const [aspect, setAspect] = useState<Aspect>("16:9");
  const [shotCount, setShotCount] = useState(6);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!idea.trim()) {
      setError("先写下一句话。");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await generateStoryboard({
        data: { idea, shotCount, styleId, workflow, aspect },
      });
      if (!result.ok) {
        setError(result.error);
        setBusy(false);
        return;
      }
      const id = uid("prj");
      const now = Date.now();
      createProject({
        ...result.project,
        id,
        createdAt: now,
        updatedAt: now,
      });
      pushToast("项目已生成，进入故事板。");
      onClose();
      void navigate({ to: "/studio/$id", params: { id } });
    } catch {
      setError("生成失败，请再试一次。");
      setBusy(false);
    }
  }

  return (
    <div className="modal-scrim" onClick={onClose} role="presentation">
      <div
        className="modal-card max-h-[90dvh] overflow-y-auto"
        role="dialog"
        aria-labelledby="new-title"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="font-display text-[11px] tracking-[2px]">MASTER STUDIO</p>
            <h2 id="new-title" className="mt-1 text-2xl font-extrabold">
              新建项目
            </h2>
            <p className="mt-1 text-sm text-muted-ink">专业工作流，生成原创大片</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full border border-ink"
            aria-label="关闭"
          >
            <X size={16} />
          </button>
        </div>

        {busy ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="h-2 w-full overflow-hidden rounded-full bg-line">
              <i className="block h-full w-2/3 rounded-full bg-yellow" style={{ animation: "ken 1.6s ease-in-out infinite alternate" }} />
            </div>
            <p className="font-extrabold">正在拆分镜、提炼角色…</p>
            <p className="text-sm text-muted-ink">导演在草稿纸上画第一格。</p>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={(e) => void onSubmit(e)}>
            <div className="flex flex-wrap gap-2">
              {WORKFLOWS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWorkflow(w.id)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm font-bold",
                    workflow === w.id
                      ? "border-ink bg-yellow"
                      : "border-line bg-white",
                  )}
                >
                  {w.name}
                </button>
              ))}
            </div>
            <label className="text-sm font-semibold">
              {workflow === "novel" ? "贴上小说或剧本" : "你的一句话"}
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={workflow === "novel" ? 7 : 4}
                placeholder={
                  workflow === "novel"
                    ? "把故事贴进来，尽量有场景和动作。"
                    : "例：一个女孩在雨夜的东京街头寻找失踪的猫，6 个分镜"
                }
                className="mt-1 w-full rounded-xl border border-ink bg-white px-3 py-2 font-normal leading-relaxed"
              />
            </label>
            <div>
              <p className="mb-2 text-sm font-semibold">画风</p>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyleId(s.id)}
                    className={cn(
                      "rounded-full border px-3 py-2 text-sm font-bold",
                      styleId === s.id
                        ? "border-ink bg-yellow"
                        : "border-line bg-white",
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold">
                分镜数
                <select
                  value={shotCount}
                  onChange={(e) => setShotCount(Number(e.target.value))}
                  className="mt-1 h-11 w-full rounded-xl border border-ink bg-white px-3 font-normal"
                >
                  {[4, 6, 8, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} 镜
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                画幅
                <select
                  value={aspect}
                  onChange={(e) => setAspect(e.target.value as Aspect)}
                  className="mt-1 h-11 w-full rounded-xl border border-ink bg-white px-3 font-normal"
                >
                  {ASPECTS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
            <button type="submit" className="btn-primary mt-1 h-14 text-base">
              <span className="btn-play">▶</span>
              生成项目
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

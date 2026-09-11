import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Clapperboard,
  Coins,
  Home,
  LayoutGrid,
  Library,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { HydrateStudio } from "@/components/hydrate";
import { MediaImg } from "@/components/media-img";
import { NewProjectDialog } from "@/components/new-project";
import { cn } from "@/lib/cn";
import { useStudio } from "@/lib/store";
import { TEMPLATES } from "@/lib/templates";
import { type Project } from "@/lib/types";
import { pushToast } from "@/lib/toast";

type WsView = "home" | "assets" | "master" | "templates" | "learn" | "me";

const NAV_MAIN: { id: WsView; label: string; icon: typeof Home; fresh?: boolean }[] = [
  { id: "home", label: "主页", icon: Home },
  { id: "assets", label: "资产库", icon: Library },
  { id: "master", label: "大师工坊", icon: Clapperboard },
  { id: "templates", label: "模板示例", icon: LayoutGrid, fresh: true },
  { id: "learn", label: "新手教学", icon: BookOpen, fresh: true },
];

const NAV_MORE: { id: WsView; label: string; icon: typeof Home }[] = [
  { id: "me", label: "我的", icon: UserRound },
];

const BANNERS = [
  { src: "/media/s-alley.jpg", title: "雨夜寻猫", kicker: "都市剧情 · 示范短片", projectId: "demo-rain" },
  { src: "/media/s-teahouse.jpg", title: "山间一盏茶", kicker: "古风散文 · 示范短片", projectId: "demo-tea" },
  { src: "/media/s-planet.jpg", title: "最后一封星邮", kicker: "科幻宽幕 · 示范短片", projectId: "demo-star" },
];

const ENTRIES = [
  { id: "one-liner", title: "一句话成片", hint: "谁、在哪、做什么", cover: "/media/s-rooftop.jpg", go: "create" as const },
  { id: "novel", title: "小说改编", hint: "贴剧本，拆分镜", cover: "/media/s-path.jpg", go: "create" as const },
  { id: "remix", title: "跟拍同款", hint: "选模板换图就能直接出结果", cover: "/media/s-corridor.jpg", go: "templates" as const },
];

const TUTORIALS = [
  { id: "t1", title: "一句话成片", cover: "/media/s-alley.jpg", body: "在新建项目里写下谁、在哪、做什么。工坊会拆成剧本、角色资产和分镜提示词。先打开示范短片走一遍，再写自己的句子。" },
  { id: "t2", title: "资产要先立住", cover: "/media/p-rain.jpg", body: "人物、场景进资产库之后，每一镜才认得出同一个人。资产提炼可以按剧本自动列出角色和地点，再生成形象。" },
  { id: "t3", title: "故事板出片", cover: "/media/s-rooftop.jpg", body: "选画风、画幅和分镜数。按镜出图，成片页按顺序播放。推荐先 6 镜跑通，再加密度。" },
];

function isDone(p: Project) {
  return p.shots.length > 0 && p.shots.every((s) => !!s.imageUrl);
}
function formatWhen(ts: number) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function StudioHome() {
  const projects = useStudio((s) => s.projects);
  const nickname = useStudio((s) => s.nickname);
  const credits = useStudio((s) => s.credits);
  const deleteProject = useStudio((s) => s.deleteProject);
  const setNickname = useStudio((s) => s.setNickname);
  const [view, setView] = useState<WsView>("home");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "doing" | "done">("all");
  const [invite, setInvite] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);
  const filtered = useMemo(() => {
    const q = query.trim();
    return projects.filter((p) => {
      if (filter === "doing" && isDone(p)) return false;
      if (filter === "done" && !isDone(p)) return false;
      if (!q) return true;
      return p.title.includes(q) || p.logline.includes(q) || nickname.includes(q);
    });
  }, [projects, query, filter, nickname]);
  const assets = useMemo(
    () => projects.flatMap((p) => [...p.characters, ...p.locations].map((a) => ({ ...a, project: p.title }))),
    [projects],
  );
  function activateInvite() {
    if (!invite.trim()) { pushToast("请输入邀请码"); return; }
    pushToast("创作者空间已开启");
    setInvite("");
  }
  return (
    <div className="flex h-dvh bg-mist text-char">
      <HydrateStudio />
      <aside className="ws-aside hidden shrink-0 flex-col md:flex">
        <div className="px-4 py-4"><Brand compact onPaper /></div>
        <button type="button" className="ws-usercard" onClick={() => setView("me")}>
          <img src="/media/p-copper.jpg" alt="" className="size-10 rounded-full object-cover" />
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-medium">{nickname}</p>
            <p className="text-xs text-char">个人空间</p>
          </div>
          <ChevronRight size={12} className="ml-auto shrink-0 opacity-50" />
        </button>
        <nav className="flex flex-1 flex-col">
          {NAV_MAIN.map((n) => (
            <button key={n.id} type="button" onClick={() => setView(n.id)} className={cn("ws-navbtn", view === n.id && "is-on")}>
              <n.icon size={16} />{n.label}{n.fresh ? <span className="ws-new">NEW</span> : null}
            </button>
          ))}
          <div className="mx-auto my-3 h-px w-[200px] bg-soft" />
          {NAV_MORE.map((n) => (
            <button key={n.id} type="button" onClick={() => setView(n.id)} className={cn("ws-navbtn", view === n.id && "is-on")}>
              <n.icon size={16} />{n.label}
            </button>
          ))}
          <button type="button" className="ws-navbtn" onClick={() => pushToast("请联系平台管理员或业务对接人获取客服支持。")}>
            <MessageCircle size={16} />联系客服
          </button>
        </nav>
        <div className="p-3">
          <div className="ws-invite">
            <p className="ws-invite-label">邀请码入口</p>
            <div className="ws-invite-form">
              <input value={invite} onChange={(e) => setInvite(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") activateInvite(); }} placeholder="请输入邀请码" maxLength={32} />
              <button type="button" className="px-2 text-sm font-bold" onClick={activateInvite}>激活</button>
            </div>
          </div>
          <div className="mx-auto mb-2 flex w-[208px] items-center justify-between">
            <span className="ws-points"><Coins size={14} />剩余积分</span>
            <span className="text-xs font-bold tabular-nums">{credits}</span>
          </div>
          <Link to="/" className="mt-1 block text-center text-xs text-fog">返回官网</Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between bg-transparent px-3 md:px-5">
          <div className="flex items-center gap-2 md:hidden"><Brand compact onPaper /></div>
          <p className="hidden text-sm text-fog md:block">工作空间 · 个人空间</p>
          <div className="flex items-center gap-2">
            <button type="button" className="ws-lang hidden sm:inline" onClick={() => pushToast("目前为中文")}>中文</button>
            <span className="ws-points tabular-nums">{credits} 积分</span>
            <button type="button" className="ws-top-recharge" onClick={() => setPayOpen(true)}>充值</button>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto p-3 pb-24 md:p-4 md:pb-8">
          {view === "home" ? <Discovery projects={projects} nickname={nickname} onCreate={() => setOpen(true)} onSeeAll={() => setView("master")} onLearn={() => setView("learn")} onTemplates={() => setView("templates")} /> : null}
          {view === "master" ? <MasterStudio projects={filtered} query={query} filter={filter} nickname={nickname} onQuery={setQuery} onFilter={setFilter} onCreate={() => setOpen(true)} onDelete={(p) => setPendingDelete(p)} /> : null}
          {view === "assets" ? <AssetLibrary items={assets} /> : null}
          {view === "templates" ? <TemplateGrid /> : null}
          {view === "learn" ? <LearnGrid /> : null}
          {view === "me" ? <Profile nickname={nickname} credits={credits} onRename={setNickname} onPay={() => setPayOpen(true)} /> : null}
        </main>
      </div>
      <nav className="ws-bottom md:hidden">
        <button type="button" onClick={() => setView("home")} className={cn(view === "home" && "is-on")}><Home size={18} />首页</button>
        <button type="button" onClick={() => setCreateOpen((v) => !v)} className="ws-bottom-create"><span><Plus size={18} /></span>创作</button>
        <button type="button" onClick={() => setView("me")} className={cn(view === "me" && "is-on")}><UserRound size={18} />我的</button>
      </nav>
      {createOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button type="button" className="absolute inset-0 bg-night/20" aria-label="关闭" onClick={() => setCreateOpen(false)} />
          <div className="ws-menu-sheet">
            <button type="button" onClick={() => { setCreateOpen(false); setOpen(true); }}>新建项目</button>
            <button type="button" className="bg-mist" onClick={() => { setCreateOpen(false); setView("master"); }}>大师工坊</button>
            <button type="button" className="bg-mist" onClick={() => { setCreateOpen(false); setView("templates"); }}>小白片场</button>
          </div>
        </div>
      ) : null}
      {open ? <NewProjectDialog onClose={() => setOpen(false)} /> : null}
      {payOpen ? <PayDialog onClose={() => setPayOpen(false)} /> : null}
      {pendingDelete ? (
        <ConfirmDialog title={`确定删除项目“${pendingDelete.title}”吗？`} onCancel={() => setPendingDelete(null)} onOk={() => { deleteProject(pendingDelete.id); pushToast(`已删除「${pendingDelete.title}」`); setPendingDelete(null); }} />
      ) : null}
    </div>
  );
}

function Discovery({ projects, nickname, onCreate, onSeeAll, onLearn, onTemplates }: { projects: Project[]; nickname: string; onCreate: () => void; onSeeAll: () => void; onLearn: () => void; onTemplates: () => void; }) {
  const [slide, setSlide] = useState(0);
  useEffect(() => { const id = window.setInterval(() => { setSlide((s) => (s + 1) % BANNERS.length); }, 4200); return () => window.clearInterval(id); }, []);
  const banner = BANNERS[slide] ?? BANNERS[0]!;
  return (
    <div className="mx-auto flex max-w-6xl flex-col">
      <Link to="/studio/$id" params={{ id: banner.projectId }} className="ws-banner">
        <img src={banner.src} alt="" />
        <div className="ws-banner-overlay">
          <p className="font-display text-[11px] tracking-[2px] text-gold">YOUR STORY, YOUR WORLD</p>
          <h1 className="mt-1 text-3xl font-black sm:text-4xl">{banner.title}</h1>
          <p className="mt-1 text-sm text-snow/80">{banner.kicker}</p>
        </div>
      </Link>
      <div className="ws-dots">
        {BANNERS.map((b, i) => (<button key={b.projectId + i} type="button" className={cn("ws-dot", i === slide && "is-on")} aria-label={b.title} onClick={() => setSlide(i)} />))}
      </div>
      <div className="ws-entries">
        {ENTRIES.map((e) => (
          <button key={e.id} type="button" className="ws-entry" onClick={() => (e.go === "create" ? onCreate() : onTemplates())}>
            <img src={e.cover} alt="" />
            <div className="ws-entry-copy text-left"><p className="text-lg font-bold">{e.title}</p><p className="text-sm text-snow/80">{e.hint}</p></div>
          </button>
        ))}
      </div>
      <section className="ws-sec ws-sec-hub">
        <div className="ws-sec-head"><div className="ws-sec-title"><h2>小白片场 <em>Newbie Hub</em></h2><p>适合零基础小白：不用写提示词，选模板换图就能直接出结果</p></div><button type="button" className="ws-sec-btn" onClick={onTemplates}>查看所有模板</button></div>
        <div className="ws-hscroll">{TEMPLATES.map((t) => (<Link key={t.id} to="/studio/tpl/$id" params={{ id: t.id }} className="ws-tpl"><img src={t.cover} alt={t.title} /><span className="ws-uses">{t.uses}次</span><div className="ws-tpl-meta"><p className="truncate text-sm font-semibold">{t.title}</p></div></Link>))}</div>
      </section>
      <section className="ws-sec ws-sec-master">
        <div className="ws-sec-head"><div className="ws-sec-title"><h2>大师工坊 <em>Master Studio</em></h2><p>适合AI创作经验用户：专业全栈工作流，智能体辅助推理提示词</p></div><button type="button" className="ws-sec-btn" onClick={onSeeAll}>查看所有项目</button></div>
        <div className="ws-hscroll"><button type="button" onClick={onCreate} className="ws-create"><span className="ws-create-plus"><Sparkles size={18} /></span><span className="text-sm font-bold">专业工作流</span><span className="text-sm text-fog">生成原创大片</span></button>{projects.slice(0, 6).map((p) => (<ProjectCard key={p.id} project={p} author={nickname} />))}</div>
      </section>
      <section className="ws-sec ws-sec-learn">
        <div className="ws-sec-head"><div className="ws-sec-title"><h2>新手教学 <em>Newbie Tutorials</em></h2><p>适合零基础小白：新手教学视频，轻松快速上手</p></div><button type="button" className="ws-sec-btn" onClick={onLearn}>查看所有教学</button></div>
        <div className="ws-hscroll">{TUTORIALS.map((t) => (<article key={t.id} className="ws-learn-card"><img src={t.cover} alt="" /><span>{t.title}</span></article>))}</div>
      </section>
    </div>
  );
}

function MasterStudio({ projects, query, filter, nickname, onQuery, onFilter, onCreate, onDelete }: { projects: Project[]; query: string; filter: "all" | "doing" | "done"; nickname: string; onQuery: (v: string) => void; onFilter: (v: "all" | "doing" | "done") => void; onCreate: () => void; onDelete: (p: Project) => void; }) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="ws-page-title"><h1>大师工坊 <em>Master Studio</em></h1><p>适合AI创作经验用户：专业全栈工作流，智能体辅助推理提示词</p></div>
        <button type="button" onClick={onCreate} className="flex h-11 items-center gap-2 rounded-lg bg-sun px-4 text-sm font-medium text-char"><Plus size={16} />新建项目</button>
      </div>
      <div className="ws-filter">
        {([["all", "全部"],["doing", "进行中"],["done", "已完成"]] as const).map(([id, label]) => (<button key={id} type="button" onClick={() => onFilter(id)} className={cn("ws-chipbtn", filter === id && "is-on")}>{label}</button>))}
        <label className="ws-search"><Search size={14} className="text-fog" /><input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="搜索项目名称或作者" aria-label="搜索项目名称或作者" /></label>
      </div>
      {projects.length === 0 ? <p className="mt-16 text-center text-fog">暂无匹配项目</p> : (
        <div className="mt-2 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <button type="button" onClick={onCreate} className="ws-create ws-create-tile"><span className="ws-create-plus"><Plus size={18} /></span><span className="font-bold">专业工作流</span><span className="text-sm text-fog">生成原创大片</span></button>
          {projects.map((p) => (<div key={p.id} className="relative"><ProjectCard project={p} author={nickname} tall />{!p.id.startsWith("demo-") ? <button type="button" className="absolute top-3 right-3 z-10 grid size-8 place-items-center rounded-full bg-snow/90" aria-label={`删除 ${p.title}`} onClick={() => onDelete(p)}><Trash2 size={14} /></button> : null}</div>))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, author, tall }: { project: Project; author: string; tall?: boolean; }) {
  return (
    <Link to="/studio/$id" params={{ id: project.id }} className={cn("ws-pcard", tall ? "" : "w-[200px] shrink-0")}>
      <div className={cn("ws-pcard-cover", tall ? "aspect-[4/5]" : "h-[148px]")}>
        <MediaImg src={project.coverUrl ?? project.shots.find((s) => s.imageUrl)?.imageUrl} alt={project.title} className="h-full w-full object-cover" />
        <div className="ws-chip"><img src="/media/p-copper.jpg" alt="" className="mr-1 size-5 rounded-full object-cover" /><span className="truncate">{author}</span></div>
      </div>
      <span className="ws-pcard-name">{project.title}</span>
      <span className="ws-pcard-meta">{project.shots.length}集 · 更新于{formatWhen(project.updatedAt)}</span>
    </Link>
  );
}

function AssetLibrary({ items }: { items: { id: string; name: string; description: string; kind: string; imageUrl?: string; project: string; }[]; }) {
  const [q, setQ] = useState("");
  const shown = items.filter((a) => !q.trim() || a.name.includes(q.trim()));
  return (
    <div className="mx-auto max-w-6xl">
      <div className="ws-page-title" style={{ borderLeftColor: "var(--color-char)" }}><h1 className="text-char">资产库</h1><p>项目里的角色、场景与道具，都会汇总到这里。</p></div>
      <label className="ws-search mt-4 ml-0"><Search size={14} className="text-fog" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索资源名称" /></label>
      {shown.length === 0 ? <p className="mt-20 text-center text-fog">暂无匹配资源</p> : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {shown.map((a) => (<article key={a.id} className="overflow-hidden rounded-xl bg-snow"><div className="aspect-[3/4] bg-mist"><MediaImg src={a.imageUrl} alt={a.name} className="h-full w-full object-cover" /></div><div className="p-3"><p className="text-[11px] text-fog">{a.kind === "character" ? "角色" : "场景"} · {a.project}</p><p className="font-bold">{a.name}</p></div></article>))}
        </div>
      )}
    </div>
  );
}

function TemplateGrid() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="ws-page-title" style={{ borderLeftColor: "var(--color-hub)", color: "var(--color-hub)" }}><h1>跟拍同款 <em>Clip Remix</em></h1><p>适合轻度使用者：从模板开始，编辑人物/台词/提示词，快速跟拍</p></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {TEMPLATES.map((t) => (
          <article key={t.id} className="overflow-hidden rounded-xl bg-snow">
            <Link to="/studio/tpl/$id" params={{ id: t.id }} className="relative block"><img src={t.cover} alt={t.title} className="aspect-video w-full object-cover" /><span className="ws-uses">{t.uses}次</span></Link>
            <div className="p-4">
              <p className="font-bold">{t.title}</p><p className="text-sm text-fog">{t.hint}</p>
              <div className="mt-3 flex gap-2">
                <Link to="/studio/$id" params={{ id: t.sourceId }} className="flex h-9 flex-1 items-center justify-center rounded-lg bg-mist text-sm font-bold">打开示范</Link>
                <Link to="/studio/tpl/$id" params={{ id: t.id }} className="flex h-9 flex-1 items-center justify-center rounded-lg bg-gold text-sm font-bold">跟拍同款</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function LearnGrid() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="ws-page-title" style={{ borderLeftColor: "var(--color-sky)", color: "var(--color-sky)" }}><h1>新手教学 <em>Newbie Tutorials</em></h1><p>适合零基础小白：新手教学视频，轻松快速上手</p></div>
      <div className="mt-6 flex flex-col gap-4">
        {TUTORIALS.map((t, i) => (<article key={t.id} className="overflow-hidden rounded-2xl bg-snow md:flex"><img src={t.cover} alt="" className="h-40 w-full object-cover md:h-auto md:w-48" /><div className="p-5"><p className="text-xs font-bold text-fog">0{i + 1}</p><h2 className="text-xl font-black text-char">{t.title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-ink">{t.body}</p></div></article>))}
      </div>
    </div>
  );
}

function Profile({ nickname, credits, onRename, onPay }: { nickname: string; credits: number; onRename: (n: string) => void; onPay: () => void; }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(nickname);
  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-2xl bg-snow p-5">
        <div className="flex items-center gap-3"><img src="/media/p-copper.jpg" alt="" className="size-14 rounded-full object-cover" /><div><p className="text-lg font-bold">{nickname}</p><p className="text-sm text-fog">个人空间</p></div></div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-cream px-4 py-3"><span className="text-sm">剩余积分</span><span className="font-bold tabular-nums">{credits}</span></div>
        <button type="button" className="ws-row mt-2" onClick={onPay}><span>充值</span><ChevronRight size={14} className="text-fog" /></button>
        <button type="button" className="ws-row" onClick={() => setEditing((v) => !v)}><span>修改昵称</span><ChevronRight size={14} className="text-fog" /></button>
        {editing ? (<div className="py-3"><label className="block text-sm font-semibold">昵称<input value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入昵称" className="mt-1 h-11 w-full rounded-xl border border-soft bg-snow px-3 font-normal" /></label><button type="button" className="mt-3 h-11 w-full rounded-xl bg-gold font-bold" onClick={() => { const next = name.trim().slice(0, 16); if (next.length < 2) { pushToast("昵称请用 2–16 个字"); return; } onRename(next); setEditing(false); pushToast("已更新"); }}>保存</button></div>) : null}
        <button type="button" className="ws-row" onClick={() => pushToast("目前为中文")}><span>语言</span><span className="text-fog">中文</span></button>
        <button type="button" className="ws-row" onClick={() => pushToast("请联系平台管理员或业务对接人获取客服支持。")}><span>联系客服</span><ChevronRight size={14} className="text-fog" /></button>
        <div className="ws-row"><span>版本信息</span><span className="text-fog">当前版本：2026.9</span></div>
        <button type="button" className="ws-row" onClick={() => pushToast("本地工作区，无需登录")}><span>退出登录</span><ChevronRight size={14} className="text-fog" /></button>
        <p className="mt-4 text-xs text-fog">本地工作区，无需登录。积分仅作演示。</p>
      </div>
    </div>
  );
}

function PayDialog({ onClose }: { onClose: () => void }) {
  const packs = [{ n: 680, name: "体验包" }, { n: 1980, name: "创作包" }, { n: 3280, name: "工作室" }];
  return (
    <div className="modal-scrim" onClick={onClose} role="presentation">
      <div className="modal-card" role="dialog" aria-labelledby="pay-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="pay-title" className="text-2xl font-extrabold">充值</h2>
        <p className="mt-1 text-sm text-muted-ink">个人空间 · 剩余积分仅作演示</p>
        <div className="mt-4 grid gap-2">{packs.map((p) => (<button key={p.n} type="button" className="flex h-14 items-center justify-between rounded-xl bg-cream px-4 font-bold" onClick={() => { pushToast("演示工作区无需充值"); onClose(); }}><span>{p.name}</span><span className="tabular-nums">{p.n} 积分</span></button>))}</div>
        <p className="mt-4 text-xs leading-relaxed text-fog">温馨提示：积分充值不可提现；演示空间不会产生真实扣费。</p>
      </div>
    </div>
  );
}

function ConfirmDialog({ title, onCancel, onOk }: { title: string; onCancel: () => void; onOk: () => void; }) {
  return (
    <div className="modal-scrim" onClick={onCancel} role="presentation">
      <div className="modal-card max-w-sm" role="dialog" onClick={(e) => e.stopPropagation()}>
        <p className="text-lg font-bold">{title}</p>
        <div className="mt-5 flex gap-2">
          <button type="button" className="h-11 flex-1 rounded-xl bg-mist font-bold" onClick={onCancel}>取消</button>
          <button type="button" className="h-11 flex-1 rounded-xl bg-gold font-bold" onClick={onOk}>确定</button>
        </div>
      </div>
    </div>
  );
}

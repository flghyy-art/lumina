import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Handshake, X } from "lucide-react";
import { Brand } from "@/components/brand";
import { pushToast } from "@/lib/toast";

const MOSAIC = [
  { src: "/media/p-rain.jpg", alt: "雨夜角色" },
  { src: "/media/p-3d.jpg", alt: "三维角色" },
  { src: "/media/p-anime.jpg", alt: "动画角色" },
  { src: "/media/p-qipao.jpg", alt: "电影角色" },
  { src: "/media/p-cyber.jpg", alt: "赛博角色" },
  { src: "/media/p-copper.jpg", alt: "时尚角色" },
  { src: "/media/p-ink.jpg", alt: "水墨角色" },
  { src: "/media/p-pixar.jpg", alt: "卡通角色" },
  { src: "/media/p-man.jpg", alt: "剧情角色" },
];

const FEATURES = [
  { tone: "lp-yellow", no: "01", title: "一句话成片", body: "写下谁、在哪、做什么。Lumina 拆成剧本、角色与分镜，不再从空白画布开始。" },
  { tone: "lp-purple", no: "02", title: "角色资产", body: "人物、场景、道具进资产库。每一镜都认得出同一个人，短片才像一部电影。" },
  { tone: "lp-blue", no: "03", title: "电影故事板", body: "景别、运镜、对白、画面提示词，一镜一张卡片。改提示词，立刻重生画面。" },
  { tone: "lp-pink", no: "04", title: "自由画风", body: "电影拍摄、日系动画、赛博都市、古风水墨。换一个风格预设，整部片子换气质。" },
];

export function LandingPage() {
  const [contact, setContact] = useState(false);
  return (
    <main>
      <section className="lp-hero">
        <nav className="lp-nav reveal">
          <Brand />
          <div className="lp-nav-links">
            <Link to="/studio">创作工具</Link>
            <a href="#features">能力</a>
            <a href="#closing">开始</a>
          </div>
        </nav>
        <div className="lp-grid">
          <div className="lp-copy reveal d1">
            <div className="lp-eyebrow">
              <span /> YOUR STORY, YOUR WORLD
            </div>
            <h1>
              释放无限
              <br />
              <em>创意</em>
              <i>✦</i>
            </h1>
            <p className="lp-subline">享受自由创作体验</p>
            <p className="lp-intro">
              无需复杂工具，只要一句想法。让 AI 陪你把脑海里的画面、角色与故事，变成真正可分享的作品。
            </p>
            <div className="lp-actions">
              <Link to="/studio" className="btn-primary">
                <span className="btn-play">▶</span>
                开始创作
                <ArrowUpRight size={18} strokeWidth={2.4} />
              </Link>
              <button type="button" className="btn-secondary" onClick={() => setContact(true)}>
                <Handshake size={18} strokeWidth={2.2} />
                商务合作
              </button>
            </div>
            <div className="lp-trust">
              <span className="lp-avatars">●●●</span>
              <strong>12,000+</strong>
              创作者正在生成灵感
            </div>
          </div>
          <div className="lp-visual reveal d2" id="studio">
            <div className="lp-mosaic">
              {MOSAIC.map((m) => (
                <figure key={m.src}>
                  <img src={m.src} alt={m.alt} />
                </figure>
              ))}
            </div>
            <Link to="/studio" className="lp-play-fab" aria-label="进入创作台">
              ▶
            </Link>
          </div>
        </div>
        <div className="lp-scroll">
          SCROLL TO EXPLORE <span>↓</span>
        </div>
      </section>
      <section className="lp-features" id="features">
        <div>
          <p className="lp-eyebrow" style={{ color: "var(--color-yellow)" }}>
            <span /> STUDIO
          </p>
          <h2>
            把一句话
            <br />
            做成<em>电影</em>
          </h2>
          <p>剧本、资产、故事板、成片预览，在同一个工作台里走完。适合短片、漫剧分镜、品牌广告与个人影像日记。</p>
        </div>
        <div className="lp-cards">
          {FEATURES.map((f) => (
            <article key={f.no} className={`lp-card ${f.tone}`}>
              <small>{f.no}</small>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
              <b>↗</b>
            </article>
          ))}
        </div>
      </section>
      <section className="lp-steps" id="work">
        <h2>三步，出片。</h2>
        <div className="lp-step-grid">
          <article className="lp-step">
            <div className="no">STEP 01</div>
            <h3>写下想法</h3>
            <p>一句也行，一段小说也行。谁、在哪、做什么，Lumina 听得懂。</p>
          </article>
          <article className="lp-step">
            <div className="no">STEP 02</div>
            <h3>拆镜与资产</h3>
            <p>自动提炼角色、场景，生成带景别和运镜的故事板，提示词已经写好。</p>
          </article>
          <article className="lp-step">
            <div className="no">STEP 03</div>
            <h3>生成画面</h3>
            <p>按镜出图，预览成片。角色前后统一，风格跟着你选的画风走。</p>
          </article>
        </div>
      </section>
      <section className="lp-closing" id="closing">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <p>NOW SHOWING</p>
        <h2>
          把脑海里的
          <br />
          <em>电影</em>
          拍出来
        </h2>
        <Link to="/studio" className="btn-primary">
          <span className="btn-play">▶</span>
          开始创作
        </Link>
      </section>
      <footer className="lp-footer">
        <Brand compact />
        <p>让每一个好想法，都有被看见的机会。</p>
        <span>© 2026 LUMINA CREATIVE LAB</span>
      </footer>
      {contact ? <ContactModal onClose={() => setContact(false)} /> : null}
    </main>
  );
}

function ContactModal({ onClose }: { onClose: () => void }) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    pushToast("已收到，我们会尽快联系你。");
    onClose();
  }
  return (
    <div className="modal-scrim" onClick={onClose} role="presentation">
      <div className="modal-card" role="dialog" aria-labelledby="contact-title" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="font-display text-[11px] tracking-[2px]">CONTACT</p>
            <h2 id="contact-title" className="mt-1 text-2xl font-extrabold">商务合作</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full border border-ink" aria-label="关闭">
            <X size={16} />
          </button>
        </div>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <label className="text-sm font-semibold">名字
            <input required name="name" className="mt-1 h-11 w-full rounded-xl border border-ink bg-white px-3 font-normal" />
          </label>
          <label className="text-sm font-semibold">邮箱
            <input required type="email" name="email" className="mt-1 h-11 w-full rounded-xl border border-ink bg-white px-3 font-normal" />
          </label>
          <label className="text-sm font-semibold">想合作的事
            <textarea required name="note" rows={4} className="mt-1 w-full rounded-xl border border-ink bg-white px-3 py-2 font-normal" />
          </label>
          <button type="submit" className="btn-primary mt-2 h-14 text-base">发送</button>
        </form>
      </div>
    </div>
  );
}

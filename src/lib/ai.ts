import { createServerFn } from "@tanstack/react-start";
import { styleById, uid, type Aspect, type Project, type Shot, type Workflow } from "./types";

type StoryInput = {
  idea: string;
  shotCount: number;
  styleId: string;
  workflow: Workflow;
  aspect: Aspect;
};

type StoryOk = { ok: true; project: Omit<Project, "id" | "createdAt" | "updatedAt"> };
type StoryErr = { ok: false; error: string };
type ImageOk = { ok: true; dataUrl: string };
type ImageErr = { ok: false; error: string };

const NSFW =
  /色情|裸露|性爱|性交|porn|nsfw|nude|xxx|性器官|未成年/i;

function extractJson(text: string): unknown {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("模型没有返回完整结构");
  return JSON.parse(raw.slice(start, end + 1));
}

function fallbackProject(input: StoryInput): StoryOk["project"] {
  const idea = input.idea.trim();
  const title = idea.replace(/[，。！？,.!?].*$/, "").slice(0, 12) || "未命名短片";
  const types = ["远景", "中景", "近景", "特写", "过肩", "全景"];
  const cams = ["缓推", "固定", "手持", "微移", "升起"];
  const shots: Shot[] = Array.from({ length: input.shotCount }, (_, i) => ({
    id: uid("sh"),
    index: i + 1,
    duration: 4,
    shotType: types[i % types.length]!,
    camera: cams[i % cams.length]!,
    action: i === 0 ? `开场：${idea}` : `第 ${i + 1} 镜，承接上一拍的情绪，推进「${idea}」。`,
    dialogue: "",
    imagePrompt: `${idea}, shot ${i + 1}, ${types[i % types.length]}`,
  }));
  return {
    title,
    logline: idea.slice(0, 48),
    idea,
    genre: "短片",
    workflow: input.workflow,
    styleId: input.styleId,
    aspect: input.aspect,
    script: idea,
    characters: [],
    locations: [],
    shots,
    coverUrl: undefined,
  };
}

export const generateStoryboard = createServerFn({ method: "POST" })
  .validator((input: StoryInput) => input)
  .handler(async ({ data }): Promise<StoryOk | StoryErr> => {
    const idea = data.idea.trim();
    if (!idea) return { ok: false, error: "先写下一句话。" };
    if (idea.length > 4000) return { ok: false, error: "剧本太长，先精炼到四千字内。" };
    if (NSFW.test(idea)) {
      return { ok: false, error: "这个工作室只做全年龄向的电影、动画与纪录片。" };
    }
    const shotCount = Math.min(12, Math.max(3, Math.round(data.shotCount) || 6));
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: true, project: fallbackProject({ ...data, shotCount, idea }) };
    }

    const style = styleById(data.styleId);
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.8,
        max_tokens: 1800,
        messages: [
          {
            role: "system",
            content: `你是电影分镜导演。把用户的想法拆成可拍摄的短片故事板。只做全年龄向内容。
必须返回 JSON，不要 markdown。结构：
{"title":"","logline":"","genre":"","script":"200字以内的短剧本","characters":[{"name":"","description":"","look":""}],"locations":[{"name":"","description":"","look":""}],"shots":[{"shotType":"远景|中景|近景|特写|过肩|全景","camera":"","duration":4,"action":"","dialogue":"","imagePrompt":"英文画面提示词，具体、可拍摄"}]}
shots 必须正好 ${shotCount} 个。imagePrompt 用英文，并带上画风：${style.prompt}。角色与地点 look 用中文。`,
          },
          {
            role: "user",
            content: `工作流：${data.workflow}。画幅：${data.aspect}。想法：\n${idea}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: true, project: fallbackProject({ ...data, shotCount, idea }) };
    }
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    try {
      const parsed = extractJson(text) as {
        title?: string;
        logline?: string;
        genre?: string;
        script?: string;
        characters?: { name?: string; description?: string; look?: string }[];
        locations?: { name?: string; description?: string; look?: string }[];
        shots?: {
          shotType?: string;
          camera?: string;
          duration?: number;
          action?: string;
          dialogue?: string;
          imagePrompt?: string;
        }[];
      };
      const shots = (parsed.shots ?? []).slice(0, shotCount).map((s, i) => ({
        id: uid("sh"),
        index: i + 1,
        duration: Math.min(8, Math.max(2, Number(s.duration) || 4)),
        shotType: s.shotType || "中景",
        camera: s.camera || "固定",
        action: s.action || "",
        dialogue: s.dialogue || "",
        imagePrompt: s.imagePrompt || idea,
      }));
      while (shots.length < shotCount) {
        const i = shots.length;
        shots.push({
          id: uid("sh"),
          index: i + 1,
          duration: 4,
          shotType: "中景",
          camera: "固定",
          action: idea,
          dialogue: "",
          imagePrompt: idea,
        });
      }
      return {
        ok: true,
        project: {
          title: (parsed.title || idea).slice(0, 24),
          logline: (parsed.logline || idea).slice(0, 80),
          idea,
          genre: parsed.genre || "短片",
          workflow: data.workflow,
          styleId: data.styleId,
          aspect: data.aspect,
          script: parsed.script || idea,
          characters: (parsed.characters ?? []).slice(0, 6).map((c) => ({
            id: uid("ch"),
            kind: "character" as const,
            name: c.name || "角色",
            description: c.description || "",
            look: c.look || "",
          })),
          locations: (parsed.locations ?? []).slice(0, 4).map((l) => ({
            id: uid("lc"),
            kind: "location" as const,
            name: l.name || "场景",
            description: l.description || "",
            look: l.look || "",
          })),
          shots,
        },
      };
    } catch {
      return { ok: true, project: fallbackProject({ ...data, shotCount, idea }) };
    }
  });

export const generateStill = createServerFn({ method: "POST" })
  .validator((input: { prompt: string; styleId: string }) => input)
  .handler(async ({ data }): Promise<ImageOk | ImageErr> => {
    const prompt = data.prompt.trim();
    if (!prompt) return { ok: false, error: "没有提示词。" };
    if (NSFW.test(prompt)) {
      return { ok: false, error: "这个工作室只做全年龄向画面。" };
    }
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "生图暂时不可用。" };
    const style = styleById(data.styleId);
    const res = await fetch("https://api.x.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-image",
        prompt: `${prompt}. ${style.prompt}. No text, no watermark, no logo.`,
        n: 1,
        resolution: "1k",
        response_format: "b64_json",
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return { ok: false, error: `生图失败（${res.status}）${errText.slice(0, 80)}` };
    }
    const body = (await res.json()) as {
      data?: { b64_json?: string; url?: string }[];
    };
    const item = body.data?.[0];
    if (item?.b64_json) {
      return { ok: true, dataUrl: `data:image/jpeg;base64,${item.b64_json}` };
    }
    if (item?.url) {
      const img = await fetch(item.url);
      const buf = Buffer.from(await img.arrayBuffer());
      return { ok: true, dataUrl: `data:image/jpeg;base64,${buf.toString("base64")}` };
    }
    return { ok: false, error: "没有收到画面。" };
  });

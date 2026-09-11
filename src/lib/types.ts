export type Aspect = "16:9" | "9:16" | "2.35";
export type Workflow = "one-liner" | "novel" | "image";
export type AssetKind = "character" | "location" | "prop";
export type StudioTab = "script" | "assets" | "board" | "play" | "settings";

export type Shot = {
  id: string;
  index: number;
  duration: number;
  shotType: string;
  camera: string;
  action: string;
  dialogue: string;
  imagePrompt: string;
  imageUrl?: string;
};

export type Asset = {
  id: string;
  kind: AssetKind;
  name: string;
  description: string;
  look: string;
  imageUrl?: string;
};

export type Project = {
  id: string;
  title: string;
  logline: string;
  idea: string;
  genre: string;
  workflow: Workflow;
  styleId: string;
  aspect: Aspect;
  script: string;
  characters: Asset[];
  locations: Asset[];
  shots: Shot[];
  coverUrl?: string;
  createdAt: number;
  updatedAt: number;
};

export type StylePreset = {
  id: string;
  name: string;
  hint: string;
  prompt: string;
};

export const STYLES: StylePreset[] = [
  {
    id: "cinema",
    name: "电影拍摄",
    hint: "35mm · 变形宽银幕",
    prompt: "cinematic photoreal 35mm anamorphic film still, naturalistic lighting, subtle film grain",
  },
  {
    id: "anime",
    name: "日系动画",
    hint: "新海诚光影",
    prompt: "cinematic anime still, Makoto Shinkai lighting, detailed background, emotional atmosphere",
  },
  {
    id: "cyber",
    name: "赛博都市",
    hint: "霓虹 · 雨夜",
    prompt: "cyberpunk night city, teal and amber neon, rain-soaked reflections, photoreal cinematic",
  },
  {
    id: "ink",
    name: "古风水墨",
    hint: "宣纸 · 留白",
    prompt: "traditional Chinese ink wash painting, xuan paper texture, mist, restrained palette",
  },
  {
    id: "fairy",
    name: "梦幻童话",
    hint: "绘本光",
    prompt: "painterly storybook illustration, warm whimsical light, richly textured, cinematic composition",
  },
  {
    id: "doc",
    name: "纪录片",
    hint: "现场光",
    prompt: "naturalistic documentary still, available light, handheld observational cinema",
  },
];

export const WORKFLOWS: { id: Workflow; name: string; hint: string }[] = [
  { id: "one-liner", name: "一句话成片", hint: "谁、在哪、做什么" },
  { id: "novel", name: "小说改编", hint: "贴剧本，拆分镜" },
  { id: "image", name: "图生分镜", hint: "先定角色再生画面" },
];

export const ASPECTS: { id: Aspect; name: string }[] = [
  { id: "16:9", name: "16:9 宽幕" },
  { id: "9:16", name: "9:16 竖屏" },
  { id: "2.35", name: "2.35 电影" },
];

export function styleById(id: string): StylePreset {
  return STYLES.find((s) => s.id === id) ?? STYLES[0]!;
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

import { DEMO_PROJECTS } from "./demo";
import { uid, type Project, type Shot } from "./types";

export type FilmTemplate = {
  id: string;
  title: string;
  cover: string;
  uses: number;
  hint: string;
  genre: string;
  difficulty: "低" | "中";
  sourceId: string;
};

export const TEMPLATES: FilmTemplate[] = [
  { id: "tpl-rain", title: "雨夜寻猫", cover: "/media/s-alley.jpg", uses: 12840, hint: "都市剧情 · 跟拍同款", genre: "都市剧情", difficulty: "低", sourceId: "demo-rain" },
  { id: "tpl-tea", title: "山间一盏茶", cover: "/media/s-teahouse.jpg", uses: 6720, hint: "古风散文 · 跟拍同款", genre: "古风散文", difficulty: "低", sourceId: "demo-tea" },
  { id: "tpl-star", title: "最后一封星邮", cover: "/media/s-planet.jpg", uses: 4510, hint: "科幻宽幕 · 跟拍同款", genre: "科幻", difficulty: "中", sourceId: "demo-star" },
  { id: "tpl-neon", title: "霓虹回廊", cover: "/media/s-corridor.jpg", uses: 2890, hint: "赛博都市 · 跟拍同款", genre: "科幻", difficulty: "中", sourceId: "demo-star" },
  { id: "tpl-mist", title: "雾径煮茶", cover: "/media/s-path.jpg", uses: 3340, hint: "水墨留白 · 跟拍同款", genre: "古风散文", difficulty: "低", sourceId: "demo-tea" },
  { id: "tpl-dawn", title: "屋顶晨光", cover: "/media/s-rooftop.jpg", uses: 1980, hint: "电影拍摄 · 跟拍同款", genre: "都市剧情", difficulty: "低", sourceId: "demo-rain" },
];

export function templateById(id: string) {
  return TEMPLATES.find((t) => t.id === id);
}

export function templateSource(sourceId: string) {
  return DEMO_PROJECTS.find((p) => p.id === sourceId);
}

function rewrite(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}

export function buildRemix(
  source: Project,
  template: FilmTemplate,
  opts: { title: string; names: Record<string, string>; dialogues: Record<string, string> },
): Project {
  const now = Date.now();
  const title = opts.title.trim() || `${template.title}（跟拍）`;
  let logline = source.logline;
  let script = source.script;
  let idea = source.idea;
  for (const c of source.characters) {
    const next = (opts.names[c.id] ?? c.name).trim() || c.name;
    logline = rewrite(logline, c.name, next);
    script = rewrite(script, c.name, next);
    idea = rewrite(idea, c.name, next);
  }
  const characters = source.characters.map((c) => ({
    ...c,
    id: uid("c"),
    name: (opts.names[c.id] ?? c.name).trim() || c.name,
  }));
  const locations = source.locations.map((l) => ({ ...l, id: uid("l") }));
  const shots: Shot[] = source.shots.map((s) => {
    let action = s.action;
    let dialogue = opts.dialogues[s.id] ?? s.dialogue;
    for (const c of source.characters) {
      const next = (opts.names[c.id] ?? c.name).trim() || c.name;
      action = rewrite(action, c.name, next);
      dialogue = rewrite(dialogue, c.name, next);
    }
    return { ...s, id: uid("s"), action, dialogue };
  });
  return {
    ...source,
    id: uid("prj"),
    title,
    logline,
    idea,
    script,
    coverUrl: template.cover,
    genre: template.genre,
    characters,
    locations,
    shots,
    createdAt: now,
    updatedAt: now,
  };
}

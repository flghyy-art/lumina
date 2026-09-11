import type { Project } from "./types";

const t = 1_720_000_000_000;

export const DEMO_PROJECTS: Project[] = [
  {
    id: "demo-rain",
    title: "雨夜寻猫",
    logline: "一场暴雨里，她在东京巷弄找回走失的猫，也找回自己。",
    idea: "一个女孩在雨夜的东京街头寻找失踪的猫，6 个分镜",
    genre: "都市剧情",
    workflow: "one-liner",
    styleId: "cinema",
    aspect: "16:9",
    script: "雨把霓虹揉进积水。林夏撑着透明伞，沿着后巷叫着「阿橘」。便利店的灯白得刺眼。屋顶上，第一缕蓝调晨光落下时，猫终于钻进她怀里。",
    coverUrl: "/media/s-alley.jpg",
    createdAt: t,
    updatedAt: t,
    characters: [
      { id: "c-linxia", kind: "character", name: "林夏", description: "二十六岁，刚辞掉设计工作，话少，观察力极好。", look: "湿发贴脸，深色高领大衣，雨夜霓虹反光", imageUrl: "/media/p-rain.jpg" },
      { id: "c-aju", kind: "character", name: "阿橘", description: "三花猫，走失三天，认得林夏的脚步声。", look: "被雨水打湿的三花猫，蹲在霓虹灯下", imageUrl: "/media/s-cat.jpg" },
    ],
    locations: [
      { id: "l-alley", kind: "location", name: "新宿后巷", description: "狭窄、积水、招牌层叠。", look: "雨夜东京巷弄，霓虹汉字倒映在积水里", imageUrl: "/media/s-alley.jpg" },
    ],
    shots: [
      { id: "r1", index: 1, duration: 4, shotType: "远景", camera: "缓推", action: "暴雨中的巷弄，一个人打伞走来。", dialogue: "", imagePrompt: "rain-soaked Tokyo alley at night, neon reflections, lone figure with umbrella", imageUrl: "/media/s-alley.jpg" },
      { id: "r2", index: 2, duration: 3, shotType: "近景", camera: "手持微晃", action: "林夏侧脸被雨水打湿，目光搜寻。", dialogue: "阿橘……你在哪。", imagePrompt: "close-up of young woman in rain, neon magenta lighting, wet hair", imageUrl: "/media/p-rain.jpg" },
      { id: "r3", index: 3, duration: 3, shotType: "特写", camera: "固定", action: "三花猫蹲在招牌下，耳朵动了一下。", dialogue: "", imagePrompt: "wet calico cat under neon sign in Tokyo alley", imageUrl: "/media/s-cat.jpg" },
      { id: "r4", index: 4, duration: 4, shotType: "中景", camera: "过肩", action: "林夏停在便利店门口，回头看雨。", dialogue: "再找一条街。", imagePrompt: "convenience store doorway at night, wet coat, rainy street behind", imageUrl: "/media/s-store.jpg" },
      { id: "r5", index: 5, duration: 5, shotType: "全景", camera: "升起", action: "天台蓝调时刻，她把猫抱在怀里。", dialogue: "这次不走丢了。", imagePrompt: "Tokyo rooftop at blue dawn, woman holding a small cat, city skyline", imageUrl: "/media/s-rooftop.jpg" },
    ],
  },
  {
    id: "demo-tea",
    title: "山间一盏茶",
    logline: "雾散之前，她把一壶春茶留给下山的人。",
    idea: "山间茶馆，一位女子在晨雾里煮茶待客",
    genre: "古风散文",
    workflow: "one-liner",
    styleId: "ink",
    aspect: "16:9",
    script: "松针上的露水滴进石槽。阿湘把炉火拨旺，第一泡茶的香气沿着回廊走出去，遇见一个还没决定要不要进门的旅人。",
    coverUrl: "/media/s-teahouse.jpg",
    createdAt: t - 86400000,
    updatedAt: t - 86400000,
    characters: [
      { id: "c-xiang", kind: "character", name: "阿湘", description: "茶馆主人，话不多，记得每位客人爱喝哪一泡。", look: "发簪、素衣、水墨留白里的侧脸", imageUrl: "/media/p-ink.jpg" },
    ],
    locations: [
      { id: "l-tea", kind: "location", name: "云起茶寮", description: "木廊、铁壶、对山。", look: "晨雾山间茶馆，木质回廊", imageUrl: "/media/s-teahouse.jpg" },
    ],
    shots: [
      { id: "t1", index: 1, duration: 4, shotType: "远景", camera: "缓移", action: "雾中石径通向茶寮门。", dialogue: "", imagePrompt: "misty mountain path toward a tea house gate", imageUrl: "/media/s-path.jpg" },
      { id: "t2", index: 2, duration: 5, shotType: "中景", camera: "固定", action: "阿湘立在廊边，看松林。", dialogue: "茶还早。", imagePrompt: "woman in linen on wooden veranda, misty pine forest, dawn", imageUrl: "/media/s-teahouse.jpg" },
      { id: "t3", index: 3, duration: 4, shotType: "特写", camera: "微推", action: "茶汤注入青瓷。", dialogue: "", imagePrompt: "hands pouring amber tea into celadon cup, steam, morning light", imageUrl: "/media/s-tea.jpg" },
      { id: "t4", index: 4, duration: 3, shotType: "近景", camera: "固定", action: "她抬眼，像在等一个还没出现的名字。", dialogue: "坐。山会把人送来。", imagePrompt: "ink wash portrait of a young woman with hairpin, misty mountains", imageUrl: "/media/p-ink.jpg" },
    ],
  },
  {
    id: "demo-star",
    title: "最后一封星邮",
    logline: "信使把一封无人认领的信，送到一颗正在熄灭的行星。",
    idea: "星际信使穿过空间站，把一封信送到窗外那颗星球",
    genre: "科幻",
    workflow: "one-liner",
    styleId: "cinema",
    aspect: "2.35",
    script: "周北提着密封匣穿过环形舱。观察窗里，那颗行星正在把最后的光吞进去。他没有打开信。有些话，只需要被送到。",
    coverUrl: "/media/s-planet.jpg",
    createdAt: t - 172800000,
    updatedAt: t - 172800000,
    characters: [
      { id: "c-zhou", kind: "character", name: "周北", description: "三十二岁，星际邮政最后一批信使。", look: "胡茾、推起的护目镜、一半行星暖光一半冷钢", imageUrl: "/media/p-courier.jpg" },
    ],
    locations: [
      { id: "l-deck", kind: "location", name: "观察甲板", description: "整面落地窗对着一颗将熄的行星。", look: "space-station observation deck, planet filling the window", imageUrl: "/media/s-planet.jpg" },
    ],
    shots: [
      { id: "s1", index: 1, duration: 4, shotType: "中景", camera: "跟拍", action: "周北提着金属匣走过环形走廊。", dialogue: "", imagePrompt: "courier walking a space-station corridor carrying a sealed case", imageUrl: "/media/s-corridor.jpg" },
      { id: "s2", index: 2, duration: 3, shotType: "近景", camera: "固定", action: "他摔下护目镜，额上有细汗。", dialogue: "还有四分钟窗口。", imagePrompt: "tired space courier close-up, visor pushed up, planet light on face", imageUrl: "/media/p-courier.jpg" },
      { id: "s3", index: 3, duration: 6, shotType: "大远景", camera: "极缓推", action: "他站在观察窗前，行星占据整个画面。", dialogue: "信送到了。其余的，不是我的。", imagePrompt: "courier before a planet-filling observation window, volumetric light", imageUrl: "/media/s-planet.jpg" },
    ],
  },
];

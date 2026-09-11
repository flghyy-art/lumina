# Lumina

电影感 AI 短片工坊。选示范模板跟拍，或从一句话拆分镜、出静帧。

**Lumina** is a cinematic AI short-film studio: remix a template, or write one line and generate a storyboard.

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:8080](http://localhost:8080)

生成画面需要在服务端配置 `XAI_API_KEY`（xAI）。不配也能浏览示范短片、跟拍和分镜。

生产构建：

```bash
npm run build
```

可部署到 Vercel（Nitro `vercel` preset）。

## 可以怎么用

1. 打开工作台，进 **小白片场** 或 **模板示例**
2. 选一部示范（雨夜寻猫、山间一盏茶、最后一封星邮）
3. 改项目名、角色名、对白，点 **跟拍同款**
4. 在故事板里改镜头，需要时再生成某一镜

大师工坊支持一句话成片、小说改编、图生分镜。项目存在本机，没有账号。

## 页面

| 路径 | 说明 |
| --- | --- |
| `/` | 落地页 |
| `/studio` | 工作台：发现 / 小白 / 模板 / 资产 / 学习 / 我的 |
| `/studio/tpl/:id` | 模板预览与跟拍 |
| `/studio/:id` | 故事板编辑器 |

## 技术

- React 19 · TanStack Start · Tailwind CSS v4
- 本地状态：Zustand + IndexedDB
- 可选生图：xAI image API

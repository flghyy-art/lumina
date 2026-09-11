# Lumina

电影感 AI 短片工坊。选示范模板跟拍，或从一句话拆分镜、出静帧。

**Lumina** is a cinematic AI short-film studio: remix a template, or write one line and generate a storyboard.

## 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flghyy-art/lumina)

仓库已接好 TanStack Start + Nitro（`vercel.json` 指定 `framework: tanstack-start`）。用上面的按钮，或在 [Vercel New Project](https://vercel.com/new/import?s=https://github.com/flghyy-art/lumina) 导入 `flghyy-art/lumina`，确认框架是 **TanStack Start** 后 Deploy。

生成静帧需要在 Vercel 项目环境变量里加服务端 `XAI_API_KEY`。不配也能浏览示范短片和跟拍。

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

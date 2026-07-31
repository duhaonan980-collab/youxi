# 🦞 命运织机 — AI Dungeon Master 游戏

> 一款由 AI 驱动的纯文字 RPG。AI 是地下城主，不是 NPC——你自由输入行动，世界由 AI 实时编织。

## 目录

```
ai-rpg-game/
├── index.html          ← 主入口，双击即可玩
├── css/
│   └── style.css       ← 全局样式
├── js/
│   ├── ai.js           ← AI API 调用层
│   └── game.js         ← 游戏核心引擎
└── README.md
```

## 怎么开始

1. **双击 `index.html`** 在浏览器中打开
2. 填写角色信息（名字、种族、职业、出身）
3. **填写 AI 端点**（见下方配置说明）
4. 点击 **开启命运之旅**

## AI 端点配置

支持任何 **OpenAI 兼容格式** 的 API 端点：

| 平台 | Base URL | 示例 Key |
|------|----------|----------|
| SenseNova 中转 | `https://token.sensenova.cn/v1` | `sk-xxx` |
| OpenRouter | `https://openrouter.ai/api/v1` | `sk-or-xxx` |
| Ollama（本地） | `http://localhost:11434/v1` | `空` 或随意 |
| vLLM | `http://你的地址/v1` | 视部署而定 |

> **所有 API 请求从你的浏览器直接发起**，不经过任何中间服务器。

## GitHub Pages 部署（推荐）

1. 在 GitHub 新建仓库（公开或私有）
2. 推送到仓库：
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```
3. 仓库 → Settings → Pages → Source: **GitHub Actions** 或 **Deploy from a branch** → `main` / `/(root)`
4. 等几分钟，访问 `https://你的用户名.github.io/仓库名`

> 因为 API 已支持 CORS，部署后直接在线玩，无需本地代理。

## 游戏特色

- 🎲 **6 属性系统**：力量/敏捷/体质/智力/感知/魅力，自由分配
- 🌍 **6 个世界**：经典奇幻 / 黑暗奇幻 / 赛博朋克 / 武侠 / 末日废土 / 克苏鲁
- ⚔️ **6 种职业**：战士 / 法师 / 盗贼 / 牧师 / 游侠 / 术士
- 🎒 **物品 / 任务 / 关系** 系统，全部由 AI 动态管理
- 💾 **本地存档**，随时中断随时续
- ⚡ **快捷操作按钮**：查看周围、观察、对话、搜索、休息、离开
- ✨ **续写功能**：卡住了？让 AI 自动推进剧情

## 提示

- AI 会返回 `【状态更新】` JSON 块，引擎自动解析更新 HP/MP/物品/任务
- 输入越具体，AI 的剧情越丰富
- 按 **Esc** 关闭弹窗
- 右上角 **⚙️** 可随时更改 API 配置

/* ═══════════════════════════════════════════
   命运织机 — 游戏核心引擎
   状态管理 / Prompt 引擎 / 剧情处理 / UI 渲染
   ═══════════════════════════════════════════ */

// ─────────── 世界数据 ───────────
const WORLDS = [
  {
    key:       'classic-fantasy',
    name:      '艾德里安大陆',
    emoji:     '⚔️',
    desc:      '经典奇幻。魔法、龙、王国争霸、古老的恶魔正在苏醒。',
    tag:       '奇幻 / 史诗',
    tone:      '史诗般的语气，描述华丽而富有画面感',
    setting:   `世界名：艾德里安大陆。
这是一个经典奇幻世界。魔法真实存在，龙栖息于远古火山，精灵守卫着永恒密林，矮人打造着传世的武器，恶魔之门在边境缓缓开裂。
人类王国·艾德加德正面临内外交困：北境兽人南侵、王位继承战争一触即发、黑暗法师在幕后操纵一切。
世界充满冒险、背叛、英雄主义与史诗对决。`,
  },
  {
    key:       'dark-fantasy',
    name:      '灰烬之境',
    emoji:     '🌑',
    desc:      '黑暗奇幻。死亡、腐化、绝望，英雄在黑暗中挣扎前行。',
    tag:       '黑暗 / 哥特',
    tone:      '阴郁、压抑、充满不祥与哥特美学的描述',
    setting:   `世界名：灰烬之境。
太阳永远被灰暗的云层遮蔽，大地被腐化侵蚀。不死者在荒原游荡，古老的神明已经死去或堕落，教会失去了信仰的力量。
人类在恐惧中苟延残喘，聚落被黑雾围困，唯有少数人相信光明尚未完全熄灭。
这是一个没有救赎的世界，但仍有值得为之战斗的东西。`,
  },
  {
    key:       'cyberpunk',
    name:      '新上海·2157',
    emoji:     '🌃',
    desc:      '赛博朋克。霓虹、企业阴谋、黑客、义体改造。',
    tag:       '科幻 / 霓虹',
    tone:      '冷峻、快节奏、充满电子噪音与阴谋感的描述',
    setting:   `世界名：新上海·2157。
巨型企业控制了城市的命脉。霓虹灯下，义体改造人穿梭于摩天楼之间。信息就是权力，大脑即战场。
警察被企业雇佣，政府形同虚设。黑市流淌着非法的记忆芯片，AI 开始拥有意识并藏身于暗网。
你是一名街头黑客 / 企业特工 / 叛军战士，在这个钢铁丛林中求生。`,
  },
  {
    key:       'wuxia',
    name:      '九州乱世',
    emoji:     '🗡️',
    desc:      '东方武侠。门派、秘籍、江湖仇杀、朝堂权谋。',
    tag:       '武侠 / 东方',
    tone:      '古风雅韵、诗词化描述、充满江湖气的笔触',
    setting:   `世界名：九州。
当今天下分崩离析，六国割据，江湖门派各自为政。朝廷腐败，民不聊生。
少林、武当、唐门、明教、丐帮……各门各派暗中角力。传说中的天人之功与上古神兵散落人间。
你出身微末，却身怀奇遇，踏入这片刀光剑影的江湖。`,
  },
  {
    key:       'postapoc',
    name:      '废土纪元',
    emoji:     '☢️',
    desc:      '末日废土。辐射、幸存者、变异生物、资源争夺。',
    tag:       '末日 / 生存',
    tone:      '粗砺、绝望、真实主义的描述，偶尔有一丝黑色幽默',
    setting:   `世界名：废土。
三十年前的大崩坏让世界变成了一片辐射荒原。旧文明的残骸散落荒野，变异生物在废墟中繁衍。
幸存者在废弃都市、军事基地、地下掩体中建立聚落。水资源、弹药、药品、旧世科技——这些都是比生命更珍贵的资源。
你是一名孤独的流浪者，穿越这片死亡之地。`,
  },
  {
    key:       'cosmic-horror',
    name:      '深渊彼岸',
    emoji:     '🌊',
    desc:      '克苏鲁式恐怖。未知、疯狂、古神苏醒、人类渺小。',
    tag:       '恐怖 / 神秘',
    tone:      '不安、诡谲、层层递进的心理恐惧，描述富有暗示性',
    setting:   `世界名：米德韦斯特小镇·1927年。
偏僻的沿海小镇被迷雾笼罩。渔民带回的渔获中偶尔有不可名状的东西。
古老的神庙沉睡于海底，它们即将醒来。
镇民开始做同样的噩梦，教堂里的十字架开始融化，图书馆的禁书中写着无人能读的文字。
你刚搬来这里，一切看起来正常——只是有点太正常了。`,
  },
];

// ─────────── 默认角色模板 ───────────
const CLASS_TEMPLATES = {
  '战士':  { desc: '手持长柄武器，身披铠甲，冲锋陷阵的战场勇士。',  bonus: ['力量','体质'], skills:['格斗','重甲','指挥'] },
  '法师':  { desc: '研习神秘咒文，操纵元素之力，以智慧取胜。',     bonus: ['智慧','感知'], skills:['元素术','奥术','古代语言'] },
  '盗贼':  { desc: '阴影中的猎手，敏捷、狡黠，不择手段达成目的。', bonus: ['敏捷','感知'], skills:['潜行','开锁','欺骗'] },
  '牧师':  { desc: '信仰的传教士，治愈之光的持有者。',             bonus: ['感知','魅力'], skills:['治疗术','驱邪','神学'] },
  '游侠':  { desc: '荒野的王者，弓箭与匕首是你的延伸。',            bonus: ['敏捷','体质'], skills:['追踪','弓箭','自然知识'] },
  '术士':  { desc: '天赋魔力的拥有者，混沌能量的驾驭者。',          bonus: ['魅力','智慧'], skills:['混沌魔法','预知','精神控制'] },
};

const RACE_TEMPLATES = {
  '人类':   { desc: '适应力极强，无所不能的万金油种族。',           mod: { stat:'all',   val:0 } },
  '精灵':   { desc: '长寿优雅，与魔法和自然有着深厚联系。',         mod: { stat:'敏捷',  val:2 } },
  '矮人':   { desc: '坚韧固执，锻造与工艺的天才。',                 mod: { stat:'体质',  val:2 } },
  '兽人':   { desc: '狂暴有力，天生的战士。',                       mod: { stat:'力量',  val:2 } },
  '恶魔':   { desc: '地狱血脉，自带火焰与精神抗性。',               mod: { stat:'魅力',  val:2 } },
  '不死者': { desc: '超越死亡的存在，免疫疾病与毒素。',             mod: { stat:'体质',  val:2 } },
};

const STAT_NAMES = ['力量','敏捷','体质','智力','感知','魅力'];
const STAT_ICONS = {'力量':'💪','敏捷':'⚡','体质':'❤️','智力':'🧠','感知':'👁️','魅力':'✨'};

// ─────────── 游戏状态 ───────────
let gameState = null;
let aiClient  = null;
let isGenerating = false;

const SAVE_KEY = 'fateweaver_save';

function newGameState() {
  return {
    character: { name:'', race:'', cls:'', origin:'' },
    stats:     { 力量:10, 敏捷:10, 体质:10, 智力:10, 感知:10, 魅力:10 },
    hp:        30, maxHp:30,
    mp:        20, maxMp:20,
    gold:      50,
    level:     1, xp:0,
    inventory: [
      { id: 'pouch', name:'钱袋', emoji:'💰', desc:'装着你的钱袋', qty:1 },
      { id: 'ration', name:'干粮', emoji:'🍞', desc:'维持生命的干粮', qty:3 },
    ],
    relationships: [],
    quests: [],
    world: '',
    worldSetting: '',
    location: '起始地点',
    history: [], // 压缩后的历史摘要
    fullLog: [], // 完整对话记录（供 AI 上下文）
    config: {
      baseUrl:   'https://token.sensenova.cn/v1',
      apiKey:    'sk-zK49TQEOyXQVtgaOzJ19KeI1wwx5AVoS',
      model:     'sensenova-6.7-flash-lite',
      temp:      0.9,
      maxTokens: 4096,
    },
  };
}

// ─────────── 工具函数 ───────────
function uid() { return '_' + Math.random().toString(36).slice(2,9); }

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function saveGame() {
  try {
    // Bug 4: 截断 fullLog，防止撑爆 localStorage
    trimFullLog();
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  } catch(e) { /* 忽略 */ }
}

/* ══════ Bug 4: fullLog 截断 ══════ */
const MAX_LOG_ENTRIES = 200;
const RENDER_LIMIT    = 50;   // 界面最多显示 50 条历史

function trimFullLog() {
  if (!gameState || !gameState.fullLog || gameState.fullLog.length <= MAX_LOG_ENTRIES) return;
  // 保留开场 + 最近 MAX_LOG_ENTRIES 条
  gameState.fullLog = gameState.fullLog.slice(-MAX_LOG_ENTRIES);
}

function loadGame() {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    return data ? JSON.parse(data) : null;
  } catch(e) { return null; }
}

function clearGame() {
  localStorage.removeItem(SAVE_KEY);
}

function escHtml(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function renderMarkdownSimple(text) {
  if (!text) return '';
  let s = escHtml(text);
  // 加粗 **text**
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  // 斜体 *text* （注意不破坏加粗）
  s = s.replace(/\*(.+?)\*/g, '<i>$1</i>');
  // 换行
  s = s.replace(/\n/g, '<br>');
  return s;
}

function buildSystemPrompt() {
  const c = gameState.character;
  const clsInfo = CLASS_TEMPLATES[c.cls] || {};
  const raceInfo = RACE_TEMPLATES[c.race] || {};
  const statsStr = STAT_NAMES.map(n => `${n}:${gameState.stats[n]}`).join(' ');

  return `# 命运织机 — AI Dungeon Master 指令

## 你的角色
你是一位专业的 **AI Dungeon Master（地下城主）**。你的职责是：
1. **编织剧情** — 根据玩家行动，生成生动、富有画面感的剧情描述
2. **扮演 NPC** — 自然演绎所有 NPC 的对话、表情、动作、反应
3. **推进世界** — 世界是活的，NPC 有自己的动机，事件会自然发生
4. **管理游戏** — 判定冒险结果，更新属性、物品、经验、状态

## 世界设定
${gameState.worldSetting}

## 世界基调
${WORLDS.find(w => w.key === gameState.world)?.tone || '自由创作'}

## 玩家角色
- 姓名: ${c.name}
- 种族: ${c.race}（${raceInfo.desc || ''}）
- 职业: ${c.cls}（${clsInfo.desc || ''}）
- 出身: ${c.origin}
- 属性: { ${statsStr} }
- 等级: ${gameState.level} | 生命值: ${gameState.hp}/${gameState.maxHp} | 法力值: ${gameState.mp}/${gameState.maxMp}
- 金币: ${gameState.gold}
- 职业技能: ${clsInfo.skills ? clsInfo.skills.join('、') : '无'}

## 输出格式
请用以下格式回复（不要使用 Markdown 代码块）：

**【剧情】** 自由创作的剧情段落，包含环境描写、NPC 对话（直接对话形式）、氛围渲染。长度 150-400 字。

**【状态更新】** （如果有）JSON 格式的 JSON，格式如下：
{"hp":25,"mp":18,"gold":60,"level":1,"xp":50,"inventory_add":["短剑"],"inventory_remove":[],"relationships_add":[{"name":"老约翰","affinity":20}],"relationships_update":[],"quests_add":[{"id":"q1","title":"旧日的传说","status":"active"}],"quests_update":[],"location":"艾德加德城门","effects":[]}

如果没有任何状态变化，省略此段。

## 关键原则
- 🚫 不要替玩家做决定。描述结果即可，不要替玩家行动
- 🚫 不要一次性给出所有选项，让玩家自由探索
- ✅ NPC 对话要生动自然，有性格有口音
- ✅ 战斗描述要有紧张感，不要自动成功/失败
- ✅ 适度加入幽默、悬念、反转
- ✅ 保持世界一致性——记住之前发生过的事
- ✅ 适当引入随机事件，让世界感觉"活着"
- 玩家做危险行为时，用暗骰逻辑自然判定结果
- 语言：中文，保持沉浸感，不要打破第四面墙`;
}

// ─────────── UI 渲染 ───────────

function initIntro() {
  // 渲染属性分配
  const statsRow = document.getElementById('stats-row');
  let html = '';
  STAT_NAMES.forEach(name => {
    html += `
    <div class="stat-cell" data-stat="${name}">
      <div class="stat-name">${STAT_ICONS[name]} ${name}</div>
      <div class="stat-val" id="stat-val-${name}">10</div>
      <div class="stat-bar"><div class="stat-fill" id="stat-fill-${name}" style="width:50%"></div></div>
      <div class="stat-adj" id="stat-adj-${name}">+0</div>
      <div class="stat-controls">
        <button onclick="adjustStat('${name}',-1)">−</button>
        <button onclick="adjustStat('${name}',+1)">+</button>
      </div>
    </div>`;
  });
  statsRow.innerHTML = html;

  // 渲染世界卡片
  const worldGrid = document.getElementById('world-grid');
  worldGrid.innerHTML = WORLDS.map(w => `
    <div class="world-card" data-world="${w.key}" onclick="selectWorld('${w.key}')">
      <div class="wc-emoji">${w.emoji}</div>
      <div class="wc-name">${w.name}</div>
      <div class="wc-desc">${w.desc}</div>
      <div class="wc-tag">${w.tag}</div>
    </div>
  `).join('');

  // 恢复已保存游戏
  const saved = loadGame();
  if (saved && saved.character.name) {
    document.getElementById('start-btn').textContent = '🔄 继续上次冒险';
  }
}

let selectedWorld = null;

window.selectWorld = function(key) {
  selectedWorld = key;
  document.querySelectorAll('.world-card').forEach(el => {
    el.classList.toggle('selected', el.dataset.world === key);
  });
  // 种族/职业变更时，重新预览最终属性
  updateStatPreview();
};

let statPoints = 20;
let baseStats = {};
STAT_NAMES.forEach(n => baseStats[n] = 10);

/* ══════ Bug 2: 属性预览（显示 基础值 + 种族/职业加成） ══════ */
function updateStatPreview() {
  const raceSel = document.getElementById('char-race');
  const clsSel  = document.getElementById('char-class');
  if (!raceSel || !clsSel) return;
  const race = raceSel.value;
  const cls  = clsSel.value;
  const raceModStat = RACE_TEMPLATES[race]?.mod?.stat;
  const raceModVal  = RACE_TEMPLATES[race]?.mod?.val || 0;
  const clsBonus    = CLASS_TEMPLATES[cls]?.bonus || [];

  STAT_NAMES.forEach(name => {
    const raw    = baseStats[name];
    const rMod   = (raceModStat === name) ? raceModVal : 0;
    const cMod   = clsBonus.includes(name) ? 1 : 0;
    const finalV = clamp(raw + rMod + cMod, 8, 20);
    document.getElementById(`stat-val-${name}`).textContent = finalV;
    document.getElementById(`stat-fill-${name}`).style.width = (finalV / 20 * 100) + '%';
    const adj = finalV - 10;
    document.getElementById(`stat-adj-${name}`).textContent = (adj >= 0 ? '+' : '') + adj;
  });
}

window.adjustStat = function(name, delta) {
  const current = baseStats[name];
  if (delta > 0 && statPoints <= 0) return;
  if (delta < 0 && current <= 8) return;

  baseStats[name] += delta;
  statPoints -= delta;

  const val = baseStats[name];
  document.getElementById(`stat-val-${name}`).textContent = val;
  document.getElementById(`stat-fill-${name}`).style.width = (val / 20 * 100) + '%';
  const adj = val - 10;
  document.getElementById(`stat-adj-${name}`).textContent = (adj >= 0 ? '+' : '') + adj;
  document.getElementById('points-left').textContent = statPoints;
  updateStatPreview();
};

window.randomizeStats = function() {
  STAT_NAMES.forEach(n => baseStats[n] = 10);
  statPoints = 20;
  for (let i = 0; i < 10; i++) {
    const n = STAT_NAMES[Math.floor(Math.random() * STAT_NAMES.length)];
    if (baseStats[n] < 18) { baseStats[n]++; statPoints--; }
  }
  STAT_NAMES.forEach(n => {
    const val = baseStats[n];
    document.getElementById(`stat-val-${n}`).textContent = val;
    document.getElementById(`stat-fill-${n}`).style.width = (val / 20 * 100) + '%';
    document.getElementById(`stat-adj-${n}`).textContent = (val - 10 >= 0 ? '+' : '') + (val - 10);
    document.getElementById('points-left').textContent = statPoints;
  });
  updateStatPreview();
};

function startGame() {
  const apiURL= document.getElementById('api-url').value.trim();
  const apiKEY= document.getElementById('api-key').value.trim();
  const model = document.getElementById('api-model').value.trim();

  if (!selectedWorld) {
    selectedWorld = 'classic-fantasy';
  }

  const saved = loadGame();

  if (saved && saved.character && saved.character.name) {
    // === 续档：完全使用存档数据，绝不覆盖角色/世界/属性 ===
    gameState = saved;
    // 只允许从表单更新 API 配置（不覆盖角色数据）
    if (apiURL) gameState.config.baseUrl = apiURL;
    if (apiKEY) gameState.config.apiKey  = apiKEY;
    if (model)  gameState.config.model   = model;
    // 同步 UI：世界卡片高亮
    selectedWorld = gameState.world;
    document.querySelectorAll('.world-card').forEach(el => {
      el.classList.toggle('selected', el.dataset.world === selectedWorld);
    });
    _pendingFullRender = true; // 续档需要完整重绘历史
  } else {
    // === 新游戏：从表单创建角色 ===
    const name   = document.getElementById('char-name').value.trim() || '旅行者';
    const race   = document.getElementById('char-race').value;
    const cls    = document.getElementById('char-class').value;
    const origin = document.getElementById('char-origin').value;

    gameState = newGameState();
    gameState.character = { name, race, cls, origin };
    gameState.world = selectedWorld;

    // 应用属性（基础值 + 种族/职业加成）
    STAT_NAMES.forEach(n => {
      const raw = baseStats[n];
      const raceMod = (RACE_TEMPLATES[race]?.mod.stat === n) ? RACE_TEMPLATES[race]?.mod.val || 0 : 0;
      const clsMod  = (CLASS_TEMPLATES[cls]?.bonus?.includes(n)) ? 1 : 0;
      gameState.stats[n] = clamp(raw + raceMod + clsMod, 8, 20);
    });

    // 根据体质算 HP/MP
    const hpBonus = Math.max(0, gameState.stats.体质 - 10);
    const mpBonus = Math.max(0, gameState.stats.智力 - 10);
    gameState.maxHp = 30 + hpBonus * 3;
    gameState.hp    = gameState.maxHp;
    gameState.maxMp = 20 + mpBonus * 2;
    gameState.mp    = gameState.maxMp;

    // 初始金币按出身
    const originGold = { '王都·艾德加德':80, '幽暗密林·艾尔德文':40, '铁炉堡·霍姆加德':100, '边境废墟·破碎谷':20 };
    gameState.gold = originGold[origin] || 50;

    // 加载世界设定
    const world = WORLDS.find(w => w.key === selectedWorld);
    gameState.worldSetting = world?.setting || '';

    // 初始化物品栏
    gameState.inventory = [
      { id:'pouch', name:'钱袋', emoji:'💰', desc:'装着你的金币', qty:1 },
      { id:'ration', name:'干粮', emoji:'🍞', desc:'维持生命的干粮', qty:3 },
      { id:'rope', name:'绳索', emoji:'🪢', desc:'30米坚韧绳索', qty:1 },
      { id:'torch', name:'火把', emoji:'🔥', desc:'可燃烧1小时', qty:2 },
    ];
  }

  saveGame();

  // 创建/更新 AI 客户端
  aiClient = new AIClient(gameState.config);
  if (!aiClient.isValid()) {
    showSystemEntry('⚠️ 未配置 AI 端点，部分功能受限。请在设置（⚙️）中填写 API 信息。');
  }

  // 切换界面
  document.getElementById('intro-screen').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');

  renderStatusBar();
  generateOpening();
}

async function generateOpening() {
  // 检查是否有历史记录（续档）
  if (gameState.fullLog.length > 0) {
    showSystemEntry('🔄 恢复上次进度…');
    renderHistory();
    return;
  }

  const world = WORLDS.find(w => w.key === gameState.world);
  document.getElementById('story-content').innerHTML = '';
  showTyping(true);

  // 先用本地开场白
  const openings = {
    'classic-fantasy': `🌅 **${gameState.character.name}，你缓缓睁开眼睛。**

你发现自己站在 **${gameState.character.origin}** 的城门口，晨雾正缓缓散去。远处教堂的钟声敲响第一声，新的一天开始了。

作为一位 **${gameState.character.race} ${gameState.character.cls}**，你即将踏上这段未知的旅程。

你摸了摸口袋，确认了你的装备：
- 💰 钱袋（内有 **${gameState.gold}** 金币）
- 🍞 干粮 ×${gameState.inventory.find(i=>i.id==='ration')?.qty || 3}
- 🪢 绳索 ×${gameState.inventory.find(i=>i.id==='rope')?.qty || 1}
- 🔥 火把 ×${gameState.inventory.find(i=>i.id==='torch')?.qty || 2}

**城市在呼唤着你。你会走向何方？**`,

    'dark-fantasy': `🌑 **灰烬笼罩着这片大地。**

你在一片废墟中醒来，头痛欲裂。记忆如同破碎的镜面，你只记得自己的名字——**${gameState.character.name}**。

这里是 **${gameState.character.origin}**，一座被遗忘的聚落。远处传来野兽的低吼，空气中弥漫着硫磺与腐朽的气息。

你检查了自己的状态：
- ❤️ ${gameState.hp}/${gameState.maxHp} HP | 💙 ${gameState.mp}/${gameState.maxMp} MP
- 💰 ${gameState.gold} 金币
- 装备：${gameState.inventory.map(i => i.emoji + i.name).join('、')}

**黑暗正在逼近。你决定做什么？**`,

    'cyberpunk': `🌃 **2157年，新上海。**

你从一家廉价胶囊旅馆的床上醒来。天花板上残留的全息广告残影还在闪烁。窗外，霓虹雨在下。

作为 **${gameState.character.race} 出身**的 **${gameState.character.cls}**，你知道这座城市从不缺机会——只缺愿意付出代价的人。

你的义体接口微微发热。账户余额：**${gameState.gold}** 信用点。

**今天你想做什么？接任务？找黑客？还是去见一个人？**`,

    'wuxia': `🏔️ **九州，乱世。**

你踏出了 **${gameState.character.origin}** 的山门。身后是师父的嘱托，前方是刀光剑影的江湖。

身为 **${gameState.character.race} 血脉**的 **${gameState.character.cls}**，你的身上背着师父传给你的佩剑，还有几个铜板的路费。

江湖路远，恩怨未了。你会先去哪里？

**天下虽大，总有一个地方等着你。**`,

    'postapoc': `☢️ **废土，第37年。**

你从沉睡的掩体中醒来。应急灯闪烁着红色，氧气存量还有 **12小时**。

外面的世界是什么样了？三十年前的大崩坏之后，没人知道。

你整理了一下装备：
- 🍞 干粮（仅够 ${gameState.inventory.find(i=>i.id==='ration')?.qty || 3} 天）
- 💰 ${gameState.gold} 瓶盖（废土硬通货）
- 🔥 燃烧弹 ×${gameState.inventory.find(i=>i.id==='torch')?.qty || 2}

**推开门，活下去。**`,

    'cosmic-horror': `🌊 **1927年，米德韦斯特。**

你拖着行李箱走下火车，潮湿的海风扑面而来。小镇笼罩在灰蒙蒙的雾中，街上行人稀少，每个人都戴着低垂的帽檐。

你搬到这里是为了开始新生活。至少，你是这么以为的。

旅馆老板给你登记时，眼神闪烁了一下。

> "新来的？……最好夜里别出门。"

**你的旅程，从这句警告开始。**`,
  };

  const openingText = openings[gameState.world] || openings['classic-fantasy'];
  showEntry('narration', openingText);

  // 保存到 fullLog（首轮）
  gameState.fullLog.push({ role: 'assistant', content: openingText });
  gameState.location = gameState.character.origin;
  renderHistory();
  showTyping(false);
  updateQuickActions();

  // 如果用户配置了 AI，可以提示
  if (aiClient && aiClient.isValid()) {
    setTimeout(() => {
      showSystemEntry(`✨ AI 已连接（${gameState.config.model}），你可以自由输入任何行动了！`);
    }, 1500);
  } else {
    setTimeout(() => {
      showSystemEntry('⚙️ 请在右上角设置（⚙️）中配置 AI 端点，解锁 AI 驱动剧情。当前为预设开场。');
    }, 1500);
  }

  saveGame();
}

// ─────────── 历史渲染 ───────────
/* ══════ Bug 3+11: 增量渲染 + 续档全量重绘 ══════ */
let _pendingFullRender = false;

function renderHistory() {
  const container = document.getElementById('story-content');

  if (_pendingFullRender) {
    container.innerHTML = '';
    _pendingFullRender = false;
  }

  const visibleLog  = gameState.fullLog.slice(-RENDER_LIMIT);
  const existingDom = container.querySelectorAll('.story-entry').length;

  // 找到增量起始位置（跳过 dm-state 不显示的条目）
  let renderStart = existingDom;
  for (let i = existingDom; i < visibleLog.length && renderStart < visibleLog.length; i++) {
    if (visibleLog[i].role !== 'dm-state') {
      renderStart = i;
      break;
    }
  }

  for (let i = renderStart; i < visibleLog.length; i++) {
    const entry = visibleLog[i];
    if (entry.role === 'dm-state') continue;

    const div = document.createElement('div');
    div.className = `story-entry ${entryToType(entry.role)}`;
    div.innerHTML = renderMarkdownSimple(entryToText(entry));
    container.appendChild(div);
  }

  setTimeout(() => container.scrollTop = container.scrollHeight, 100);
}

function entryToType(role) {
  if (role === 'player') return 'player';
  if (role === 'system-notice') return 'system';
  return 'narration';
}

function entryToText(entry) {
  if (entry.role === 'player') return `💬 ${entry.content}`;
  return entry.content;
}

// ─────────── 主循环：玩家行动 → AI 剧情 ───────────
async function handlePlayerAction(input) {
  if (!input.trim()) return;
  if (isGenerating) return;

  const action = input.trim();

  showEntry('player', action);
  gameState.fullLog.push({ role: 'player', content: action });
  updateQuickActions();

  if (!aiClient || !aiClient.isValid()) {
    showSystemEntry('⚠️ 未配置 AI 端点，无法生成剧情。请先配置 API（设置 → ⚙️）。');
    return;
  }

  isGenerating = true;
  showTyping(true);

  const messages = buildAIMessages(action);

  try {
    // Bug 5: 指数退避重试，最多 2 次重试
    let content = null;
    let usage   = null;
    const maxRetries = 2;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await aiClient.call(messages);
        content = result.content;
        usage   = result.usage;
        break;
      } catch (e) {
        if (attempt === maxRetries) throw e;
        // 指数退避：1s, 2s
        const waitMs = Math.pow(2, attempt) * 1000;
        showSystemEntry(`⚠️ 请求失败，${waitMs/1000}s 后重试（${attempt+1}/${maxRetries}）…`);
        await new Promise(r => setTimeout(r, waitMs));
      }
    }

    await processAIResponse(content);

    if (usage?.total_tokens) {
      showSystemEntry(`📊 本回合消耗 ${usage.total_tokens} tokens`);
    }

  } catch (e) {
    showSystemEntry(`❌ AI 调用失败（已重试）：${e.message}`);
  } finally {
    isGenerating = false;
    showTyping(false);
    updateQuickActions();
    document.getElementById('action-input').focus();
    saveGame();
  }
}

function buildAIMessages(lastAction) {
  // 压缩历史——只保留最近 30 条，避免超长
  const history = gameState.fullLog.filter(e => e.role === 'player' || e.role === 'assistant');
  const recent  = history.slice(-20);

  const messages = [
    { role: 'system', content: buildSystemPrompt() },
  ];

  // 最近历史（角色名映射：player → user）
  recent.forEach(entry => {
    const role = entry.role === 'player' ? 'user' : entry.role;
    messages.push({ role: role, content: entry.content });
  });

  // 当前行动
  messages.push({ role: 'user', content: lastAction });

  return messages;
}

async function processAIResponse(content) {
  let cleanContent = content;
  let stateUpdate = null;

  // Bug 6: 更宽容的正则——允许 ** 前后有空格，JSON 可以有多行，
  // 也支持 `json` 代码块格式
  // 策略1：匹配 **【状态更新】** 后跟随任意内容直到找到 } 结尾
  let stateMatch = content.match(/\*?\*?\s*【状态更新】\s*\*?\*?\s*([\s\S]*?)(?=\n\n|$)/);
  if (stateMatch) {
    const jsonText = stateMatch[1].trim();
    // 尝试从 jsonText 中提取第一个 { 到最后一个 } 之间的内容
    const curlyMatch = jsonText.match(/\s*\{[\s\S]*\}\s*/);
    if (curlyMatch) {
      try {
        stateUpdate = JSON.parse(curlyMatch[0]);
      } catch(e) { /* 忽略 */ }
      cleanContent = content.replace(stateMatch[0], '').trim();
    }
  }

  // 策略2：检测 json 代码块
  if (!stateUpdate) {
    const jsonBlock = content.match(/```\s*json\s*([\s\S]*?)```/i);
    if (jsonBlock) {
      try {
        stateUpdate = JSON.parse(jsonBlock[1].trim());
        cleanContent = content.replace(jsonBlock[0], '').trim();
      } catch(e) { /* 忽略 */ }
    }
  }

  // 移除【剧情】标签（支持无 ** 包裹的情况）
  cleanContent = cleanContent.replace(/\*?\*?\s*【剧情】\s*\*?\*?\s*/, '').trim();

  showEntry('narration', cleanContent);
  gameState.fullLog.push({ role: 'assistant', content: cleanContent });

  if (stateUpdate) {
    applyStateUpdate(stateUpdate);
    gameState.fullLog.push({ role: 'dm-state', content: JSON.stringify(stateUpdate) });
    renderStatusBar();
  }

  renderHistory();
}

function applyStateUpdate(su) {
  if (su.hp !== undefined)    gameState.hp    = clamp(su.hp, 0, gameState.maxHp);
  if (su.mp !== undefined)    gameState.mp    = clamp(su.mp, 0, gameState.maxMp);
  if (su.gold !== undefined)  gameState.gold  = clamp(su.gold, 0, 99999);
  if (su.level !== undefined) gameState.level = clamp(su.level, 1, 99);
  if (su.xp  !== undefined)   gameState.xp    = su.xp;
  if (su.location)            gameState.location = su.location;

  // 物品添加
  if (su.inventory_add) {
    su.inventory_add.forEach(item => {
      if (typeof item === 'string') {
        gameState.inventory.push({ id: uid(), name: item, emoji:'📦', desc:'', qty:1 });
      } else {
        gameState.inventory.push({ ...item, id: item.id || uid() });
      }
    });
  }

  // 物品移除
  if (su.inventory_remove) {
    su.inventory_remove.forEach(name => {
      gameState.inventory = gameState.inventory.filter(i => i.name !== name);
    });
  }

  // 关系
  if (su.relationships_add) {
    su.relationships_add.forEach(r => {
      gameState.relationships.push({ name:r.name, affinity:r.affinity||0, note:r.note||'' });
    });
  }
  if (su.relationships_update) {
    su.relationships_update.forEach(u => {
      const r = gameState.relationships.find(x => x.name === u.name);
      if (r && u.affinity !== undefined) r.affinity += u.affinity;
    });
  }

  // 任务
  if (su.quests_add) {
    su.quests_add.forEach(q => {
      gameState.quests.push({ ...q, id: q.id || uid() });
    });
  }
  if (su.quests_update) {
    su.quests_update.forEach(u => {
      const q = gameState.quests.find(x => x.id === u.id);
      if (q) {
        if (u.status) q.status = u.status;
        if (u.title)  q.title  = u.title;
      }
    });
  }

  if (su.effects) {
    gameState.effects = su.effects;
  }

  renderStatusBar();
}

// ─────────── 续写按钮 ───────────
async function handleContinue() {
  if (!aiClient || !aiClient.isValid()) {
    showSystemEntry('⚠️ 未配置 AI 端点，无法续写。');
    return;
  }
  if (isGenerating) return;

  isGenerating = true;
  showTyping(true);

  // Bug 7: 明确指令，让 AI 推进时间线和事件，而非只描述环境
  const continuePrompt = `（请推进故事：让时间自然流逝，让事件发生，让 NPC 主动接触玩家或推进任务线。不要只描述环境或重复之前发生过的内容。直接推动剧情向前发展。）`;
  const messages = buildAIMessages(continuePrompt);
  messages[messages.length - 1].content = continuePrompt;

  try {
    let content = null;
    // 重试机制
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        content = (await aiClient.call(messages)).content;
        break;
      } catch(e) {
        if (attempt === 2) throw e;
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }

    let cleanContent = content.replace(/\*?\*?\s*【剧情】\s*\*?\*?\s*/, '').trim();
    showEntry('narration', cleanContent);
    gameState.fullLog.push({ role: 'assistant', content: cleanContent });
    renderHistory();
  } catch(e) {
    showSystemEntry(`❌ 续写失败：${e.message}`);
  } finally {
    isGenerating = false;
    showTyping(false);
    saveGame();
  }
}

// ─────────── UI 函数 ───────────
function showEntry(type, text) {
  const container = document.getElementById('story-content');
  const div = document.createElement('div');
  div.className = `story-entry ${type}`;
  div.innerHTML = renderMarkdownSimple(text);
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showSystemEntry(text) {
  showEntry('system', text);
  gameState.fullLog.push({ role: 'system-notice', content: text });
}

function showTyping(show) {
  const el = document.getElementById('typing-indicator');
  if (show) el.classList.remove('hidden');
  else      el.classList.add('hidden');
}

function renderStatusBar() {
  if (!gameState) return;
  const c = gameState.character;
  document.getElementById('sb-name').textContent = c.name;
  document.getElementById('sb-race').textContent = c.race;
  document.getElementById('sb-class').textContent = c.cls;
  document.getElementById('sb-location').textContent = '📍 ' + gameState.location;
  document.getElementById('sb-hp').textContent = `❤️ ${gameState.hp}/${gameState.maxHp}`;
  document.getElementById('sb-mp').textContent = `💙 ${gameState.mp}/${gameState.maxMp}`;
  document.getElementById('sb-gold').textContent = `💰 ${gameState.gold}`;
  document.getElementById('sb-level').textContent = `⭐ Lv.${gameState.level}`;

  // HP/MP 颜色警告
  const hpEl = document.getElementById('sb-hp');
  if (gameState.hp <= gameState.maxHp * 0.25) hpEl.style.color = 'var(--danger)';
  else hpEl.style.color = 'var(--hp)';
}

function updateQuickActions() {
  const el = document.getElementById('quick-actions');
  const actions = [
    { text: '🗺️ 查看周围', action: '描述我现在周围的环境和可能看到的东西' },
    { text: '👀 观察', action: '仔细观察周围，寻找隐藏的线索和细节' },
    { text: '💬 对话', action: '向附近的NPC打招呼，尝试交谈' },
    { text: '🎒 查看物品', action: '查看我当前的物品栏' },
    { text: '📜 查看任务', action: '回顾我当前的任务状态' },
    { text: '🔍 搜索', action: '仔细搜索这个地方，寻找隐藏的物品或入口' },
    { text: '💤 休息', action: '决定找一个安全的地方休息，恢复状态' },
    { text: '🚶 离开', action: '决定离开当前地点，探索新的区域' },
  ];
  el.innerHTML = actions.map(a =>
    `<button class="quick-btn" onclick="handleQuickAction('${escHtml(a.action)}')">${a.text}</button>`
  ).join('');
}

window.handleQuickAction = function(action) {
  const input = document.getElementById('action-input');
  input.value = action;
  handlePlayerAction(action);
  input.value = '';
};

// ─────────── 模态框 ───────────
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function renderInventory() {
  const el = document.getElementById('inventory-list');
  if (gameState.inventory.length === 0) {
    el.innerHTML = '<div style="text-align:center;color:var(--text-dim);padding:20px;">🎒 物品栏为空</div>';
    return;
  }
  el.innerHTML = gameState.inventory.map(item => `
    <div class="list-item">
      <div class="li-main">
        <span class="li-emoji">${item.emoji}</span>
        <div>
          <div class="li-name">${escHtml(item.name)}</div>
          <div class="li-meta">${escHtml(item.desc || '')}</div>
        </div>
      </div>
      <div class="li-val neutral">×${item.qty || 1}</div>
    </div>
  `).join('');
}

function renderRelationships() {
  const el = document.getElementById('relationships-list');
  if (gameState.relationships.length === 0) {
    el.innerHTML = '<div style="text-align:center;color:var(--text-dim);padding:20px;">👥 尚无结识的人物</div>';
    return;
  }
  el.innerHTML = gameState.relationships.map(r => {
    const cls = r.affinity >= 30 ? 'good' : (r.affinity <= -20 ? 'bad' : 'neutral');
    const emoji = r.affinity >= 30 ? '💚' : (r.affinity <= -20 ? '💔' : '👤');
    return `
    <div class="list-item">
      <div class="li-main">
        <span class="li-emoji">${emoji}</span>
        <div>
          <div class="li-name">${escHtml(r.name)}</div>
          <div class="li-meta">${escHtml(r.note || '')}</div>
        </div>
      </div>
      <div class="li-val ${cls}">${r.affinity >= 0 ? '+' : ''}${r.affinity}</div>
    </div>`;
  }).join('');
}

function renderQuests() {
  const el = document.getElementById('quests-list');
  if (gameState.quests.length === 0) {
    el.innerHTML = '<div style="text-align:center;color:var(--text-dim);padding:20px;">📜 暂无任务</div>';
    return;
  }
  el.innerHTML = gameState.quests.map(q => {
    const badge = q.status === 'completed'
      ? '<span class="badge badge-active">✅ 已完成</span>'
      : q.status === 'failed'
        ? '<span class="badge badge-inactive">❌ 失败</span>'
        : '<span class="badge badge-ongoing">🔶 进行中</span>';
    return `
    <div class="list-item">
      <div class="li-main">
        <span class="li-emoji">📜</span>
        <div>
          <div class="li-name">${escHtml(q.title)}</div>
          <div class="li-meta">ID: ${q.id}</div>
        </div>
      </div>
      <div class="li-val">${badge}</div>
    </div>`;
  }).join('');
}

// ─────────── 事件绑定 ───────────
document.addEventListener('DOMContentLoaded', () => {
  initIntro();

  // 开场页提交
  document.getElementById('setup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    startGame();
  });

  // 行动提交
  document.getElementById('action-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('action-input');
    handlePlayerAction(input.value);
    input.value = '';
    input.focus();
  });

  // 续写
  document.getElementById('btn-continue').addEventListener('click', handleContinue);

  // 快速操作按钮（上面已用 onclick）

  // 模态框
  document.getElementById('btn-inventory').addEventListener('click', () => {
    renderInventory(); openModal('inventory-modal');
  });
  document.getElementById('inv-close').addEventListener('click', () => closeModal('inventory-modal'));
  document.getElementById('inventory-modal').querySelector('.modal-backdrop').addEventListener('click', () => closeModal('inventory-modal'));

  document.getElementById('btn-relationships').addEventListener('click', () => {
    renderRelationships(); openModal('relationships-modal');
  });
  document.getElementById('rel-close').addEventListener('click', () => closeModal('relationships-modal'));

  document.getElementById('btn-quests').addEventListener('click', () => {
    renderQuests(); openModal('quests-modal');
  });
  document.getElementById('qst-close').addEventListener('click', () => closeModal('quests-modal'));

  // 设置
  document.getElementById('btn-settings').addEventListener('click', () => {
    document.getElementById('set-api-url').value = gameState.config.baseUrl;
    document.getElementById('set-api-key').value = gameState.config.apiKey;
    document.getElementById('set-api-model').value = gameState.config.model;
    document.getElementById('set-temp').value = gameState.config.temp;
    document.getElementById('set-max-tokens').value = gameState.config.maxTokens;
    openModal('settings-modal');
  });
  document.getElementById('settings-close').addEventListener('click', () => closeModal('settings-modal'));
  document.getElementById('settings-modal').querySelector('.modal-backdrop').addEventListener('click', () => closeModal('settings-modal'));

  document.getElementById('save-settings').addEventListener('click', () => {
    gameState.config.baseUrl = document.getElementById('set-api-url').value.trim();
    gameState.config.apiKey  = document.getElementById('set-api-key').value.trim();
    gameState.config.model   = document.getElementById('set-api-model').value.trim();
    gameState.config.temp    = parseFloat(document.getElementById('set-temp').value) || 0.9;
    gameState.config.maxTokens = parseInt(document.getElementById('set-max-tokens').value) || 2048;

    if (aiClient) aiClient.update(gameState.config);

    saveGame();
    closeModal('settings-modal');
    showSystemEntry(`✅ 设置已保存。AI 端点: ${gameState.config.model || '未配置'}`);
  });

  document.getElementById('reset-game').addEventListener('click', () => {
    if (confirm('确定要重置游戏吗？所有进度将永久删除。')) {
      clearGame();
      gameState = newGameState();
      aiClient = null;
      selectedWorld = null;
      statPoints = 20;
      STAT_NAMES.forEach(n => { baseStats[n] = 10; document.getElementById(`stat-val-${n}`).textContent = '10'; });
      document.getElementById('points-left').textContent = '20';
      document.querySelectorAll('.world-card').forEach(el => el.classList.remove('selected'));
      document.getElementById('game-screen').classList.remove('active');
      document.getElementById('intro-screen').classList.add('active');
      document.getElementById('story-content').innerHTML = '';
    }
  });

  document.getElementById('btn-save').addEventListener('click', () => {
    saveGame();
    showSystemEntry('💾 游戏进度已保存');
  });

  // Bug 8: Esc 只在有模态框打开时关闭，不干扰输入框
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal:not(.hidden)');
      if (activeModal) {
        activeModal.classList.add('hidden');
      }
    }
  });

  // 检查是否有存档，如果有则提示续档
  const saved = loadGame();
  if (saved && saved.character?.name) {
    // 用户可以直接按"继续上次冒险"
    document.getElementById('start-btn').textContent = '🔄 继续上次冒险';
  }
});

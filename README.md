# 知乎修改器（NopantsNobra 定制分支）

一个运行在桌面浏览器脚本管理器中的知乎用户脚本，通过注入样式、DOM 处理与可选的接口拦截，自定义知乎桌面版页面的显示内容、布局与浏览行为。

| 项目 | 说明 |
| --- | --- |
| 版本 | **5.25**（`package.json` 与 `index.js` 头部一致） |
| 许可证 | MIT |
| 仓库 | `https://github.com/NopantsNobra/zhihu-custom.git`（私有 fork；本 README 描述的是该分支的当前实现） |
| 上游 | `liuyubing233/zhihu-custom`，仅作来源说明；上游的文档、发布地址与截图不适用于本分支 |
| 脚本名 | 知乎修改器🤜持续更新🤛努力实现功能最全的知乎配置插件 |

## 快速开始

### 安装

1. 在桌面浏览器安装脚本管理器：**Tampermonkey 或 Violentmonkey 均可**。脚本头的 `@compatible` 同时声明了这两种管理器，不要求必须先安装其中某一个。
2. 在管理器中新建用户脚本，导入仓库根目录已构建的 `index.js`（也可把文件重命名为 `*.user.js` 后直接拖入管理器安装）。
3. 启用脚本并刷新知乎页面。脚本在 `@run-at document-start` 阶段注入，无需等待页面完全加载。
4. 通过页面右下角齿轮按钮、脚本管理器菜单中的「⚙️ 设置」，或 `Shift + .`（美式键盘，即 `>`）打开设置面板。

脚本元信息（取自 `index.js` 头部，由 `build-config/esbuild.build.js` 依据 `package.json` 生成）：

| 字段 | 值 |
| --- | --- |
| `@name` | 知乎修改器🤜持续更新🤛努力实现功能最全的知乎配置插件 |
| `@version` | 5.25 |
| `@author` / `@license` | lyb233 / MIT |
| `@match` | `*://*.zhihu.com/*` |
| `@run-at` | `document-start` |
| `@grant` | `unsafeWindow`、`GM_info`、`GM_setValue`、`GM_getValue`、`GM.getValue`、`GM.setValue`、`GM.deleteValue`、`GM_registerMenuCommand`（共 8 项） |
| `@compatible` | `edge` / `chrome` / `firefox` / `safari` × `Violentmonkey` / `Tampermonkey`（共 8 组） |

> `@compatible` 是声明性标记，表示作者声明的目标组合，**不是**已逐项真机验证的能力保证。

### 打开设置面板与快捷键

| 操作 | 行为 | 代码位置 |
| --- | --- | --- |
| 点击右下角齿轮 ⚙︎ | 唤起 / 收起设置抽屉 | `src/index.html` 的 `#CTZ_OPEN_CLOSE` |
| 脚本管理器菜单「⚙️ 设置」 | 唤起设置抽屉 | `src/index.ts:45` `GM_registerMenuCommand` |
| `Shift + .`（`>` / `》`） | 唤起设置抽屉；`hotKey` 默认开启，可在「通用」页关闭 | `src/index.ts:313` |
| `Escape` | 关闭弹窗（含可选关闭评论弹窗） | `src/index.ts:319` |
| `o` | 对当前焦点所在条目展开阅读全文 | `src/index.ts:329` |
| `←` / `→` | 在静态图片大图预览中切换上一张 / 下一张 | `src/components/image.ts:115` |

主 `keydown` 监听绑在 `window` 上，只比较 `event.key`，**不判断任何修饰键、不调用 `preventDefault`、也不判断焦点元素是否为输入框**。Mac 用户无需为 Ctrl / ⌘ 做额外设置；副作用见「已知限制」。

### 生效方式

- 尺寸、主题、隐藏样式、自定义 CSS 等修改后立即重算。
- 面板标注「修改后刷新页面生效」或菜单提示「更改后请重新刷新页面」的分组（显示修改、屏蔽内容、黑名单）需要刷新知乎页面。
- 配置由 `localStorage` 与 `GM.setValue` 双写保存（`src/tools/storage.ts` 的 `myStorage.getConfig()` / `updateConfig()`，键名 `pfConfig`）；浏览记录保存在 `pfHistory`，「推荐列表缓存」与「浏览历史记录」各最多缓存 500 条。跨浏览器迁移请使用配置导出 / 导入。

## 主要功能

**面板真实菜单结构**（`src/index.html:29` 的 `#CTZ_DIALOG_MENU` 下 11 个 `div[data-href]`，内容区为 `:51` 的 `#CTZ_DIALOG_MAIN`；仓库中没有 `ctz-menu` 类名）：

通用 / 高性能 / 悬浮模块 / 隐藏模块 / 屏蔽内容 / 黑名单 / 页面尺寸 / 颜色 / 推荐列表缓存 / 浏览历史记录 / 默认功能

下表左列是按主题整理的**功能说明分类**，不是面板菜单名；右列才是对应的真实菜单，两者不要混为一谈：

| 功能分组（说明用分类） | 对应面板菜单 | 可配置项概览 |
| --- | --- | --- |
| 通用设置 | 通用 | 标签标题与图标、接口拦截开关、快捷键开关、显示修改下拉与开关、自定义 CSS、配置操作按钮 |
| 高性能模式 | 高性能 | 推荐列表 / 回答页高性能模式 |
| 悬浮模块 | 悬浮模块 | 齿轮定位、收起按钮悬浮、菜单栏切换模块悬浮 |
| 隐藏模块 | 隐藏模块 | 8 个分组、115 个隐藏项、7 条组合规则 |
| 黑名单 | 黑名单 | 黑名单与标签、同步 / 清空、导入导出、9 项通用开关 |
| 页面尺寸 | 页面尺寸 | 五类页面宽度、字体、图片 / 视频尺寸、运行自检 |
| 主题颜色 | 颜色 | 主题与浅 / 深色配色、文字颜色、原创高亮 |
| 配置操作 | 通用（页顶部按钮区） | 极简模式、恢复默认、配置导入导出 |
| 屏蔽内容 | 屏蔽内容 | 通用 / 列表 / 回答三类屏蔽与阈值 |
| 屏蔽词 | 屏蔽内容（页内小节） | 标题屏蔽词、内容屏蔽词 |
| 默认功能 | 默认功能 | 随脚本附带、无需开启的功能 |

### 通用设置（面板「通用」）

- **基本设置**：知乎搜索输入框、返回知乎主页、去除浏览器标签上「XX 条私信 / 未读消息」提示、自定义网页标签名称与图标；`接口拦截` 开关（默认开启）、`使用快捷键打开修改器` 开关（默认开启）。
- **显示修改（下拉）**：

  | 设置 | 选项 |
  | --- | --- |
  | 购物链接显示方式 | 默认 / 仅文字 / 隐藏 |
  | 替换「知乎直达 ✦」为搜索 | 不替换 / 去除知乎直达跳转 / 知乎 / 必应 / 百度 / 谷歌 |
  | 回答和文章中的视频显示方式 | 默认 / 修改为链接 / 隐藏视频·过滤视频回答 |
  | 问题页面 - 回答收起/展开状态 | 默认 / 收起长回答 / 自动展开所有回答 |
  | 用户主页 - 内容收起/展开状态 | 默认 / 自动展开内容 |

- **显示修改（开关）**：列表标题类别标签（问题 / 文章 / 视频 / 想法）、点击高亮边框、「···」按钮移到最右侧、显示「直达问题」按钮、操作栏仅显示数字和图标、回答顶部实时赞同数、一键获取回答链接、回答 / 文章顶部「导出当前内容/回答」按钮、列表 / 问题 / 回答 / 文章 / 用户主页的发布与修改时间、取消评论输入框自动聚焦、`Esc` 关闭评论弹窗、点击空白处关闭评论弹窗。
- **自定义样式**：输入自定义 CSS 并保存为 `customizeCss`。

### 高性能模式（面板「高性能」）

| 设置 | 行为 |
| --- | --- |
| 推荐列表高性能模式 | 推荐列表最多保留 50 条，超出则删除之前内容 |
| 回答页高性能模式 | 回答列表最多保留 30 条，超出则删除之前回答 |

### 悬浮模块（面板「悬浮模块」）

- 修改器弹出图标 ⚙︎ 定位方式：左右 / 上下。
- 回答内容「收起」按钮悬浮，可设置距右侧的位置。
- 菜单栏切换模块悬浮，可分别显示「关注 / 推荐 / 热榜 / 专栏 / 圈子」入口。

### 隐藏模块（面板「隐藏模块」）

隐藏配置在 5.25 拆分为 `src/components/hidden/configs/` 下按分组的数据文件，共 **8 个分组、115 个隐藏项、7 条组合规则**，与拆分前逐项等价：

| 分组 | 项数 | 覆盖范围（节选） |
| --- | --- | --- |
| 通用 | 14 | 广告、LOGO、顶部悬浮模块、顶部菜单栏各项、选中文字弹窗、知学堂推广商品模块 |
| 操作栏 | 15 | 推荐 / 关注、搜索页、问题页、文章、收藏夹、用户主页的操作栏及底部悬浮条，评论回复 / 点赞 / 底部信息 |
| 列表页面 | 28 | 创作中心、圈子、盐选作者平台、推荐关注、分类圆桌、更多分类、知乎指南、大家都在搜、付费咨询；列表切换、列表内容 / 视频 / 图片、热榜元素、搜索页模块 |
| 问答页面 | 33 | 问题页标题与按钮、回答人信息、回答底部时间与标签、右侧信息栏各卡片 |
| 文章专栏 | 10 | 关联话题、标题图片、所属专栏、推荐阅读、作者信息、关于作者、大家都在搜 |
| 用户主页 | 7 | 付费咨询 / 认证成就、出版作品、创作中心、关注卡片、关注内容与赞助、右侧操作、知乎指南 |
| 收藏夹 | 5 | 创作中心、推荐关注、圆桌入口、更多分类、知乎指南 |
| 话题 | 3 | 浏览 / 讨论量、父子话题、知乎指南 |

- 「盐选作者平台」一项自 5.24 起同时按卡片标题兼容「盐言作者平台」（`src/components/hidden/append-style.ts`）。隐藏判定按配置值拼接 CSS，不读取 DOM 实际可见性。
- 7 条组合规则在一组开关全部勾选时追加整块样式（用户主页右列、搜索页侧栏、主页列表切换栏、话题右栏、回答页右栏等）。
- 主页右栏九项（创作中心、圈子、盐选作者平台、推荐关注、分类圆桌、更多分类、知乎指南、大家都在搜、付费咨询）全部隐藏时，折叠右栏空白列并让主列居中铺满；任一项恢复立即还原两列布局。

### 黑名单（面板「黑名单」，需开启接口拦截，更改后刷新）

- 通用设置 9 项：列表和回答 / 用户主页置顶 / 评论区「屏蔽用户」按钮；屏蔽黑名单用户发布的内容（问题、回答、文章）与评论；用 `*` 替换其内容；列表回答 / 评论区的黑名单标识；标识显示标签分类。
- 黑名单标签：屏蔽用户后弹出标签选择、添加自定义标签。
- 知乎黑名单与本地黑名单列表；`同步知乎黑名单`、`清空知乎黑名单`；黑名单部分配置的导出与「导入并合并」（`.txt`）。

### 页面尺寸（面板「页面尺寸」）

- **页面内容宽度**：列表 / 回答 / 文章 / 用户主页 / 收藏夹，固定 600–1500 px 或按浏览器宽度 20–100% 百分比设置（最小显示宽度 600 px）；`评论弹窗匹配页面宽度`。
- **运行自检**：入口为「页面尺寸 → 布局与隐藏自检 → 运行自检」，结果输出到浏览器 Console（F12），不是页面弹窗；详见「使用步骤」。
- **字体大小**：列表 / 回答 / 文章各自的标题与内容共 6 项，以及内容行高。
- **图片尺寸**：回答和文章图片尺寸（默认 / 自定义 / 原图，宽度 0–1000）；图片最大高度限制（0–1000，开启后宽度限制失效）；`弹窗打开动图`。
- **视频尺寸**：列表视频回答尺寸（默认 / 自定义，宽度 0–1000）。

### 主题颜色（面板「颜色」）

- 主题：浅色 / 深色 / 自动（自动跟随系统 `prefers-color-scheme`）。
- 浅色主题 8 色：默认、黄、绿、灰、紫、橙、浅橙、红；深色主题 8 色：默认、深色一 / 二 / 三、高对比度蓝 / 红 / 绿、纯黑。
- 修改文字颜色；关注列表高亮原创内容及其背景色。
- 5.25 起在 `:root` 上写入 `color-scheme` 跟随主题，并监听 `prefers-color-scheme` 的 `change`（`addEventListener`，不支持时降级 `addListener`）；系统主题变化后重算背景、尺寸与深色样式。

### 配置操作（位于「通用」页）

| 按钮 | 行为 |
| --- | --- |
| 启用极简模式 | 以 `CONFIG_SIMPLE` 覆盖当前配置，隐藏大部分模块，仅保留列表 / 回答 / 文章主体；会覆盖现有配置 |
| 恢复默认配置 | 以 `CONFIG_DEFAULT` 覆盖当前配置；会覆盖现有配置 |
| 配置导出 | 把当前 `pfConfig` 导出为 `.txt` 文件 |
| 配置导入 | 选择 `.txt` 文件导入，写入后自动刷新页面 |
| 自定义样式 | 保存自定义 CSS |

### 屏蔽内容（面板「屏蔽内容」，更改后刷新）

| 区域 | 可配置项 |
| --- | --- |
| 通用屏蔽 | 屏蔽选自盐选专栏的内容（需接口拦截）；显示「不感兴趣」按钮（需接口拦截），并把被屏蔽内容记入「不感兴趣的内容」列表 |
| 列表内容屏蔽 | 顶部活动推广、匿名用户提问（需接口拦截）、屏蔽自己的操作、过滤关注人赞同回答 / 文章 / 关注问题、过滤邀请回答 / 商业推广 / 文章 / 视频 / 想法、低赞内容屏蔽与点赞阈值 |
| 回答内容屏蔽 | 匿名用户回答、虚构创作标签回答、电子书标签回答、低赞回答与点赞阈值 |

### 屏蔽词（位于「屏蔽内容」页）

- 标题屏蔽词：匹配列表标题，输入后回车添加、点击屏蔽词删除，不区分大小写。
- 内容屏蔽词：匹配列表与回答页内容，同样回车添加、点击删除。

### 默认功能（面板「默认功能」，无需主动开启）

外链直接跳转、移除登录提示弹窗、一键移除所有屏蔽话题、视频下载、收藏夹内容导出为 PDF（需接口拦截）、个人主页关注订阅快捷取消关注、预览静态图片方向键切换、用户主页回答 / 文章导出当前页内容（需接口拦截）、一键邀请、解除禁止转载限制（复制时忽略禁止转载提示）。

面板另有「推荐列表缓存」「浏览历史记录」两页，各最多缓存 500 条（推荐列表缓存包含已过滤项），可分别一键清空。

### 5.25 新增

| 变更 | 说明 |
| --- | --- |
| `:has()` 类名回退 | 为不支持 `:has()` 的浏览器补齐 `@supports not selector(:has(*))` 降级块（`src/components/size/my-size.ts:267-278`）；`syncHasFallbackClasses()` 维护 `ctz-home-page`、`ctz-question-page`、`ctz-home-rail`、`ctz-question-shell`、`ctz-question-col` 共 5 个结构类（清单见 `my-size.ts:264-265`，常量与动态维护见 `src/tools/browser.ts:14-18, 42-43, 53, 63, 69`），用于保留宽度与主页布局补丁；旧版 Firefox 的解析行为未查证、需真机确认 |
| `color-scheme` 跟随主题 | 见「主题颜色」；同时补上 `prefers-color-scheme` 的 `change` 监听 |
| 隐藏配置拆分 | 单文件拆为按分组的数据文件，115 项 / 8 分组 / 7 组合规则，序列化结果与拆分前等价 |
| 运行自检 | 唤起设置面板 → 左侧菜单「页面尺寸」（`#CTZ_VERSION`）→ 分组「布局与隐藏自检」→ 按钮「运行自检」（`src/index.html:471-480`，按钮在 `:479`）；结果输出到浏览器 Console（F12）分组，不是页面弹窗 |
| 主页右栏折叠 | 九项全部隐藏时收掉右栏空白列、主列居中铺满；任一项恢复立即还原 |

## 使用步骤

1. **首次安装**：按「快速开始」安装并启用 `index.js` → 刷新知乎 → 用齿轮或 `Shift + .` 打开面板 → 面板右上显示 `version: 5.25` 即表示脚本已加载。
2. **日常调整**：在左侧菜单选择分组 → 勾选开关或填写数值 / 文本 → 开关类设置即时写入配置；遇到面板红字「修改后刷新页面生效」或菜单提示「更改后请重新刷新页面」时刷新知乎页面。
3. **配置导入导出**：在「通用」页点「配置导出」得到 `.txt` 备份；换浏览器或换设备时点「配置导入」选择该文件，导入后页面自动刷新。启用极简模式或恢复默认配置会覆盖当前配置，操作前建议先导出。
4. **运行自检**：唤起设置面板 → 左侧菜单「页面尺寸」（`#CTZ_VERSION`）→ 分组「布局与隐藏自检」→ 点「运行自检」→ 按 F12 查看 Console 中名为「知乎修改器」自检报告的分组。**结果输出到 Console，不是页面弹窗**；页面另给出「N 项异常 / N 条提示」的提示条。自检报告包含：
   - 时间、页面 URL、浏览器 UA、是否支持 `:has()`；
   - 期望宽度（列表 / 回答）与 `.Topstory-container`、`.Topstory-mainColumn`、`.QuestionPage`、`.Question-mainColumn` 的实测宽度、左右边距与计算宽度；
   - 3 张样式表 `CTZ_STYLE_VERSION` / `CTZ_STYLE_HIDDEN` / `CTZ_STYLE_BACKGROUND` 是否注入及其字符数；
   - 九个右栏开关状态、「九项全隐藏」结论、右栏状态（容器 / 主列 / 右栏列是否识别、右栏类名、右栏与主列宽度、折叠是否生效）；
   - 「九项 DOM 命中」：九个右栏模块锚点各自的 DOM 节点数；
   - 「按标题隐藏标记数」；
   - 「异常」与「提示」：例如自定义 CSS 含 `width + !important` 可能覆盖宽度、主页找不到 `.Topstory-mainColumn`、九项全隐藏但右栏未折叠、仍有模块可见却处于折叠状态、按标题兜底未命中等。

   完整报告对象可在 Console 中右键复制，便于反馈问题。

## 支持环境

| 浏览器 | 原生支持 CSS `:has()` | 说明 |
| --- | --- | --- |
| Chrome / Edge（Chromium 系） | ≥ 105 | 使用原生 `:has()` 规则 |
| Firefox | ≥ 121 | 使用原生 `:has()` 规则 |
| Safari | ≥ 15.4 | 使用原生 `:has()` 规则 |
| Firefox < 121 | 不支持 | 脚本内置两层回退：CSS 侧 `@supports not selector(:has(*))` 降级块（`src/components/size/my-size.ts:267-278`）与 JS 侧 `CSS.supports()` 检测后补结构类（`src/tools/browser.ts:36-77`、`syncHasFallbackClasses()`）。降级为等价近似，细节样式不保证逐像素一致；`selector()` 函数语法在旧 Firefox 上的解析行为未查证，是否完整生效需真机确认 |

- **回退实现与边界**：CSS 侧 `@supports not selector(:has(*))` 降级块（`src/components/size/my-size.ts:267-278`）与 JS 侧 `CSS.supports()` 检测后添加 `ctz-*` 结构类（`src/tools/browser.ts:36-77`、`86-92`）共同用于保留宽度与主页布局补丁。但 `selector()` 函数语法在旧版 Firefox 中的起始支持版本、以及旧版 Firefox 解析该 at-rule 失败时降级块是否被整块忽略，**均未查证、需真机确认**，因此不把「补丁一定生效」写成确定结论；仓库 `build-config/public/CHANGELOG_LIST.md:7` 与 `my-size.ts:259-265` 注释里的「旧版 Firefox 下不再整体失效」是开发者意图声明，不是验证结果。
- `:root{color-scheme}` 属性首次支持版本：Chrome / Edge ≥ 81、Firefox ≥ 96、Safari ≥ 13（MDN browser-compat-data `css/properties/color-scheme.json`，2026-11-13 核对）。部分指南写的 Chrome 98 是 `only` 关键字的首次支持版本或 Baseline「广泛可用」口径，不是本属性门槛；脚本 `src/components/background/background.ts:60` 只写 `light` / `dark`，不涉及 `only`。
- 表中版本门槛是 `:has()` / `color-scheme` 的浏览器能力门槛，**低于门槛不代表脚本无法运行**：脚本不因 `:has()` 缺失而中止，只是原生规则失效并进入 v5.25 回退路径（回退在旧版 Firefox 上的解析行为未查证，见上）。
- 上表的 `:has()` 与 `color-scheme` 版本门槛不是本脚本的已知限制：v5.25 已为不支持 `:has()` 的浏览器补齐回退，`color-scheme` 也已跟随主题并监听系统主题变化。
- 脚本头的 8 组 `@compatible` 只写了浏览器与管理器名称、不带最低版本，是声明性标记而非逐项真机验证的能力保证；实际可用版本口径见上表，兼容性请以本节与「已知限制」的条件描述为准。
- `@match` 为 `*://*.zhihu.com/*`，但主要初始化只在 `www.zhihu.com` 与 `zhuanlan.zhihu.com` 两个主机名下进行（`src/misc/index.ts` 的 `HTML_HOOTS`）；在 iframe 内不初始化面板与主功能（`src/index.ts:55` 判断 `window.frameElement`）。
- 需要脚本管理器提供 `GM_*` / `GM.*` API 与 `@run-at document-start` 支持。
- 移动版是上游的另一个独立项目，不是本仓库的产物；本仓库只构建桌面版 `index.js`。

## 注意事项

1. **接口拦截默认开启**（`src/config/index.ts:182` 的 `fetchInterceptStatus: true`）。若启用后出现「知乎页面无法显示数据」，先到「通用」页关闭接口拦截（沿用 `Q&A.md` 第 5 条）；关闭后依赖拦截的功能（黑名单、盐选专栏屏蔽、「不感兴趣」按钮、匿名用户提问屏蔽、导出 PDF 等）将不可用：面板会禁用标注了接口拦截依赖的开关，导出类按钮也不再出现。

   ![接口拦截开关](static/not-fetch.png)

2. **「弹窗打开动图」与修改图片的脚本 / 插件冲突**：若同时使用修改图片的脚本，不要开启此项（`Q&A.md` 第 7 条）。
3. **Firefox 注入上下文**：在 Firefox 上，若用户脚本管理器因页面 CSP 把脚本注入到内容脚本上下文（Violentmonkey content / Tampermonkey `USERSCRIPT_WORLD`），脚本对 `unsafeWindow.fetch` 的替换可能不生效，接口拦截相关功能可能失效。可先用「运行自检」确认样式表与配置已正常加载（自检不检测注入模式），再检查管理器的注入世界设置。
4. **快捷键不区分 Ctrl / ⌘**：主 `keydown` 只比较 `event.key`，不判断修饰键、不调用 `preventDefault`；Mac 用户无需额外设置。仓库中唯一的修饰键判断位于「替换知乎直达为搜索」的链接点击处理（`src/components/zhida-to-search.ts:39`），`event.metaKey || event.ctrlKey || event.shiftKey` 三者并列。
5. **Safari 的历史注意事项尚未查证**：旧 `Q&A.md` 第 8 条记载「Safari 需手动删除脚本头的 `@grant unsafeWindow`」。当前代码在 `src/tools/browser.ts:2-11` 定义 `isSafari`、并在 `src/index.ts:98` 使用 `isSafari ? window : unsafeWindow` 分支，`index.js` 头部仍声明该 `@grant`；**原注意事项是否仍必要未做 Safari 真机验证，需真机确认**，不要据此断言已失效或仍必需，如仍无法运行请附上「运行自检」的 Console 报告反馈。此条只针对 Safari，**不要外推到 Firefox**：Firefox UA 下 `src/tools/browser.ts:2-11` 返回 `isSafari=false`，`src/index.ts:98` 取 `unsafeWindow`，删除该 `@grant` 后其是否仍可用未查证。
6. **配置会覆盖**：极简模式与恢复默认配置直接覆盖 `pfConfig`；跨浏览器 / 跨设备同步请使用配置导出与导入。
7. **生效时机**：面板中标注「修改后刷新页面生效」的项需要刷新知乎页面；部分设置在 SPA 换页时不会立即重算，见「已知限制」。

## 已知限制

1. **SPA 换页时部分设置不立即重算（全平台）**：`src/index.ts:267-268` 监听了 `popstate` 与 `pushState`，但全仓库没有对应的 `pushState` 事件派发（仅派发 `resize` 与鼠标事件），因此知乎通过 `history.pushState` 换页时不会触发 `changeHistory` 重算；刷新页面可恢复。
2. **设置面板的滚动条与滑块在部分浏览器 / 系统下使用系统默认外观**：脚本只提供 `dialog.less:58-73` 的 `::-webkit-scrollbar*` 与 `common.less:234`、`range.less:34-38` 的 `::-webkit-slider-thumb`，全 `src/styles/` 没有 `scrollbar-width` / `scrollbar-color`。Firefox 不支持 `::-webkit-scrollbar`（MDN 兼容表已查证）；当计算后的 `scrollbar-width` 非 `auto` 时浏览器会忽略 `::-webkit-scrollbar*`，二者互斥、不能简单并列；滑块伪元素 `::-webkit-slider-thumb` 未单独查证。macOS overlay 滚动条下的表现只有二手资料，**待真机确认**，不写作已验证事实。
3. **输入框内可能误触快捷键（全平台）**：`src/index.ts:308-338` 不检查 `activeElement` 是否为输入控件，也不阻止默认行为，在输入框里输入 `>` / `o` 或按左右方向键时可能触发设置抽屉、展开阅读全文或切图。
4. **依赖知乎的类名与标题文本（全平台）**：部分隐藏与识别逻辑依赖知乎 CSS Modules 哈希类名（如 `css-19idom`、`CreateSaltCard`）以及卡片标题文本；知乎改版后可能临时失效。隐藏判定基于配置值而非 DOM 实际可见性（`src/components/hidden/append-style.ts` 按 `config[hiddenItem.value]` 拼接 CSS），这是 5.24 回归后的取舍。
5. **右栏折叠按配置值判定**：`syncHomeSidebarCollapse()` 用 `HOME_SIDEBAR_KEYS.every(...)` 判断九个开关；若某项 CSS 隐藏已失效，右栏仍会被折叠。可用自检报告里的「九项 DOM 命中」与「右栏状态」定位。
6. **局部功能未做 macOS Firefox 真机验证**：PDF 导出、视频下载、弹窗、外链 favicon 等未在 macOS Firefox 上验证。
7. **验证方式**：本仓库的验证以静态检查、模拟 DOM 场景与构建复现为主，没有 macOS Firefox 真机证据；因此本文不给出「Firefox 完全可用 / 不可用」这类绝对结论。

## 开发与构建

技术栈：**TypeScript + esbuild + Less**；`tsconfig.json` 的 `target` 为 `es2017`，esbuild 以 `iife` 格式打包，`minify: false`、`charset: 'utf8'`。

依赖（`package.json` 的 `devDependencies`）：`esbuild ^0.24.2`、`typescript ^5.2.2`、`less ^4.2.0`、`html-minifier ^4.0.0`、`shelljs ^0.8.5`、`@types/node ^20.5.9`；仓库带 `yarn.lock`。安装依赖后可直接用下列命令：

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | `APP_ENV=dev`，esbuild watch 并在 5555 端口提供本地静态服务 |
| `npm run dev:win` | Windows 下的开发命令 |
| `npm run build` | `APP_ENV=prod`，一次性构建（`node ./build-config/esbuild.build.js`） |
| `npm run build:win` | Windows 下的构建命令（`set APP_ENV=prod&&node ...`） |

**产物**：esbuild 输出到 `dist/index.js`（`dist/` 被 `.gitignore` 忽略）；`build-config/esbuild.plugins.js` 的 `envEnd` 插件去掉路径注释后写回仓库根目录的 `index.js`。根目录 `index.js` 已提交，用户可直接拿它安装；脚本头由 `build-config/esbuild.build.js` 读取 `package.json` 生成。

| 路径 | 内容 |
| --- | --- |
| `src/index.ts` | 入口：`document-start` 初始化、fetch 拦截、主题监听、路由与键盘事件 |
| `src/index.html` | 设置面板 HTML |
| `src/styles/` | Less 样式 |
| `src/config/` | 默认配置、极简模式配置与类型 |
| `src/components/` | 功能模块（hidden、size、background、black-list、self-check 等） |
| `src/components/hidden/configs/` | 隐藏项分组数据与组合规则 |
| `src/init/` | 面板渲染与事件绑定 |
| `src/tools/` | 存储、DOM、浏览器判定等工具 |
| `build-config/` | esbuild 配置、插件与公共文案 |
| `static/` | 仓库内图片资源 |
| `index.js` | 已构建、可直接安装的用户脚本 |

## 反馈与更新日志

- [Q&A.md](Q&A.md) — 常见问题解答
- [CHANGELOG.md](CHANGELOG.md) — 完整更新日志
- [CHANGELOG_THIS.md](CHANGELOG_THIS.md) — 本分支本次改动
- [build-config/public/CHANGELOG_LIST.md](build-config/public/CHANGELOG_LIST.md) — 面板内更新日志数据

仓库：<https://github.com/NopantsNobra/zhihu-custom.git>

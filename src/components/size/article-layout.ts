import { dom, myStorage } from '../../tools';

/**
 * 文章页右栏模块对应的配置开关，与 hidden/configs/article.ts 的「文章专栏」分组一致。
 * 仅作为 DOM 判据之外的配置兜底：右栏卡片被隐藏样式移除后，DOM 实际可见性才是主判据。
 * 当前用户只勾选了其中 3 项、右栏 3 个内容子元素高度全为 0，因此必须支持 DOM 判据。
 */
export const ARTICLE_SIDEBAR_KEYS = [
  'hiddenZhuanlanAuthorCard',
  'hiddenZhuanlanHotSearchCard',
  'hiddenZhuanlan',
] as const;

/** 文章页右栏折叠态挂在 html 上 */
const CLASS_NO_SIDEBAR = 'ctz-article-no-sidebar';
/** 一键关闭左侧悬浮栏（所有页面生效）挂在 html 上 */
const CLASS_NO_RAIL = 'ctz-no-rail';
/** 由 JS 定位后打在正文行 / 右栏列 / 正文列上的标记 */
const CLASS_ROW = 'ctz-article-row';
const CLASS_SIDE = 'ctz-article-side-column';
const CLASS_MAIN = 'ctz-article-main-col';
/** 全局 rail 折叠时打在「外层 flex 骨架 / 占位兄弟节点 / 内容列」上的降级类名。
 *  这组类名让 xxxGlobalRail 的兜底规则不依赖 :has()，Firefox < 121 同样生效。 */
const CLASS_RAIL_SHELL = 'ctz-global-rail-shell';
const CLASS_RAIL_PLACEHOLDER = 'ctz-global-rail-placeholder';
const CLASS_RAIL_CONTENT = 'ctz-global-rail-content';
/** 知乎新版右栏列内固定的无障碍锚点，用于精确定位右栏 */
const SIDE_ANCHOR_SELECTOR = 'a[aria-label="边栏锚点"]';

export interface IArticleColumns {
  row: HTMLElement;
  side: HTMLElement;
  main: HTMLElement;
}

/** 是否文章/专栏页：只在这些页面做右栏折叠，避免语义外溢到其他页面 */
const isArticlePage = (): boolean => location.hostname === 'zhuanlan.zhihu.com' || /^\/p\//.test(location.pathname);

const clearArticleColumnMarks = (): void => {
  document.querySelectorAll(`.${CLASS_ROW},.${CLASS_SIDE},.${CLASS_MAIN}`).forEach((el) => {
    el.classList.remove(CLASS_ROW, CLASS_SIDE, CLASS_MAIN);
  });
};

const clearGlobalRailMarks = (): void => {
  document.querySelectorAll(`.${CLASS_RAIL_SHELL},.${CLASS_RAIL_PLACEHOLDER},.${CLASS_RAIL_CONTENT}`).forEach((el) => {
    el.classList.remove(CLASS_RAIL_SHELL, CLASS_RAIL_PLACEHOLDER, CLASS_RAIL_CONTENT);
  });
};

/**
 * 给全局 rail 的外层 flex 骨架打降级类名（xxxGlobalRail 的兜底规则依赖它）。
 *
 * 从 main.App-main 向上找「含 <aside> 直接子元素」的祖先作为骨架；骨架内「含 main.App-main」
 * 的直接子元素是内容列，其余（左 rail 的 aside、40px 空 spacer、flex spacer）是占位节点。
 * 找不到骨架就什么都不打，保持原布局，绝不影响页面。
 */
const markGlobalRailShell = (): void => {
  clearGlobalRailMarks();
  const appMain = document.querySelector<HTMLElement>('main.App-main');
  if (!appMain) return;

  let shell: HTMLElement | null = appMain.parentElement;
  while (shell && shell !== document.body && shell !== document.documentElement) {
    const hasAsideChild = Array.from(shell.children).some((el) => el.tagName === 'ASIDE');
    if (hasAsideChild && (shell.querySelector('main.App-main') || shell.classList.contains('App-main'))) break;
    shell = shell.parentElement;
  }
  if (!shell || shell === document.body || shell === document.documentElement) return;

  shell.classList.add(CLASS_RAIL_SHELL);
  Array.from(shell.children).forEach((child) => {
    const el = child as HTMLElement;
    if (el.matches('main.App-main') || el.querySelector('main.App-main')) {
      el.classList.add(CLASS_RAIL_CONTENT);
    } else {
      el.classList.add(CLASS_RAIL_PLACEHOLDER);
    }
  });
};

/**
 * 定位文章页正文行的两列。
 *
 * 从 article.Post-Main 向上找第一个 display:flex 且 children.length>=2 的祖先作为「正文行」；
 * 其直接子元素中「含 a[aria-label="边栏锚点"]」的为右栏列（找不到则取最后一个），
 * 「含 article.Post-Main」的为正文列。三者缺一或两列指向同一节点就返回 null：
 * 宁可保持原布局，也绝不误隐藏正文（5.24 第二版就是选错了列）。
 */
export const locateArticleColumns = (): IArticleColumns | null => {
  try {
    const article = dom('article.Post-Main');
    if (!article) return null;

    // 折叠态短路复用：ctz-article-no-sidebar 生效后 .ctz-article-row 会从 flex 变 block，
    // 若仍按 display:flex 上溯就会跳过正文行、误把外层骨架当成两列（main===side）而返回 null，
    // 进而撤销折叠 → 与重任务/延迟调用形成 ON/OFF 振荡。这里优先复用已打的列类名。
    const markedRow = document.querySelector<HTMLElement>(`.${CLASS_ROW}`);
    if (markedRow && markedRow.contains(article)) {
      const markedMain = markedRow.querySelector<HTMLElement>(`.${CLASS_MAIN}`);
      const markedSide = markedRow.querySelector<HTMLElement>(`.${CLASS_SIDE}`);
      if (markedMain && markedSide && markedMain !== markedSide && markedMain.contains(article)) {
        return { row: markedRow, side: markedSide, main: markedMain };
      }
    }

    let row: HTMLElement | null = article.parentElement;
    while (row && row !== document.body && row !== document.documentElement) {
      const display = window.getComputedStyle(row).display;
      const isFlexRow = (display === 'flex' || display === 'inline-flex') && row.children.length >= 2;
      // 折叠态的正文行是 block，但带 ctz-article-row 标记，同样视为正文行
      if (isFlexRow || row.classList.contains(CLASS_ROW)) break;
      row = row.parentElement;
    }
    if (!row || row === document.body || row === document.documentElement) return null;
    const rowDisplay = window.getComputedStyle(row).display;
    if (rowDisplay !== 'flex' && rowDisplay !== 'inline-flex' && !row.classList.contains(CLASS_ROW)) return null;
    if (row.children.length < 2) return null;

    const children = Array.from(row.children) as HTMLElement[];
    const hasArticle = (el: HTMLElement): boolean => el.matches('article.Post-Main') || !!el.querySelector('article.Post-Main');
    const hasSideAnchor = (el: HTMLElement): boolean => {
      try {
        return el.matches(SIDE_ANCHOR_SELECTOR) || !!el.querySelector(SIDE_ANCHOR_SELECTOR);
      } catch {
        return false;
      }
    };

    const main = children.find(hasArticle);
    let side = children.find(hasSideAnchor);
    if (!side) side = children[children.length - 1];
    if (!main || !side || main === side) return null;
    return { row, side, main };
  } catch {
    return null;
  }
};

/** 统计右栏列直接内容子元素的可见数量 */
const inspectSideChildren = (side: HTMLElement): { total: number; visible: number } => {
  const children = Array.from(side.children) as HTMLElement[];
  // 折叠态下右栏列本身被 .ctz-article-side-column{display:none} 隐藏，子元素 offsetHeight 恒为 0，
  // 直接测量会把「用户恢复了某个右栏模块」也判成不可见，导致右栏永远展不开。
  // 这里临时以内联 !important 展开测量，同步读回后立刻还原：同一任务内完成，浏览器不会绘制中间态。
  const collapsed = document.documentElement.classList.contains(CLASS_NO_SIDEBAR);
  const prevDisplay = side.style.getPropertyValue('display');
  const prevPriority = side.style.getPropertyPriority('display');
  if (collapsed) side.style.setProperty('display', 'block', 'important');
  let visible = 0;
  children.forEach((child) => {
    let display = '';
    let visibility = '';
    try {
      const style = window.getComputedStyle(child);
      display = style.display;
      visibility = style.visibility;
    } catch {
      // 取不到计算样式时按不可判定处理，不轻易算作可见
    }
    if (display !== 'none' && visibility !== 'hidden' && child.offsetHeight > 0) visible++;
  });
  if (collapsed) {
    if (prevDisplay) side.style.setProperty('display', prevDisplay, prevPriority);
    else side.style.removeProperty('display');
  }
  return { total: children.length, visible };
};

/** 供面板自检读取的同步快照 */
export const inspectArticleSidebar = () => {
  const article = dom('article.Post-Main');
  const columns = locateArticleColumns();
  const sideChildren = columns ? inspectSideChildren(columns.side) : { total: 0, visible: 0 };
  return {
    文章页: isArticlePage(),
    正文已找到: !!article,
    正文行已识别: !!columns?.row,
    右栏列已识别: !!columns?.side,
    正文列已识别: !!columns?.main,
    右栏类名: columns?.side.className || '',
    右栏宽度: columns ? Math.round(columns.side.getBoundingClientRect().width) : 0,
    右栏内容子元素数: sideChildren.total,
    右栏可见子元素数: sideChildren.visible,
    右栏折叠已生效: document.documentElement.classList.contains(CLASS_NO_SIDEBAR),
    全局总控已生效: document.documentElement.classList.contains(CLASS_NO_RAIL),
  };
};

let articleObserver: MutationObserver | undefined;
let observerTimer: ReturnType<typeof setTimeout> | undefined;

const stopWatching = (): void => {
  articleObserver?.disconnect();
  articleObserver = undefined;
  if (observerTimer) clearTimeout(observerTimer);
  observerTimer = undefined;
};

/** 首屏正文容器可能晚于面板渲染，挂一次性观察器，容器出现当帧补判定；10s 后自动断开 */
const watchForArticleContainerOnce = (): void => {
  if (articleObserver || typeof MutationObserver === 'undefined') return;
  if (!isArticlePage()) return;
  const observer = new MutationObserver(() => {
    if (!dom('article.Post-Main')) return;
    stopWatching();
    syncArticleSidebarCollapse().catch(() => undefined);
  });
  articleObserver = observer;
  observer.observe(document.documentElement, { childList: true, subtree: true });
  observerTimer = setTimeout(stopWatching, 10000);
};

/**
 * 同步文章页右栏折叠状态。
 *
 * 判据：DOM 可见性为主 —— 右栏列直接内容子元素全部 offsetHeight===0 / display:none 即折叠；
 * 只要有任一子元素恢复可见立刻移除折叠类并清理类名，还原两列布局；
 * 子元素尚未渲染（total===0）时用 ARTICLE_SIDEBAR_KEYS 全为 true 兜底。
 * 定位失败时保持原布局，绝不给 html 打折叠类（CSS 依赖 JS 打的列类名，没类名加了也没用）。
 * 函数幂等，可在初始化、配置变更、重任务与路由切换中重复调用。
 */
export const syncArticleSidebarCollapse = async (): Promise<void> => {
  try {
    const config = await myStorage.getConfig();
    const html = document.documentElement;
    const allKeysHidden = ARTICLE_SIDEBAR_KEYS.every((key) => !!config[key]);

    if (!isArticlePage()) {
      stopWatching();
      html.classList.remove(CLASS_NO_SIDEBAR);
      clearArticleColumnMarks();
      return;
    }

    const columns = locateArticleColumns();
    if (!columns) {
      // 定位失败（首屏容器未就绪 / 知乎改版导致结构变化）：按「绝不误隐藏」纪律撤销折叠并清列类名。
      // 折叠态自身的定位不会再失败 —— locateArticleColumns() 优先复用已打的列类名（类名短路），
      // 因此这里恢复清类不会重新引入 v5.30 首版的 [F,T,F,T] 振荡。
      html.classList.remove(CLASS_NO_SIDEBAR);
      clearArticleColumnMarks();
      watchForArticleContainerOnce();
      return;
    }

    const { total, visible } = inspectSideChildren(columns.side);
    const shouldCollapse = visible === 0 && (total > 0 || allKeysHidden);
    const htmlCollapsed = html.classList.contains(CLASS_NO_SIDEBAR);
    const marksApplied =
      columns.row.classList.contains(CLASS_ROW) &&
      columns.side.classList.contains(CLASS_SIDE) &&
      columns.main.classList.contains(CLASS_MAIN);

    stopWatching();

    if (!shouldCollapse) {
      if (htmlCollapsed || marksApplied) {
        html.classList.remove(CLASS_NO_SIDEBAR);
        clearArticleColumnMarks();
      }
      return;
    }

    // 已是目标折叠态直接返回：不再每轮 remove/add 一遍，避免重排与观察器抖动
    if (htmlCollapsed && marksApplied) return;

    html.classList.add(CLASS_NO_SIDEBAR);
    columns.row.classList.add(CLASS_ROW);
    columns.side.classList.add(CLASS_SIDE);
    columns.main.classList.add(CLASS_MAIN);
  } catch {
    // 折叠逻辑异常不能影响脚本其他功能
  }
};

/**
 * 同步全局「一键关闭左侧悬浮栏」状态：按 hiddenGlobalSideRail 给 html 加/删 ctz-no-rail，
 * 并维护骨架/占位节点的降级类名；开关只在设置面板内提供（刷新后从配置恢复）。
 */
export const syncGlobalRailCollapse = async (): Promise<void> => {
  try {
    const config = await myStorage.getConfig();
    const html = document.documentElement;
    const enabled = !!config.hiddenGlobalSideRail;
    if (enabled) {
      html.classList.add(CLASS_NO_RAIL);
      // 给骨架/占位节点打降级类名，让 xxxGlobalRail 的兜底规则不依赖 :has()；
      // 已有有效标记就跳过，避免 1.5s 重任务节流点重复 class 抖动。
      const marked = document.querySelector<HTMLElement>(`.${CLASS_RAIL_SHELL}`);
      if (!marked || !marked.querySelector('main.App-main')) markGlobalRailShell();
    } else {
      html.classList.remove(CLASS_NO_RAIL);
      clearGlobalRailMarks();
    }
  } catch {
    // 总控逻辑异常不能影响脚本其他功能
  }
};

import { dom, myStorage } from '../../tools';

/**
 * 主页右栏九个模块的开关，与 hidden/configs/list.ts 的「列表页面」分组一一对应。
 * 只有这一组全部勾选隐藏时才收掉整列；任一项可见就保持知乎原本的两列布局。
 */
export const HOME_SIDEBAR_KEYS = [
  'hiddenHomeCreatorEntrance',
  'hiddenHomeQuanzi',
  'hiddenYanXuanWriter',
  'hiddenHomeRecommendFollow',
  'hiddenHomeCategory',
  'hiddenHomeCategoryMore',
  'hiddenHomeFooter',
  'hiddenHomeHotSearch',
  'hiddenHomePayAsk',
] as const;

/** 九个模块在 DOM 里的锚点，取自 hidden/configs/list.ts 各自的 css 选择器，供面板自检统计 */
export const HOME_SIDEBAR_ANCHORS: [string, string][] = [
  ['创作中心', '.Topstory .css-19idom'],
  ['圈子', '.Card.css-18gpi2u'],
  ['盐选作者平台', '.KfeCollection-CreateSaltCard'],
  ['推荐关注', '.Topstory .css-1iaxl4o'],
  ['分类圆桌', '.Topstory .GlobalSideBar-category'],
  ['更多分类', '.Topstory .Card[aria-label="更多分类入口"]'],
  ['知乎指南', '.Topstory .Footer'],
  ['大家都在搜', '.Topstory .HotSearchCard'],
  ['付费咨询', '.Topstory .css-1dyj6jm'],
];

/** 整列折叠时挂在 html 上 */
const CLASS_NO_SIDEBAR = 'ctz-home-no-sidebar';
/** 标记右栏容器，样式只认这个标记，避免误伤其他兄弟节点 */
const CLASS_SIDE_COLUMN = 'ctz-home-side-column';

/** 识别右栏列的锚点，从右栏专属类名到通用 Card 兜底 */
const SIDE_COLUMN_ANCHORS = [
  '.GlobalSideBar-category',
  '.GlobalSideBar',
  '.HotSearchCard',
  '.Footer',
  'footer',
  '[aria-label="更多分类入口"]',
  '[class*="CreateSaltCard"]',
  '[class*="RecommendFollow"]',
  '.css-19idom',
  '.css-18gpi2u',
  '.css-1dyj6jm',
  '.Card',
];

const clearSideColumnMarks = () => {
  document.querySelectorAll(`.${CLASS_SIDE_COLUMN}`).forEach((el) => el.classList.remove(CLASS_SIDE_COLUMN));
};

/** 取节点所在的顶层列（container 的直接子元素） */
const getTopLevelColumn = (node: HTMLElement, container: HTMLElement): HTMLElement | null => {
  let cur: HTMLElement | null = node;
  while (cur && cur.parentElement && cur.parentElement !== container) cur = cur.parentElement;
  return cur && cur.parentElement === container ? cur : null;
};

interface IHomeColumns {
  container: HTMLElement;
  main: HTMLElement;
  side: HTMLElement;
}

/**
 * 定位主页两列。
 *
 * 主列上溯到 container 的直接子元素（改版后可能多包一层），右栏只在它**之后**的兄弟元素里找，
 * 避免把左侧 rail 当成右栏。找不到就返回 null：宁可保持原布局，也不能误隐藏主列——
 * 5.24 第二版「隐藏一张卡片导致整栏消失」就是选错了列。
 */
const locateColumns = (): IHomeColumns | null => {
  const container = dom('.Topstory-container') || dom('.Topstory');
  if (!container) return null;
  const mainNode = dom('.Topstory-mainColumn', container) || dom('.Topstory-mainColumn');
  if (!mainNode) return null;
  const main = getTopLevelColumn(mainNode, container);
  if (!main) return null;

  const children = Array.from(container.children) as HTMLElement[];
  const mainIndex = children.indexOf(main);
  if (mainIndex < 0) return null;
  const candidates = children.filter((el, i) => i > mainIndex && el !== main);

  const hasAnchor = (el: HTMLElement) =>
    SIDE_COLUMN_ANCHORS.some((sel) => {
      try {
        return el.matches(sel) || !!el.querySelector(sel);
      } catch {
        return false;
      }
    });
  const isRightOfMain = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const m = main.getBoundingClientRect();
    return r.width > 0 && r.left >= m.right - 8;
  };

  const side =
    candidates.find((el) => hasAnchor(el)) ||
    // 知乎改版导致锚点全部失效时，唯一位于主列右侧的兄弟元素就是右栏
    (candidates.length === 1 && isRightOfMain(candidates[0]) ? candidates[0] : undefined);
  return side ? { container, main, side } : null;
};

/** 供面板自检读取的同步快照（容器/主列单独判定，识别失败时能区分是哪一层缺失） */
export const inspectHomeSidebar = () => {
  const container = dom('.Topstory-container') || dom('.Topstory');
  const mainNode = container ? dom('.Topstory-mainColumn', container) || dom('.Topstory-mainColumn') : undefined;
  const columns = locateColumns();
  return {
    容器已找到: !!container,
    主列已找到: !!mainNode,
    右栏列已识别: !!columns?.side,
    右栏类名: columns?.side.className || '',
    右栏宽度: columns ? Math.round(columns.side.getBoundingClientRect().width) : 0,
    主列宽度: mainNode ? Math.round(mainNode.getBoundingClientRect().width) : 0,
    折叠已生效: document.documentElement.classList.contains(CLASS_NO_SIDEBAR),
  };
};

let containerObserver: MutationObserver | undefined;
let observerTimer: ReturnType<typeof setTimeout> | undefined;

const stopWatching = () => {
  containerObserver?.disconnect();
  containerObserver = undefined;
  if (observerTimer) clearTimeout(observerTimer);
  observerTimer = undefined;
};

/**
 * 首屏 container 可能晚于面板渲染。挂一次性观察器，容器出现当帧补折叠，
 * 避免「先显示两栏空白、再收起」的跳动；10s 后自动断开，不留常驻监听。
 */
const watchForContainerOnce = () => {
  if (containerObserver || typeof MutationObserver === 'undefined') return;
  // 非主页本来就没有主页右栏，不挂观察器
  if (!['/', '/follow', '/hot', '/zvideo'].includes(location.pathname)) return;
  const observer = new MutationObserver(() => {
    if (!dom('.Topstory-container') && !dom('.Topstory')) return;
    stopWatching();
    syncHomeSidebarCollapse().catch(() => undefined);
  });
  containerObserver = observer;
  observer.observe(document.documentElement, { childList: true, subtree: true });
  observerTimer = setTimeout(stopWatching, 10000);
};

/**
 * 同步主页右栏的折叠状态。
 *
 * 九项全部隐藏时把整列移出布局、主列铺满并居中；任一项恢复可见就立刻还原两列。
 * 所有 class 变更集中在一次同步块内完成，浏览器不会绘制中间态。
 * 函数幂等，可在初始化、配置变更、重任务与路由切换中重复调用。
 */
export const syncHomeSidebarCollapse = async (): Promise<void> => {
  try {
    const config = await myStorage.getConfig();
    const html = document.documentElement;
    const allHidden = HOME_SIDEBAR_KEYS.every((key) => !!config[key]);

    if (!allHidden) {
      stopWatching();
      html.classList.remove(CLASS_NO_SIDEBAR);
      clearSideColumnMarks();
      return;
    }

    const columns = locateColumns();
    if (!columns) {
      // 识别失败时保持原两列布局，绝不给 html 打折叠类
      html.classList.remove(CLASS_NO_SIDEBAR);
      clearSideColumnMarks();
      watchForContainerOnce();
      return;
    }

    stopWatching();
    html.classList.remove(CLASS_NO_SIDEBAR);
    clearSideColumnMarks();
    columns.side.classList.add(CLASS_SIDE_COLUMN);
    html.classList.add(CLASS_NO_SIDEBAR);
  } catch {
    // 折叠逻辑异常不能影响脚本其他功能
  }
};

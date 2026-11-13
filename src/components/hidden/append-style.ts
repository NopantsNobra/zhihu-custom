import { dom, fnAppendStyle, fnLog, myStorage } from '../../tools';
import { HIDDEN_ARRAY, HIDDEN_ARRAY_MORE } from './configs';

/** 加载隐藏模块的样式 */
export const appendHiddenStyle = async () => {
  const config = await myStorage.getConfig();

  let hiddenContent = '';

  HIDDEN_ARRAY.forEach((item) => {
    item.content.forEach((content) => {
      content.forEach((hiddenItem) => {
        config[hiddenItem.value] && (hiddenContent += hiddenItem.css);
      });
    });
  });

  HIDDEN_ARRAY_MORE.forEach(({ keys, value }) => {
    let trueNumber = 0;
    keys.forEach((key) => config[key] && trueNumber++);
    trueNumber === keys.length && (hiddenContent += value);
  });

  if (config.topVote) {
    hiddenContent += `.css-dvccr2{display: none!important;}`;
  }

  fnAppendStyle('CTZ_STYLE_HIDDEN', hiddenContent);
};

/**
 * 需要按标题文本兜底隐藏的卡片映射。
 * 知乎的卡片类名（含哈希类名）会随构建变化，但卡片标题文本相对稳定，
 * 因此额外提供一层按标题定位的兜底逻辑。此处只包含已确认需要兜底的条目。
 */
const HIDDEN_CARD_TITLE_MAP: Record<string, string[]> = {
  hiddenYanXuanWriter: ['盐言作者平台', '盐选作者平台'],
  hiddenHomeRecommendFollow: ['推荐关注'],
};

/** 标记「已按标题隐藏」的卡片，便于取消勾选后还原 */
const HIDDEN_BY_TITLE_ATTR = 'data-ctz-hidden-by-title';
/** 卡片容器宽度下界（右栏与卡片同宽约 375，需配合高度判定区分） */
const HIDDEN_CARD_MIN_WIDTH = 240;
/** 卡片容器宽度上界 */
const HIDDEN_CARD_MAX_WIDTH = 420;
/** 卡片容器高度下界（排除标题行，实测标题行约 40） */
const HIDDEN_CARD_MIN_HEIGHT = 72;
/** 卡片容器高度上界（实测推荐关注最多 6 个用户约 520，此处留足余量；右栏容器常 > 700） */
const HIDDEN_CARD_MAX_HEIGHT = 640;
/** 类名判据的最大上溯层数（标题到卡片之间可能隔几层包装） */
const HIDDEN_CARD_MAX_DEPTH_CLASS = 6;
/** 尺寸兜底判据的最大上溯层数 */
const HIDDEN_CARD_MAX_DEPTH = 4;
/** 主页列表容器，查找范围只限定在其内部 */
const HIDDEN_CARD_ROOT_SELECTOR = '.Topstory-container';
/** 主页容器的降级名（仅用于知乎改版改容器类名，不用于跨页面） */
const HIDDEN_CARD_ROOT_SELECTOR_FALLBACK = '.Topstory';
/** 可能出现卡片标题的元素标签，缩小遍历范围 */
const HIDDEN_CARD_TITLE_SELECTOR = 'div,span,h2,h3';
/**
 * 卡片容器类名：以 Card 结尾且独立成词（排除 Card-header / Card-body 这类子块）。
 * 负向断言排除含 `Right` 的词元（如右栏容器 `New-RightCard`），避免把整列当卡片。
 */
const HIDDEN_CARD_CLASS_NAME_REG = /(^|\s)((?![A-Za-z-]*Right)[A-Za-z-]*Card)(\s|$)/;

/**
 * 清除上一轮按标题隐藏的标记与行内样式。
 *
 * 从 `document` 清理而非局部 root：SPA 路由切换后卡片可能被移出 root，
 * 只在 root 内清理会留下永远清不掉的残留标记。
 */
const clearHiddenCardsByTitle = () => {
  try {
    document.querySelectorAll<HTMLElement>(`[${HIDDEN_BY_TITLE_ATTR}]`).forEach((node) => {
      node.style.removeProperty('display');
      node.removeAttribute(HIDDEN_BY_TITLE_ATTR);
    });
  } catch {
    // 清理失败不应阻塞后续隐藏流程
  }
};

/**
 * 卡片容器判定：类名以 Card 结尾且独立成词才认，并叠一层几何安全网。
 *
 * 这样能命中 `KfeCollection-CreateSaltCard`，但排除 `Card-header` / `Card-body` 这类子块；
 * 右栏容器类名形如 `SideColumn` / `New-RightCard`，前者不含 Card、后者被 `Right` 词元排除。
 * 几何安全网（宽度区间 + 高度下限 + 父级宽度区间）用于兜住任何「类名像卡片但体积是整列」的容器，
 * 宽度区间才是主安全网：主列与页面容器都会被挡掉；右栏由类名正则里的 Right 负向断言 + 父级宽度区间共同排除。
 * 高度只设下限用于排除标题行——若再加上限，高卡片会让类名判据与尺寸兜底共用阈值而同时失效。
 */
const isCardContainer = (el: HTMLElement): boolean => {
  try {
    const cls = el.getAttribute('class') || '';
    if (!HIDDEN_CARD_CLASS_NAME_REG.test(cls)) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width < HIDDEN_CARD_MIN_WIDTH || rect.width > HIDDEN_CARD_MAX_WIDTH) return false;
    if (rect.height < HIDDEN_CARD_MIN_HEIGHT) return false;
    // 父级宽度也要落在卡片区间内：卡片挂在右栏（约 375）下可通过，
    // 右栏自身挂在页面容器（1265）下会被排除，避免整列被吞掉。
    const parentRect = el.parentElement ? el.parentElement.getBoundingClientRect() : null;
    return !parentRect || (parentRect.width >= HIDDEN_CARD_MIN_WIDTH && parentRect.width <= HIDDEN_CARD_MAX_WIDTH);
  } catch {
    return false;
  }
};

/**
 * 从命中的标题元素向上查找卡片容器。
 *
 * 类名判据优先（比尺寸可靠，且天然排除右栏）；类名失效时退回尺寸判据兜底：
 * 宽度区间过滤量级，高度 `>= 72` 排除标题行、`<= 640` 排除右栏容器。
 * 两轮都找不到返回 null（宁可不隐藏，也不误伤右栏等大容器）。
 */
const findHiddenCardContainer = (titleNode: HTMLElement): HTMLElement | null => {
  // 第一优先：类名判据，从父级开始（避免命中标题元素自身）
  let current: HTMLElement | null = titleNode.parentElement;
  let depth = 0;
  while (current && depth < HIDDEN_CARD_MAX_DEPTH_CLASS) {
    if (isCardContainer(current)) return current;
    current = current.parentElement;
    depth++;
  }

  // 兜底：类名判据失效时退回尺寸判据
  current = titleNode.parentElement;
  depth = 0;
  while (current && depth < HIDDEN_CARD_MAX_DEPTH) {
    const rect = current.getBoundingClientRect();
    const isCard =
      rect.width >= HIDDEN_CARD_MIN_WIDTH &&
      rect.width <= HIDDEN_CARD_MAX_WIDTH &&
      rect.height >= HIDDEN_CARD_MIN_HEIGHT &&
      rect.height <= HIDDEN_CARD_MAX_HEIGHT;
    if (isCard) return current;
    current = current.parentElement;
    depth++;
  }
  return null;
};

/** 零命中日志只提示一次，避免非主页每次重任务刷屏 */
let loggedZeroHit = false;

/**
 * 按卡片标题文本兜底隐藏主页右栏卡片。
 *
 * 每次执行都会先清除上一轮的标记与行内样式，再根据当前配置重新隐藏，
 * 因此取消勾选后重新执行即可恢复显示。
 *
 * 该函数挂在重任务节流点上（约每 1.5s 一次），因此做了零成本短路：
 * 既不需要隐藏、也没有上一轮留下的标记时，只做一次 querySelector 就返回。
 *
 * @param forceResetLog 为 true 时重置零命中日志的去重标记（配置变更后重新判定时用，
 *   避免一次失败后永远不再提示）
 */
export const syncHiddenCardsByTitle = async (forceResetLog = false): Promise<void> => {
  try {
    if (forceResetLog) loggedZeroHit = false;

    const config = await myStorage.getConfig();

    // 零成本短路：默认（两项均未勾选）状态下无需全量遍历
    const needHide = Object.keys(HIDDEN_CARD_TITLE_MAP).some((key) => config[key]);
    // 与 document 级清理保持同域，确保移出 root 的残留标记也能被发现并清掉
    const hasMarked = !!document.querySelector(`[${HIDDEN_BY_TITLE_ATTR}]`);
    if (!needHide && !hasMarked) return;

    clearHiddenCardsByTitle();

    // 非主页只看「清残留」，不做遍历：本功能只针对主页右栏，避免全站语义外溢与白跑遍历
    if (!needHide) return;

    // 只认主页容器；降级名仅用于知乎改版改容器类名，不降级到 .App-main / body
    const root = dom(HIDDEN_CARD_ROOT_SELECTOR) || dom(HIDDEN_CARD_ROOT_SELECTOR_FALLBACK);
    // 非主页本来就没有主页右栏，取不到容器是预期行为，不应提示（否则默认配置下每次打开问题页都会看到误导日志）
    const isHomePage = ['/', '/follow', '/hot', '/zvideo'].includes(location.pathname);
    if (!root) {
      if (!loggedZeroHit && isHomePage) {
        loggedZeroHit = true;
        fnLog('按标题隐藏未命中：未找到主页容器 .Topstory-container / .Topstory，需要补充选择器');
      }
      return;
    }

    // 汇总当前配置下需要隐藏的标题文本
    const titles = new Set<string>();
    Object.keys(HIDDEN_CARD_TITLE_MAP).forEach((key) => {
      if (!config[key]) return;
      HIDDEN_CARD_TITLE_MAP[key].forEach((title) => titles.add(title));
    });
    if (!titles.size) return;

    let hitCount = 0;

    root.querySelectorAll<HTMLElement>(HIDDEN_CARD_TITLE_SELECTOR).forEach((el) => {
      // 只处理叶子文本节点对应的元素（children ≤ 1，容纳标题里的小图标）
      if (el.children.length > 1) return;
      const text = el.textContent?.trim();
      if (!text || !titles.has(text)) return;
      const card = findHiddenCardContainer(el);
      if (!card || card.hasAttribute(HIDDEN_BY_TITLE_ATTR)) return;
      card.setAttribute(HIDDEN_BY_TITLE_ATTR, '1');
      card.style.setProperty('display', 'none', 'important');
      hitCount++;
    });

    // 零命中只提示一次：帮助定位容器选择器失效，同时避免每次重任务刷屏
    if (!hitCount && !loggedZeroHit) {
      loggedZeroHit = true;
      fnLog('按标题隐藏未命中：可能在 .Topstory-container 外，需要补充选择器');
    }
  } catch {
    // 标题兜底逻辑异常不能影响脚本其他功能
  }
};

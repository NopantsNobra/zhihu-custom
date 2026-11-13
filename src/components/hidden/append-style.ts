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
/** 卡片容器高度上界（实测推荐关注最多 6 个用户约 520；右栏容器常 > 700，仍有安全距离） */
const HIDDEN_CARD_MAX_HEIGHT = 520;
/** 类名判据的最大上溯层数（标题到卡片之间可能隔几层包装） */
const HIDDEN_CARD_MAX_DEPTH_CLASS = 6;
/** 尺寸兜底判据的最大上溯层数 */
const HIDDEN_CARD_MAX_DEPTH = 4;
/** 主页列表容器，查找范围只限定在其内部 */
const HIDDEN_CARD_ROOT_SELECTOR = '.Topstory-container';
/** 可能出现卡片标题的元素标签，缩小遍历范围 */
const HIDDEN_CARD_TITLE_SELECTOR = 'div,span,h2,h3';
/** 卡片容器类名：以 Card 结尾且独立成词（排除 Card-header / Card-body 这类子块） */
const HIDDEN_CARD_CLASS_NAME_REG = /(^|\s)([A-Za-z-]*Card)(\s|$)/;

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
 * 卡片容器判定：类名以 Card 结尾且独立成词才认。
 *
 * 这样能命中 `KfeCollection-CreateSaltCard`，但排除 `Card-header` / `Card-body` 这类子块；
 * 右栏容器类名形如 `SideColumn`，不含 Card，天然不会被误伤。
 */
const isCardContainer = (el: HTMLElement): boolean => {
  try {
    const cls = el.getAttribute('class') || '';
    return HIDDEN_CARD_CLASS_NAME_REG.test(cls);
  } catch {
    return false;
  }
};

/**
 * 从命中的标题元素向上查找卡片容器。
 *
 * 类名判据优先（比尺寸可靠，且天然排除右栏）；类名失效时退回尺寸判据兜底：
 * 宽度区间过滤量级，高度 `>= 60` 排除纯标题行、`<= 600` 排除右栏容器。
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

/**
 * 按卡片标题文本兜底隐藏主页右栏卡片。
 *
 * 每次执行都会先清除上一轮的标记与行内样式，再根据当前配置重新隐藏，
 * 因此取消勾选后重新执行即可恢复显示。
 *
 * 该函数挂在重任务节流点上（约每 1.5s 一次），因此做了零成本短路：
 * 既不需要隐藏、也没有上一轮留下的标记时，只做一次 querySelector 就返回。
 */
export const syncHiddenCardsByTitle = async (): Promise<void> => {
  try {
    const config = await myStorage.getConfig();
    // 兜底链：知乎改版可能导致某个容器类名消失，逐级降级避免整体静默失效
    const root = dom(HIDDEN_CARD_ROOT_SELECTOR) || dom('.Topstory') || dom('.App-main') || document.body;
    if (!root) return;

    // 零成本短路：默认（两项均未勾选）状态下无需全量遍历
    const needHide = Object.keys(HIDDEN_CARD_TITLE_MAP).some((key) => config[key]);
    // 与 document 级清理保持同域，确保移出 root 的残留标记也能被发现并清掉
    const hasMarked = !!document.querySelector(`[${HIDDEN_BY_TITLE_ATTR}]`);
    if (!needHide && !hasMarked) return;

    clearHiddenCardsByTitle();

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

    // 只在开启隐藏时提示零命中，帮助定位容器选择器失效（未开启时上面已 return，不会刷屏）
    if (!hitCount) fnLog('按标题隐藏未命中：可能在 .Topstory-container 外，需要补充选择器');
  } catch {
    // 标题兜底逻辑异常不能影响脚本其他功能
  }
};

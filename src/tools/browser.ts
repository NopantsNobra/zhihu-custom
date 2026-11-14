/** 判断浏览器环境 */
const judgeBrowserType = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Chrome')) return 'Chrome';
  return 'Safari';
};

/** 当前浏览器是否为 Safari */
export const isSafari = judgeBrowserType() === 'Safari';

/** 主页左侧 rail 的降级标记，对应 :has(>a[href$="/column-square"]):has(>a[href$="/ring-feeds"]) */
const CLASS_HOME_RAIL = 'ctz-home-rail';
/** 回答页骨架层的降级标记，对应 :has(.App-main) / :has(>.QuestionPage) */
const CLASS_QUESTION_SHELL = 'ctz-question-shell';
/** 回答页主列包装层的降级标记，对应 .QuestionPage>:has(.Question-mainColumn) */
const CLASS_QUESTION_COL = 'ctz-question-col';
/** 回答页外层 flex 骨架的降级标记，对应 div:has(> aside):has(.App-main) */
const CLASS_QUESTION_FLEX_SHELL = 'ctz-question-flex-shell';

const clearFallbackClasses = () => {
  document.querySelectorAll(`.${CLASS_HOME_RAIL},.${CLASS_QUESTION_SHELL},.${CLASS_QUESTION_COL},.${CLASS_QUESTION_FLEX_SHELL}`).forEach((el) => {
    el.classList.remove(CLASS_HOME_RAIL, CLASS_QUESTION_SHELL, CLASS_QUESTION_COL, CLASS_QUESTION_FLEX_SHELL);
  });
};

/**
 * 为不支持 CSS :has() 的浏览器补齐结构类名。
 *
 * 尺寸补丁里有多条规则在选择器**中部**使用 :has()（例如 `:has(.App-main)`、
 * `.QuestionPage>:has(.Question-mainColumn)`）。老浏览器会把整条规则丢弃，
 * 只把根部的 `html:has(...)` 换成类名救不回来。因此 CSS 侧另给一份
 * `@supports not selector(:has(*))` 内的纯类名规则，这里负责维护它需要的全部类名。
 *
 * 支持 :has() 时直接返回，不产生任何 DOM 遍历；本函数幂等，可在路由切换与重任务中重复调用。
 */
export const syncHasFallbackClasses = () => {
  if (isSupportHasSelector()) return;
  try {
    const html = document.documentElement;
    const isQuestion = !!document.querySelector('.QuestionPage');
    const isHome = !!document.querySelector('.Topstory-container');
    html.classList.toggle('ctz-question-page', isQuestion);
    html.classList.toggle('ctz-home-page', isHome);

    clearFallbackClasses();

    if (isHome) {
      // 与 :has() 版同一判据：同时直接包含 column-square 与 ring-feeds 两个链接的容器
      document.querySelectorAll<HTMLElement>('a[href$="/column-square"]').forEach((anchor) => {
        const parent = anchor.parentElement;
        if (!parent) return;
        const hasRingFeeds = Array.from(parent.children).some((el) => el !== anchor && el.matches('a[href$="/ring-feeds"]'));
        if (hasRingFeeds) parent.classList.add(CLASS_HOME_RAIL);
      });
    }

    if (isQuestion) {
      const page = document.querySelector<HTMLElement>('.QuestionPage');
      if (page) {
        // 骨架层：QuestionPage 到 body 之间的所有祖先
        let shell: HTMLElement | null = page.parentElement;
        while (shell && shell !== document.body && shell !== html) {
          shell.classList.add(CLASS_QUESTION_SHELL);
          shell = shell.parentElement;
        }
        // 主列包装层：QuestionPage 的直接子元素中包含 .Question-mainColumn 的那一层
        Array.from(page.children).forEach((child) => {
          if (child.querySelector('.Question-mainColumn') || child.classList.contains('Question-mainColumn')) {
            child.classList.add(CLASS_QUESTION_COL);
          }
        });
        // 主列的直接父元素同样是列包装层（页面改版后可能多包一层）
        page.querySelectorAll<HTMLElement>('.Question-mainColumn').forEach((column) => {
          const parent = column.parentElement;
          if (parent) parent.classList.add(CLASS_QUESTION_COL);
        });
        // 外层 flex 骨架：有 <aside> 直接子元素且后代含 .App-main 的祖先容器。
        // 骨架里的 aside / spacer 会占住布局位置，需要在 CSS 侧折叠，故单独标记。
        let flexShell: HTMLElement | null = page.parentElement;
        while (flexShell && flexShell !== document.body && flexShell !== html) {
          const hasAsideChild = Array.from(flexShell.children).some((el) => el.tagName === 'ASIDE');
          if (hasAsideChild && (flexShell.querySelector('.App-main') || flexShell.classList.contains('App-main'))) {
            flexShell.classList.add(CLASS_QUESTION_FLEX_SHELL);
          }
          flexShell = flexShell.parentElement;
        }
      }
    }
  } catch {
    // 类名同步失败不影响其他功能
  }
};

/**
 * 当前浏览器是否支持 CSS :has()。
 *
 * :has() 自 2023-12-19 起 Baseline（Chrome/Edge 105+、Safari 15.4+、Firefox 121+）。
 * 低于该版本时尺寸与主页布局补丁会被整串丢弃，表现为「宽度滑块调了没反应、页面偏右」。
 * 现在由 syncHasFallbackClasses + @supports 类名降级兜住，检测值仍用于日志与自检。
 */
export const isSupportHasSelector = () => {
  try {
    return typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('selector(:has(*))');
  } catch {
    return false;
  }
};

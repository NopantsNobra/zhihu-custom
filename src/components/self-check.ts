import { dom, domById, fnLog, isSupportHasSelector, message, myStorage } from '../tools';
import { HOME_SIDEBAR_ANCHORS, HOME_SIDEBAR_KEYS, inspectHomeSidebar } from './size/home-layout';

/** 读取关键节点的实测几何值，用于判断宽度补丁是否真的落地 */
const measure = (selector: string) => {
  const el = dom(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    宽度: Math.round(rect.width),
    左边距: Math.round(rect.left),
    右边界: Math.round(rect.right),
    计算宽度: getComputedStyle(el).width,
  };
};

/**
 * 宽度自检 / 隐藏自检。
 *
 * 把历次排查用的 Console 探针固化成面板按钮：一次性给出 :has() 支持、样式表注入、
 * 宽度配置与实测值、九个右栏开关状态、右栏列识别与折叠状态、标题兜底残留。
 * 结果同时打到 Console 分组与页面提示，知乎改版后可直接据此定位是哪一层断了。
 */
export const runSelfCheck = async () => {
  const config = await myStorage.getConfig();
  const hasSupport = isSupportHasSelector();
  const issues: string[] = [];
  const notes: string[] = [];

  // 一、样式表是否都注入成功
  const styleIds = ['CTZ_STYLE_VERSION', 'CTZ_STYLE_HIDDEN', 'CTZ_STYLE_BACKGROUND'];
  const styles = styleIds.map((id) => {
    const node = domById(id);
    if (!node) issues.push(`样式表 ${id} 未注入`);
    return { 样式表: id, 已注入: !!node, 字符数: node?.textContent?.length || 0 };
  });

  // 二、宽度配置与实测
  const expectHome = config.versionHomeIsPercent ? `${config.versionHomePercent || 70}vw` : `${config.versionHome || 1000}px`;
  const expectAnswer = config.versionAnswerIsPercent ? `${config.versionAnswerPercent || 70}vw` : `${config.versionAnswer || 1000}px`;
  const widthNodes = {
    '.Topstory-container': measure('.Topstory-container'),
    '.Topstory-mainColumn': measure('.Topstory-mainColumn'),
    '.QuestionPage': measure('.QuestionPage'),
    '.Question-mainColumn': measure('.Question-mainColumn'),
  };
  const customCss = String(config.customizeCss || '');
  if (/width\s*:[^;]*!important/i.test(customCss)) issues.push('自定义 CSS 中含 width + !important，可能覆盖宽度设置');

  // 三、隐藏项与右栏折叠
  const switches = HOME_SIDEBAR_KEYS.map((key) => ({ 开关: key, 已隐藏: !!config[key] }));
  const allHidden = switches.every((item) => item.已隐藏);
  const sidebar = inspectHomeSidebar();
  const titleMarked = document.querySelectorAll('[data-ctz-hidden-by-title]').length;
  const needTitleHide = !!(config.hiddenYanXuanWriter || config.hiddenHomeRecommendFollow);
  const anchors = HOME_SIDEBAR_ANCHORS.map(([label, selector]) => {
    let count = 0;
    try {
      count = document.querySelectorAll(selector).length;
    } catch {
      count = -1;
    }
    return { 模块: label, DOM节点数: count };
  });

  // 四、结论
  if (!hasSupport) notes.push('浏览器不支持 :has()，已走 @supports 类名回退（宽度与主页布局使用降级规则）');
  if (allHidden && !sidebar.折叠已生效) issues.push('九个右栏模块已全部隐藏，但右栏未折叠（容器识别失败或样式未生效）');
  if (!allHidden && sidebar.折叠已生效) issues.push('仍有右栏模块可见，但右栏处于折叠状态（状态未同步）');
  if (allHidden && !sidebar.右栏列已识别) issues.push('未识别到主页右栏列；若当前是主页，请检查 .Topstory-container 结构');
  if (!needTitleHide && titleMarked > 0) issues.push(`残留 ${titleMarked} 个按标题隐藏标记，取消勾选未清理干净`);
  if (needTitleHide && titleMarked === 0) notes.push('按标题兜底未命中任何卡片（可能知乎改了标题文本或容器类名）');
  if (['/', '/follow', '/hot', '/zvideo'].includes(location.pathname) && !widthNodes['.Topstory-mainColumn']) {
    issues.push('主页未找到 .Topstory-mainColumn，宽度设置可能失效');
  }

  const report = {
    时间: new Date().toISOString(),
    页面: location.href,
    浏览器: navigator.userAgent,
    支持_has: hasSupport,
    期望宽度: { 列表: expectHome, 回答: expectAnswer },
    实测: widthNodes,
    样式表: styles,
    右栏开关: switches,
    九项全隐藏: allHidden,
    右栏状态: sidebar,
    按标题隐藏标记数: titleMarked,
    九项DOM命中: anchors,
    异常: issues,
    提示: notes,
  };

  console.groupCollapsed('%c「知乎修改器」自检报告', 'color: green; font-weight: bold;');
  console.log('完整报告（可右键复制）', report);
  console.table(styles);
  console.table(switches);
  console.table(anchors);
  console.log('宽度实测', widthNodes);
  console.log('右栏状态', sidebar);
  console.log('异常', issues, '提示', notes);
  console.groupEnd();
  fnLog(`自检完成：${issues.length} 项异常、${notes.length} 条提示，详情见上方 Console 分组`);
  message(`自检完成：${issues.length} 项异常${issues.length ? `（${issues[0]}）` : ''}，详情见 Console`);
  return report;
};

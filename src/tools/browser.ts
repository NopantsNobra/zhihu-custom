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

/**
 * 当前浏览器是否支持 CSS :has()。
 *
 * 页面尺寸与主页布局修复全部依赖 :has() 做结构选择，脚本里无法用纯选择器降级替代，
 * 因此在不支持的浏览器上这些功能会整体失效（表现为：宽度滑块调了没反应、页面依旧偏右）。
 * Chrome 105+ / Edge 105+ / Safari 15.4+ / Firefox 121+ 才支持。
 */
export const isSupportHasSelector = () => {
  try {
    return typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('selector(:has(*))');
  } catch {
    return false;
  }
};

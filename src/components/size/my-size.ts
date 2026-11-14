import { CLASS_ZHIHU_COMMENT_DIALOG } from '../../misc';
import { domById, fnAppendStyle, fnReturnStr, myStorage } from '../../tools';
import { EThemeDark, EThemeLight, isDark, THEME_CONFIG_DARK, THEME_CONFIG_LIGHT } from '../background';
import { ELinkShopping, EZoomImageHeight, EZoomImageType, EZoomListVideoType } from '../select';
import { VERSION_MIN_WIDTH } from './create-html';

/** 修改版心的 css */
export const mySize = {
  init: async function () {
    fnAppendStyle('CTZ_STYLE_VERSION', await this.content());
  },
  change: function () {
    this.initAfterLoad();
    this.init();
  },
  initAfterLoad: async function () {
    const pfConfig = await myStorage.getConfig();
    // 自定义图片尺寸大小 range 显隐
    domById('CTZ_IMAGE_SIZE_CUSTOM')!.style.display = pfConfig.zoomImageType === EZoomImageType.自定义尺寸 ? 'flex' : 'none';
    // 自定义图片尺寸高度限制
    domById('CTZ_IMAGE_HEIGHT_CUSTOM')!.style.display = pfConfig.zoomImageHeight === EZoomImageHeight.开启 ? 'flex' : 'none';
    // 自定义列表视频回答内容 range 显隐
    domById('CTZ_LIST_VIDEO_SIZE_CUSTOM')!.style.display = pfConfig.zoomListVideoType === EZoomListVideoType.自定义尺寸 ? 'flex' : 'none';
  },
  content: async function () {
    const config = await myStorage.getConfig();
    const {
      commitModalSizeSameVersion,
      versionArticle,
      versionArticleIsPercent,
      versionArticlePercent,
      zoomImageType,
      zoomImageHeight,
      zoomImageHeightSize,
      zoomImageSize,
      zoomListVideoSize,
      zoomListVideoType,
      fixedListItemMore,
      listTitleTagQuestion,
      listTitleTagArticle,
      listTitleTagVideo,
      listTitleTagPin,
      themeDark = EThemeDark.深色一,
      themeLight = EThemeLight.默认,
      suspensionHomeTabPo,
      suspensionHomeTab,
      suspensionFindPo,
      suspensionUserPo,
      suspensionSearchPo,
      highlightListItem,
      linkShopping,
      fontSizeForList,
      fontSizeForAnswer,
      fontSizeForArticle,
      fontSizeForListTitle,
      fontSizeForAnswerTitle,
      fontSizeForArticleTitle,
      contentLineHeight,
    } = config;
    const dark = await isDark();

    /** 格式化百分比宽度设置 */
    const formatVersionPercentSize = (name: string) => (!config[`${name}IsPercent`] ? `${config[name] || '1000'}px` : `${config[`${name}Percent`] || '70'}vw`);

    const versionSizeHome = formatVersionPercentSize('versionHome');
    const versionSizeAnswer = formatVersionPercentSize('versionAnswer');
    const versionSizeArticle = formatVersionPercentSize('versionArticle');
    const versionSizeUserHome = formatVersionPercentSize('versionUserHome');
    const versionSizeCollection = formatVersionPercentSize('versionCollection');

    const NAME_HOME = '.Topstory-mainColumn,.SearchMain';
    const NAME_ANSWER = '.QuestionPage,.QuestionHeader-footer-inner,.QuestionHeader .QuestionHeader-content,.QuestionPage>div,.Question-mainColumn,.AnswersNavWrapper';
    const NAME_ARTICLE = '.Post-NormalSub>div,.zhuanlan .Post-Row-Content,.zhuanlan .css-pi1fiy';
    //.Post-NormalMain .Post-Header， ,.Post-NormalMain>div 旧的专栏 ,.zhuanlan .css-1xy3kyp ,.zhuanlan .css-1voxft1 ,.zhuanlan .css-9w3zhd,.zhuanlan .css-15k5nix,.zhuanlan .css-1byd3cx
    const NAME_USER_HOME = '#ProfileHeader,[itemprop="people"] .Profile-main';
    const NAME_COLLECTION = '.CollectionsDetailPage';

    /** 页面内容宽度 */
    const xxxWidth =
      // 首页列表页面内容宽度
      `${NAME_HOME}{width: ${versionSizeHome}!important;}` +
      // 回答详情页面内容宽度
      `${NAME_ANSWER}{width:min(${versionSizeAnswer},100%)!important;max-width:100%!important;min-width:0!important;margin-left:auto!important;margin-right:auto!important;padding:0;box-sizing:border-box!important;}` +
      // 文章页面内容宽度
      `${NAME_ARTICLE}{width: ${versionSizeArticle}!important;}` +
      `.zhuanlan .Post-SideActions{right: ${
        !versionArticleIsPercent ? `calc(50vw - ${+(versionArticle || '1000') / 2 + 150}px)` : `calc(50vw - ${+(versionArticlePercent || '70') / 2}vw + 150px)`
      }}` +
      // 用户主页宽度
      `${NAME_USER_HOME}{width: ${versionSizeUserHome}!important;}` +
      // 收藏夹宽度
      `${NAME_COLLECTION}{width: ${versionSizeCollection}!important}` +
      // 页面最小宽度
      `${NAME_HOME},${NAME_ANSWER},${NAME_ARTICLE},${NAME_USER_HOME},${NAME_COLLECTION}` +
      `,.${CLASS_ZHIHU_COMMENT_DIALOG},.Topstory-body .${CLASS_ZHIHU_COMMENT_DIALOG},.PostIndex-body .${CLASS_ZHIHU_COMMENT_DIALOG}` +
      `{min-width: ${VERSION_MIN_WIDTH}px!important;}` +
      // 弹窗宽度
      fnReturnStr(
        `.Topstory-body .${CLASS_ZHIHU_COMMENT_DIALOG}{width: ${versionSizeHome}!important;max-width:100vw;}` +
          `.PostIndex-body .${CLASS_ZHIHU_COMMENT_DIALOG}{width: ${versionSizeArticle}!important;max-width:100vw;}` +
          fnReturnStr(`.${CLASS_ZHIHU_COMMENT_DIALOG}{width: ${versionSizeAnswer}!important;max-width:100vw;}`, location.pathname.includes('question')) +
          fnReturnStr(`.${CLASS_ZHIHU_COMMENT_DIALOG}{width: ${versionSizeCollection}!important;max-width:100vw;}`, location.pathname.includes('collection')) +
          fnReturnStr(`.${CLASS_ZHIHU_COMMENT_DIALOG}{width: ${versionSizeUserHome}!important;max-width:100vw;}`, location.pathname.includes('people')),
        commitModalSizeSameVersion
      );

    /** 图片尺寸修改 */
    const xxxHiddenListArticleTopImg = zoomImageHeight === EZoomImageHeight.开启 || zoomImageType === EZoomImageType.自定义尺寸 ? '.ContentItem .css-75aco3{display: none;}' : '';

    const xxxImage =
      `img.lazy,img.origin_image,.GifPlayer img,.ArticleItem-image,.ztext figure .content_image,.ztext figure .origin_image,.TitleImage{${
        // 高度控制优先
        (zoomImageHeight === EZoomImageHeight.开启 ? `max-height: ${zoomImageHeightSize}px!important;width: auto!important;` : '') ||
        // 宽度控制在后
        (zoomImageType === EZoomImageType.自定义尺寸 ? `width: ${zoomImageSize}px!important;cursor: zoom-in!important;max-width: 100%!important;` : '')
      }}` + xxxHiddenListArticleTopImg;

    /** 列表视频回答内容尺寸修改 */
    const xxxVideo = `.ZVideoItem>div:first-of-type{${fnReturnStr(`width: ${zoomListVideoSize}px!important;`, zoomListVideoType === EZoomListVideoType.自定义尺寸)}}`;

    /** 列表更多按钮移动至题目右侧 */
    const xxxListMore = fnReturnStr(
      `.Topstory-container .ContentItem-actions .ShareMenu ~ div.ContentItem-action{visibility: visible!important;position: absolute;top: 20px;right: 10px;}`,
      fixedListItemMore
    );

    /** 内容标题添加类别显示 */
    const xxxTitleTag =
      fnReturnStr(
        `.AnswerItem .ContentItem-title::before{content:'「问答」';color:#ec7259;font-size:14px;}` +
          `.TopstoryQuestionAskItem .ContentItem-title::before{content:'「提问」';font-size:14px;color:#533b77}`,
        listTitleTagQuestion
      ) +
      fnReturnStr(`.ArticleItem .ContentItem-title::before{content:'「文章」';font-size:14px;color:#00965e}`, listTitleTagArticle) +
      fnReturnStr(
        `.ZvideoItem .ContentItem-title::before{content:'「视频」';font-size:14px;color:#12c2e9}.ZVideoItem .ContentItem-title::before{content:'「视频」';font-size:14px;color:#12c2e9}`,
        listTitleTagVideo
      ) +
      fnReturnStr(
        `.TopstoryItem .PinItem::before{content:'「想法」';font-size:14px;color:#9c27b0;margin-right:6px;font-weight:normal;display:inline;}.PinItem>.ContentItem-title{margin-top:4px;}`,
        listTitleTagPin
      );

    /** 首页问题列表切换模块悬浮 */
    const xxxSusHomeTab = fnReturnStr(
      `.Topstory-container .TopstoryTabs` +
        `{${suspensionHomeTabPo}position:fixed;z-index:100;display:flex;flex-direction:column;height:initial!important;}` +
        `.Topstory-container .TopstoryTabs>a{font-size:0 !important;border-radius:50%}` +
        `.Topstory-container .TopstoryTabs>a::after` +
        `{font-size:16px !important;display:inline-block;padding:6px 8px;margin-bottom:4px;border:1px solid #999999;color:#999999;background: ${
          dark ? THEME_CONFIG_DARK[themeDark].background : THEME_CONFIG_LIGHT[themeLight].background || 'transparent'
        };}` +
        `.Topstory-container .TopstoryTabs>a.TopstoryTabs-link {margin:0!important}` +
        `.Topstory-container .TopstoryTabs>a.TopstoryTabs-link.is-active::after{color:#0066ff!important;border-color:#0066ff!important;}` +
        `.Topstory [aria-controls='Topstory-recommend']::after{content:'推';}` +
        `.Topstory [aria-controls='Topstory-follow']::after{content:'关';border-top-left-radius:4px;border-top-right-radius:4px;}` +
        `.Topstory [aria-controls='Topstory-hot']::after{content:'热';}` +
        `.Topstory [aria-controls="Topstory-zvideo"]::after{content:'视';border-bottom-left-radius:4px;border-bottom-right-radius:4px}` +
        `.Topstory-tabs{border-color: transparent!important;}`,
      suspensionHomeTab
    );

    /** 顶部三大块悬浮 */
    const xxxSusHeader =
      `.position-suspensionFind{${suspensionFindPo}}` +
      `.position-suspensionUser{${suspensionUserPo}}` +
      `.position-suspensionSearch{${suspensionSearchPo}}` +
      `.position-suspensionFind .Tabs-link{border:1px solid #999999;color:#999999;background: ${
        dark ? THEME_CONFIG_DARK[themeDark].background : THEME_CONFIG_LIGHT[themeLight].background || 'transparent'
      };}` +
      `.position-suspensionFind .Tabs-link.is-active{color:#0066ff!important;border-color:#0066ff!important;}` +
      '.position-suspensionUser .css-1m60na {display: none;}.position-suspensionUser .css-1n0eufo{margin-right: 0;}';

    /** 列表内容点击高亮边框 */
    const xxxHighlight = highlightListItem
      ? `.List-item:focus,.TopstoryItem:focus,.HotItem:focus{box-shadow:0 0 0 2px #fff,0 0 0 5px rgba(0, 102, 255, 0.3)!important;outline:none!important;transition:box-shadow 0.3s!important;}`
      : `.List-item:focus,.Card:focus::before{box-shadow: none!important;}`;

    // 购物链接CSS
    const cssShoppingLinkObj = {
      [ELinkShopping.默认]: '',
      [ELinkShopping.仅文字]:
        '.MCNLinkCard-imageContainer,.MCNLinkCard-button,.MCNLinkCard-source' +
        ',.ecommerce-ad-commodity-img,.ecommerce-ad-commodity-box-icon,.RichText-MCNLinkCardContainer .BottomInfo' +
        ',.CPSCommonCard-imageBox,.RedPacketCard-imageBox,.CPSCommonCard-tool,.CPSCommonCard-subtitle' +
        ',.RedPacketCard-subtitle,.RedPacketCard-tool' +
        '{display: none!important;}' +
        //
        '.MCNLinkCard,.MCNLinkCard-card,.ecommerce-ad-commodity' +
        ',.RichText-MCNLinkCardContainer .GoodsRecommendCard,.CPSCommonCard,.RedPacketCard-info,.RedPacketCard' +
        '{min-height: 0!important;background: transparent!important;width:100%!important;max-width:100%!important;}' +
        //
        '.MCNLinkCard-cardContainer,.ecommerce-ad-commodity,.ecommerce-ad-commodity-main,.RedPacketCard,.CPSCommonCard' +
        '{padding: 0!important;}' +
        //
        '.MCNLinkCard,.MCNLinkCard-info{margin: 0!important;}' +
        //
        '.MCNLinkCard-info,.ecommerce-ad-commodity-main{flex-direction: row!important;}' +
        //
        '.MCNLinkCard-price{padding-left: 12px;}' +
        //
        '.ecommerce-ad-commodity-box .ecommerce-ad-commodity{height: auto!important;}' +
        //
        '.ecommerce-ad-commodity-box-main-second{width: auto!important;}' +
        //
        '.MCNLinkCard-titleContainer,.ecommerce-ad-commodity-main-content-des span,.CPSCommonCard-title,.RedPacketCard-title' +
        '{color: #fd8d55!important;justify-content: start!important;}' +
        //
        '.MCNLinkCard-titleContainer::before,.ecommerce-ad-commodity-main-content-des span::before' +
        ',.CPSCommonCard-title::before,.RedPacketCard-title::before' +
        '{content: "购物链接："}' +
        //
        '.MCNLinkCard-title{color: #fd8d55!important;}',
      [ELinkShopping.隐藏]: 'a.MCNLinkCard,.RichText-ADLinkCardContainer,.ecommerce-ad-commodity-box,.ecommerce-ad-box,.RichText-MCNLinkCardContainer{display: none!important;}',
    };

    const xxxShoppingLink = cssShoppingLinkObj[linkShopping || ELinkShopping.默认];

    /** 调整文字大小 */
    const xxxFontSize =
      // 列表文字大小
      fnReturnStr(
        `.Topstory-body .RichContent-inner,.Topstory-body .ctz-list-item-time,.Topstory-body .CommentContent` +
          `,.SearchResult-Card .RichContent-inner,.SearchResult-Card .CommentContent,.HotItem-excerpt--multiLine` +
          `{font-size: ${fontSizeForList}px!important;}`,
        !!fontSizeForList
      ) +
      // 回答文字大小
      fnReturnStr(`.QuestionPage .RichContent-inner,.QuestionPage .ctz-list-item-time,.QuestionPage .CommentContent{font-size: ${fontSizeForAnswer}px}`, !!fontSizeForAnswer) +
      // 文章文字大小
      fnReturnStr(`.zhuanlan .Post-RichTextContainer,.zhuanlan .ctz-article-create-time,.zhuanlan .CommentContent{font-size: ${fontSizeForArticle}px}`, !!fontSizeForArticle) +
      // 文章标题文字大小
      fnReturnStr(`.zhuanlan .Post-Main .Post-Title{font-size: ${fontSizeForArticleTitle}px;}`, !!fontSizeForArticleTitle) +
      // 列表标题文字大小
      fnReturnStr(`.ContentItem-title,.HotItem-title{font-size: ${fontSizeForListTitle}px!important;}`, !!fontSizeForListTitle) +
      // 回答标题文字大小
      fnReturnStr(`.QuestionHeader-title{font-size: ${fontSizeForAnswerTitle}px!important;}`, !!fontSizeForAnswerTitle) +
      // 行高
      fnReturnStr(`p {line-height: ${contentLineHeight}px;}`, !!contentLineHeight);

    /**
     * 主页布局补丁（随宽度样式一起注入）：
     * 新版知乎在 <header> 之下还有一层骨架，把内容区整体右移 100px，为左侧导航 rail 预留位置。
     * rail 被隐藏后这段空白仍然存在，表现为列表整体偏右、左侧留白远大于右侧。
     * 这里把 .Topstory-container 反向拉宽 100px 再居中，让主列在视口内居中。
     * 100px 是当前版本的 rail 常量，知乎调整导航宽度时需要同步这个值。
     */
    /**
     * 主页右栏九项全部隐藏时把整列移出布局。
     * 折叠态必须同时撤掉上面的 100px 反向拉宽，否则容器比视口宽 100px，会出现横向溢出。
     * 主列用 flex 撑满剩余空间，但保留「列表宽度」设定值作为上限（默认 1000px）并居中，
     * 与回答页观感一致：没有右栏占位、内容居中铺开，且宽度滑块仍然有效。
     */
    const xxxHomeNoSidebar =
      `html.ctz-home-no-sidebar .Topstory-container{width:100%!important;max-width:100%!important;margin-left:0!important;box-sizing:border-box!important}` +
      `html.ctz-home-no-sidebar .ctz-home-side-column{display:none!important}` +
      `html.ctz-home-no-sidebar .Topstory-mainColumn{width:auto!important;max-width:${versionSizeHome}!important;min-width:0!important;flex:1 1 auto!important;margin:0 auto!important}`;

    /**
     * :has() 降级（Firefox < 121 等）。
     * 上面的补丁有多条在选择器**中部**使用 :has()，老浏览器会把整条规则丢弃，
     * 只把根部 html:has(...) 换成类名救不回来，因此整体给一份不含 :has() 的等价规则，
     * 用 @supports not selector(:has(*)) 限定生效范围。
     * 所需类名由 syncHasFallbackClasses 维护：ctz-home-page / ctz-question-page /
     * ctz-home-rail / ctz-question-shell / ctz-question-col。
     */
    /**
     * 问题页布局补丁（v5.25.1）。
     *
     * 新版知乎问题页的外层骨架是 flex 行，直接子元素包含左导航 <aside> 与若干空 spacer。
     * 只隐藏 rail 内部的 nav.css-7guej9 并不能回收这些 flex item 的占位，内容整体右移
     * 约 176px，表现为「左侧留白远大于右侧」。这里把骨架改成普通块级容器、隐藏不含
     * 内容列的直接子元素，再用 margin-inline:auto + min() 钳制让内容在不同视口下真居中。
     *
     * :has() 分支与 @supports 回退分支共用同一份 rules 数组，声明逐字一致，避免行为分叉。
     * 回退分支所需的类名由 syncHasFallbackClasses() 维护。
     */
    const questionLayoutCss = (branch: 'has' | 'fallback') => {
      const rules: { has: string; fallback: string; decl: string }[] = [
        {
          has: 'html:has(.QuestionPage) div:has(> aside):has(.App-main)',
          fallback: 'html.ctz-question-page .ctz-question-flex-shell',
          decl: 'display:block!important;width:100%!important;max-width:100%!important;margin:0!important;padding:0!important;box-sizing:border-box!important'
        },
        {
          has: 'html:has(.QuestionPage) div:has(> aside):has(.App-main) > :not(:has(.App-main))',
          fallback: 'html.ctz-question-page .ctz-question-flex-shell > :not(.ctz-question-shell)',
          decl: 'display:none!important'
        },
        {
          has: 'html:has(.QuestionPage) div:has(> aside):has(.App-main) > :has(.App-main)',
          fallback: 'html.ctz-question-page .ctz-question-flex-shell > .ctz-question-shell',
          decl: 'display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:0!important;box-sizing:border-box!important'
        },
        {
          has: 'html:has(.QuestionPage) .App-main',
          fallback: 'html.ctz-question-page .App-main',
          decl: 'display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:0!important;box-sizing:border-box!important'
        },
        {
          has: 'html:has(.QuestionPage) .QuestionPage>:has(.Question-mainColumn)',
          fallback: 'html.ctz-question-page .ctz-question-col',
          decl: 'width:100%!important;max-width:100%!important;margin:0 auto!important;padding-left:0!important'
        },
        {
          has: 'html:has(.QuestionPage) .QuestionPage :has(>.Question-mainColumn)',
          fallback: 'html.ctz-question-page .ctz-question-col',
          decl: 'width:100%!important;max-width:100%!important;padding:0!important;margin:0!important'
        },
        {
          has: 'html:has(.QuestionPage) .QuestionPage,html:has(.QuestionPage) .QuestionPage > div,html:has(.QuestionPage) .Question-mainColumn,html:has(.QuestionPage) .AnswersNavWrapper,html:has(.QuestionPage) .QuestionHeader-content,html:has(.QuestionPage) .QuestionHeader-footer-inner',
          fallback: 'html.ctz-question-page .QuestionPage,html.ctz-question-page .QuestionPage > div,html.ctz-question-page .Question-mainColumn,html.ctz-question-page .AnswersNavWrapper,html.ctz-question-page .QuestionHeader-content,html.ctz-question-page .QuestionHeader-footer-inner',
          decl: `width:min(${versionSizeAnswer},100%)!important;max-width:100%!important;min-width:0!important;margin-left:auto!important;margin-right:auto!important;padding-left:0!important;padding-right:0!important;position:static!important;left:auto!important;right:auto!important;box-sizing:border-box!important`
        },
        {
          has: 'html:has(.QuestionPage) .QuestionPage .Question-mainColumn',
          fallback: 'html.ctz-question-page .QuestionPage .Question-mainColumn',
          decl: 'position:static!important;left:auto!important'
        },
        {
          has: 'html:has(.QuestionPage) nav.css-7guej9',
          fallback: 'html.ctz-question-page nav.css-7guej9',
          decl: 'display:none!important'
        }
      ];
      return rules.map((rule) => `${rule[branch]}{${rule.decl}}`).join('');
    };
    const xxxQuestionPageHas = questionLayoutCss('has');
    const xxxHasFallback =
      `@supports not selector(:has(*)){` +
      `html.ctz-home-page .ctz-home-rail{display:none!important}` +
      `html.ctz-home-page .Topstory-container{width:calc(100% + 100px)!important;max-width:none!important;margin-left:-100px!important;justify-content:center!important}` +
      questionLayoutCss('fallback') +
      `}`;

    return xxxFontSize + xxxHighlight + xxxImage + xxxListMore + xxxShoppingLink + xxxShoppingLink + xxxSusHeader + xxxSusHomeTab + xxxTitleTag + xxxVideo + xxxWidth +
      `html:has(.Topstory-container) :has(>a[href$="/column-square"]):has(>a[href$="/ring-feeds"]){display:none!important}html:has(.Topstory-container) .Topstory-container{width:calc(100% + 100px)!important;max-width:none!important;margin-left:-100px!important;justify-content:center!important}` +
      xxxQuestionPageHas + xxxHomeNoSidebar + xxxHasFallback;
  },
};

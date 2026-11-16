import { IHiddenItem } from '../types';

export const HIDDEN_ITEM_COMMON: IHiddenItem = {
  key: 'CTZ_HIDDEN_COMMON',
  name: '通用',
  desc: '',
  content: [
    [
      {
        label: '隐藏修改器弹出图标 ⚙︎',
        value: 'hiddenOpenButton',
        css: '#CTZ_OPEN_CLOSE{display:none!important;}',
      },
    ],
    [
      {
        label: '广告',
        value: 'hiddenAD',
        css: '.pc-article-answer-big-img,.pc-article-answer,.TopstoryItem--advertCard,.Pc-card,.Pc-word,.RichText-ADLinkCardContainer,.Pc-Business-Card-PcTopFeedBanner,.ZhiGoodsCard,.Pc-word-new,.Business-Card-PcRightBanner-link,.pc-article-answer-text-chain{display: none!important;}',
      },
    ],
    [
      {
        label: '隐藏选中文字后的弹窗模块',
        value: 'hiddenSelectedTextPopup',
        css: '.css-fg13ww,.css-fg13ww + svg{display: none!important;}',
      },
    ],
    [
      {
        label: 'LOGO',
        value: 'hiddenLogo',
        css: '.ZhihuLogoLink,.TopTabNavBar-logo-3d0k,[aria-label="知乎"],.TopNavBar-logoContainer-vDhU2,.zu-top-link-logo{display: none!important;}',
      },
      {
        label: '顶部悬浮模块',
        value: 'hiddenHeader',
        css: '.AppHeader,.ColumnPageHeader-Wrapper,#root .css-1g41cri{display: none!important;}.PubIndex-CategoriesHeader{top: 0!important;}',
      },
      // {
      //   label: '滚动顶部悬浮模块/问题名称',
      //   value: 'hiddenHeaderScroll',
      //   css: '.AppHeader.is-fixed{display:none!important;}.zhuanlan .css-f2kkrj{top:0;}',
      // },
    ],
    [
      {
        label: '隐藏首页分享想法模块',
        value: 'hiddenHomeWriteArea',
        css: '.Topstory-mainColumn .WriteArea{display: none}',
      },
      {
        label: '顶部菜单栏 - 关注',
        value: 'hiddenHeaderFollow',
        css: '.AppHeader a[href="https://www.zhihu.com/follow"]{display:none}',
      },
      {
        label: '顶部菜单栏 - 推荐',
        value: 'hiddenHeaderRecommend',
        css: '.AppHeader a[href="https://www.zhihu.com/"]{display:none}',
      },
      {
        label: '顶部菜单栏 - 热榜',
        value: 'hiddenHeaderHot',
        css: '.AppHeader a[href="https://www.zhihu.com/hot"]{display:none}',
      },
      {
        label: '顶部菜单栏 - 专栏',
        value: 'hiddenHeaderColumnSquare',
        css: '.AppHeader a[href="https://www.zhihu.com/column-square"]{display:none}',
      },
      {
        label: '顶部菜单栏 - 圈子',
        value: 'hiddenHeaderColumnRingFeeds',
        css: '.AppHeader a[href="https://www.zhihu.com/ring-feeds"]{display:none}',
      },
      // {
      //   label: '顶部菜单栏 - 付费咨询',
      //   value: 'hiddenHeaderConsult',
      //   css: '.AppHeader a[href="https://www.zhihu.com/consult"]{display:none}',
      // },
      // {
      //   label: '顶部菜单栏 - 知学堂',
      //   value: 'hiddenHeaderEducationLearning',
      //   css: '.AppHeader a[href="https://www.zhihu.com/education/learning"]{display:none}',
      // },
      // {
      //   label: '顶部菜单栏 - 直答',
      //   value: 'hiddenHeaderZhida',
      //   css: '.AppHeader a[href="https://zhida.zhihu.com/"]{display:none}',
      // },
      {
        label: '顶部菜单栏 - AI Works',
        value: 'hiddenHeaderSquare',
        css: '.AppHeader a[href="https://www.zhihu.com/project/square"]{display:none}',
      },
      {
        label: '顶部菜单栏 - 故事',
        value: 'hiddenHeaderVipWeb',
        css: '.AppHeader a[href="https://www.zhihu.com/fiore/h5/vip-web"]{display:none}',
      },

      // {
      //   label: '顶部发现模块-首页',
      //   value: 'hiddenAppHeaderTabHome',
      //   css: '.AppHeader-Tab:nth-of-type(1){display: none}',
      // },
      // {
      //   label: '顶部发现模块-知乎直答',
      //   value: 'hiddenAppHeaderTabFind',
      //   css: '.AppHeader-Tab:nth-of-type(2){display: none}',
      // },
      // {
      //   label: '顶部发现模块-知学堂',
      //   value: 'hiddenAppHeaderTabZhi',
      //   css: '.AppHeader-Tab:nth-of-type(3){display: none}',
      // },
      // {
      //   label: '顶部发现模块-等你来答',
      //   value: 'hiddenAppHeaderTabWaitingForYou',
      //   css: '.AppHeader-Tab:nth-of-type(4){display: none}',
      // },
    ],
    // [
    //   {
    //     label: '回答隐藏用户信息下的附加信息，比如：你赞同过、XXX赞同了等...',
    //     value: 'hiddenWhoVoters',
    //     css: '.css-1vqda4a{display: none!important;}',
    //   },
    // ],
    [
      {
        label: '回答和文章中的知学堂推广商品模块',
        value: 'hiddenZhihuZhiShop',
        css: '.RichText-EduCardContainer{display:none;}',
      },
    ],
  ],
};

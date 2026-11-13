import { IHiddenItem } from '../types';

export const HIDDEN_ITEM_LIST: IHiddenItem = {
  key: 'CTZ_HIDDEN_LIST',
  name: '列表页面',
  desc: '只在列表中隐藏相应内容',
  content: [
    [
      {
        label: '顶部分享此刻想法',
        value: 'hiddenWriteArea',
        css: '.Topstory .WriteArea{display:none;}',
      },
    ],
    [
      {
        label: '创作中心',
        value: 'hiddenHomeCreatorEntrance',
        css: '.Topstory .css-19idom{display: none;}',
      },
      {
        label: '圈子',
        value: 'hiddenHomeQuanzi',
        css: '.Card.css-18gpi2u{display:none;}',
      },
      {
        label: '盐选作者平台',
        value: 'hiddenYanXuanWriter',
        css: '.KfeCollection-CreateSaltCard,[class*="CreateSaltCard"],[class*="SaltCard"]{display:none!important;}',
      },
      {
        label: '推荐关注',
        value: 'hiddenHomeRecommendFollow',
        css: '.Topstory .css-1iaxl4o,.Topstory [class*="RecommendFollow"],[class*="RecommendFollow"]{display:none!important;}',
      },
      {
        label: '分类圆桌',
        value: 'hiddenHomeCategory',
        css: '.Topstory .GlobalSideBar-category{display: none;}',
      },
      {
        label: '更多分类（我的收藏、关注的问题等...）',
        value: 'hiddenHomeCategoryMore',
        css: '.Topstory .Card[aria-label="更多分类入口"]{display:none;}',
      },
      {
        label: '知乎指南',
        value: 'hiddenHomeFooter',
        css: '.Topstory .Footer,.Topstory footer{display: none;}',
      },
      {
        label: '大家都在搜',
        value: 'hiddenHomeHotSearch',
        css: '.Topstory .HotSearchCard{display: none;}',
      },
      {
        label: '付费咨询',
        value: 'hiddenHomePayAsk',
        css: '.Topstory .css-1dyj6jm{display:none;}',
      },
    ],
    [
      {
        label: '列表切换模块',
        value: 'hiddenHomeListTab',
        css: '.Topstory-container .TopstoryTabs{display: none}',
      },
      {
        label: '列表切换 - 关注',
        value: 'hiddenHomeListTabFollow',
        css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-follow"]{display: none}',
      },
      {
        label: '列表切换 - 推荐',
        value: 'hiddenHomeListTabRecommend',
        css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-recommend"]{display: none}',
      },
      {
        label: '列表切换 - 热榜',
        value: 'hiddenHomeListTabHot',
        css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-hot"]{display: none}',
      },
      {
        label: '列表切换 - 视频',
        value: 'hiddenHomeListTabVideo',
        css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-zvideo"]{display: none}',
      },
    ],
    [
      {
        label: '列表内容',
        value: 'hiddenAnswers',
        css:
          '.Topstory-container .RichContent.is-collapsed .RichContent-inner,.HotItem-excerpt--multiLine' +
          ',.TopstoryQuestionAskItem .RichContent .RichContent-inner,.HotItem-content .HotItem-excerpt' +
          ',.Topstory-recommend .ZVideoItem-video, .Topstory-recommend .VideoAnswerPlayer' +
          '{display: none;}',
      },
      {
        label: '列表视频',
        value: 'hiddenListVideoContent',
        css: '.Topstory-recommend .ZVideoItem-video,.Topstory-recommend .VideoAnswerPlayer,.Topstory-recommend .ZVideoItem .RichContent{display: none;}',
      },
      {
        label: '列表图片',
        value: 'hiddenListImg',
        css: '.RichContent-cover,.HotItem-img,.TopstoryItem .Image-Wrapper-Preview{display:none!important;}.HotItem-metrics--bottom{position: initial!important;}',
      },
      {
        label: '列表阅读全文文字',
        value: 'hiddenReadMoreText',
        css: '.ContentItem-more{font-size:0!important;}',
      },
      {
        label: '列表"亲自答"标签',
        value: 'hiddenListAnswerInPerson',
        css: '.Topstory-mainColumn .LabelContainer{display: none;}',
      },
    ],
    // [
    //   {
    //     label: '关注列表关注人操作',
    //     value: 'hiddenFollowAction',
    //     css: '.TopstoryItem-isFollow .FeedSource-firstline{display: none;}',
    //   },
    //   {
    //     label: '关注列表用户信息',
    //     value: 'hiddenFollowChooseUser',
    //     css: '.TopstoryItem-isFollow .AuthorInfo{display: none;}',
    //   },
    // ],
    [
      {
        label: '热榜排序编号',
        value: 'hiddenHotItemIndex',
        css: '.HotItem-index{display: none;}.HotItem{padding: 16px!important;}',
      },
      {
        label: '热榜"新"元素',
        value: 'hiddenHotItemLabel',
        css: '.HotItem-label{display: none;}',
      },
      {
        label: '热榜热度值',
        value: 'hiddenHotItemMetrics',
        css: '.HotItem-content .HotItem-metrics{display: none;}',
      },
      {
        label: '热榜顶部滚动新闻',
        value: 'hiddenHotTopNews',
        css: '#TopstoryContent .css-172osot{display:none;}',
      },
    ],
    [
      {
        label: '搜索栏大家都在搜',
        value: 'hiddenSearchBoxTopSearch',
        css: '.Search-container .HotSearchCard{display:none;}',
      },
      {
        label: '搜索页知乎热搜',
        value: 'hiddenSearchPageTopSearch',
        css: '.Search-container .TopSearch{display: none;}',
      },
      {
        label: '搜索页知乎指南',
        value: 'hiddenSearchPageFooter',
        css: '.Search-container .Footer,.Search-container footer{display: none;}',
      },
      {
        label: '搜索结果知乎直达',
        value: 'hiddenSearchResultZhida',
        css: '.Search-container .css-q1rdu9{display: none;}',
      },
    ],
  ],
};

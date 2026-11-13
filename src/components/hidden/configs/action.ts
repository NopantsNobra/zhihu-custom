import { IHiddenItem } from '../types';

export const HIDDEN_ITEM_ACTION: IHiddenItem = {
  key: 'CTZ_HIDDEN_ACTION',
  name: '操作栏',
  desc: '',
  content: [
    [
      {
        label: '推荐、关注列表操作栏',
        value: 'hiddenItemActions',
        css: '#TopstoryContent .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;padding:0;}',
      },
      {
        label: '推荐、关注列表操作栏 - 底部悬浮',
        value: 'hiddenItemActionsIsFixed',
        css: '#TopstoryContent .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '搜索页列表操作栏',
        value: 'hiddenItemActionsSearch',
        css: '#SearchMain .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}',
      },
      {
        label: '搜索页列表操作栏 - 底部悬浮',
        value: 'hiddenItemActionsIsFixedSearch',
        css: '#SearchMain .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '问题页面详情操作栏',
        value: 'hiddenQuestionActions',
        css: '.QuestionButtonGroup,.QuestionHeaderActions{display: none!important;}',
      },
      {
        label: '问题页面回答内容操作栏',
        value: 'hiddenAnswerItemActions',
        css: '.Question-mainColumn .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}',
      },
      {
        label: '问题页面回答内容操作栏 - 底部悬浮',
        value: 'hiddenFixedActions',
        css: '.Question-mainColumn .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '文章页面底部悬浮操作栏',
        value: 'hiddenZhuanlanActions',
        css: '.zhuanlan .RichContent-actions.is-fixed>.ContentItem-actions{display: none;}',
      },
    ],
    [
      {
        label: '收藏夹列表操作栏',
        value: 'hiddenItemActionsCollection',
        css: '.CollectionsDetailPage-mainColumn .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}',
      },
      {
        label: '收藏夹列表操作栏 - 底部悬浮',
        value: 'hiddenItemActionsIsFixedCollection',
        css: '.CollectionsDetailPage-mainColumn .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '个人主页动态、回答、文章等操作栏',
        value: 'hiddenItemActionsUser',
        css: '.Profile-mainColumn .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}',
      },
      {
        label: '个人主页动态、回答、文章等操作栏 - 底部悬浮',
        value: 'hiddenItemActionsIsFixedUser',
        css: '.Profile-mainColumn .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '评论「回复」按钮',
        value: 'hiddenCommitReply',
        css: '.Comments-container .css-140jo2 button:first-of-type{display:none;}',
      },
      {
        label: '评论「点赞」按钮',
        value: 'hiddenCommitVote',
        css: '.Comments-container .css-140jo2 button:last-of-type{display:none;}',
      },
      {
        label: '评论底部信息',
        value: 'hiddenCommitBottom',
        css: '.Comments-container .css-140jo2{display:none;}',
      },
    ],
  ],
};

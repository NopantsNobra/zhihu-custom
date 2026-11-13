import { IHiddenItem } from '../types';

export const HIDDEN_ITEM_ARTICLE: IHiddenItem = {
  key: 'CTZ_HIDDEN_ARTICLE',
  name: '文章专栏',
  desc: '只在文章页面/文章内容中隐藏相应内容',
  content: [
    [
      {
        label: '文章关联话题',
        value: 'hiddenZhuanlanTag',
        css: '.Post-topicsAndReviewer{display: none!important;}',
      },
      {
        label: '文章标题图片',
        value: 'hiddenZhuanlanTitleImage',
        css: '.zhuanlan .Post-Row-Content-left-article .css-1ac3ifk{display: none!important;}',
        // css: '.css-1ntkiwo,.TitleImage,.css-78p1r9,.ArticleItem .RichContent>div:first-of-type:not(.RichContent-cover)>div:last-of-type{display: none!important;}',
      },
      // {
      //   label: '文章悬浮分享按钮',
      //   value: 'hiddenZhuanlanShare',
      //   css: '.zhuanlan .Post-SideActions .Popover.ShareMenu{display: none!important;}',
      // },
      // {
      //   label: '文章悬浮赞同按钮',
      //   value: 'hiddenZhuanlanVoters',
      //   css: '.zhuanlan .Post-SideActions .like{display: none!important;}',
      // },
      // {
      //   label: '文章底部知乎热榜',
      //   value: 'hiddenZhuanlanButtonHot',
      //   css: '.zhuanlan .Post-Sub .css-1ildg7g{display: none;}',
      // },
      {
        label: '文章所属专栏',
        value: 'hiddenZhuanlanContributions',
        css: '.zhuanlan .PostIndex-Contributions,.zhuanlan .css-3ibr72{display: none;}',
      },
      {
        label: '推荐阅读',
        value: 'hiddenZhuanlan',
        css: '.zhuanlan .Post-NormalSub{display:none;}',
      },
    ],
    [
      {
        label: '文章作者头像',
        value: 'hiddenZhuanlanAvatarWrapper',
        css: '.zhuanlan .AuthorInfo-avatarWrapper{display: none;}.zhuanlan .AuthorInfo-content{margin-left:0;}',
      },
      {
        label: '文章作者姓名',
        value: 'hiddenZhuanlanAuthorInfoHead',
        css: '.zhuanlan .AuthorInfo-head{display: none;}',
      },
      {
        label: '文章作者简介',
        value: 'hiddenZhuanlanAuthorInfoDetail',
        css: '.zhuanlan .AuthorInfo-detail{display: none;}',
      },
      {
        label: '文章作者关注按钮',
        value: 'hiddenZhuanlanFollowButton',
        css: '.zhuanlan .FollowButton{display: none;}',
      },
      {
        label: '关于作者',
        value: 'hiddenZhuanlanAuthorCard',
        css: '.zhuanlan .Card.AuthorCard{display:none}',
      },
      {
        label: '大家都在搜',
        value: 'hiddenZhuanlanHotSearchCard',
        css: '.zhuanlan .HotSearchCard{display:none}',
      },
    ],
  ],
};

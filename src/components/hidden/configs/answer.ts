import { IHiddenItem } from '../types';

export const AnswerRightHidden = '.Question-sideColumn{display: none!important;}.Question-mainColumn{width: auto;}';

/** 回答 */
export const HIDDEN_ITEM_ANSWER: IHiddenItem = {
  key: 'CTZ_HIDDEN_ANSWER',
  name: '问答页面',
  desc: '只在问答页面/回答内容中隐藏相应内容',
  content: [
    [
      {
        label: '问题话题',
        value: 'hiddenQuestionTag',
        css: '.QuestionHeader-tags,.QuestionHeader .css-wmwsyx{display: none!important;}',
      },
      {
        label: '问题分享按钮',
        value: 'hiddenQuestionShare',
        css: '.zhihu .QuestionHeaderActions .Popover.ShareMenu{display: none!important;}',
      },
      {
        label: '"好问题"按钮',
        value: 'hiddenQuestionGoodQuestion',
        css: '.QuestionPage .QuestionHeader .GoodQuestionAction{display: none}',
      },
      {
        label: '问题添加评论按钮',
        value: 'hiddenQuestionComment',
        css: '.QuestionPage .QuestionHeader .QuestionHeader-Comment{display: none}',
      },
      {
        label: '问题"..."按钮',
        value: 'hiddenQuestionMore',
        css: '.QuestionPage .QuestionHeader [aria-label="更多"]{display: none;}',
      },
      {
        label: '问题专题收录标签',
        value: 'hiddenQuestionSpecial',
        css: '.QuestionHeader .LabelContainer-wrapper{display: none;}',
      },
      {
        label: '问题关注按钮',
        value: 'hiddenQuestionFollowing',
        css: '.QuestionHeader .FollowButton{display: none;}',
      },
      {
        label: '问题写回答按钮',
        value: 'hiddenQuestionAnswer',
        css: '.QuestionHeader .FollowButton ~ button{display: none;}',
      },
      {
        label: '问题邀请回答按钮',
        value: 'hiddenQuestionInvite',
        css: '.QuestionHeader .QuestionHeaderActions>button:first-child{display: none;}',
      },
      {
        label: '问题标题卡片广告和榜单',
        value: 'hiddenQuestionAD',
        css: '.css-e69dqy,.Card.css-15hh8yc{display: none;}',
      },
      {
        label: '问题关注和被浏览数模块',
        value: 'hiddenQuestionSide',
        css: '.QuestionHeader-side{display: none;}.QuestionHeader-main{flex: 1!important;}',
      },
    ],
    [
      {
        label: '查看全部回答按钮',
        value: 'hiddenQuestionViewAll',
        css: '.Question-mainColumn .ViewAll{display:none;}',
      },
    ],
    [
      {
        label: '回答人头像',
        value: 'hiddenDetailAvatar',
        css: '.AnswerItem .AuthorInfo .AuthorInfo-avatarWrapper{display: none;}.AnswerItem .AuthorInfo .AuthorInfo-content{margin-left:0!important;}',
      },
      {
        label: '回答人姓名',
        value: 'hiddenDetailName',
        css: '.AnswerItem .AuthorInfo .AuthorInfo-head{display: none;}',
      },
      {
        label: '回答人简介',
        value: 'hiddenDetailBadge',
        css: '.AnswerItem .AuthorInfo .AuthorInfo-detail{display: none;}',
      },
      {
        label: '回答人关注按钮',
        value: 'hiddenDetailFollow',
        css: '.AnswerItem .AuthorInfo .FollowButton{display: none;}',
      },
      {
        label: '回答人下赞同数',
        value: 'hiddenDetailVoters',
        css: '.AnswerItem .css-dvccr2{display: none;}',
      },
      {
        label: '回答人下方标签',
        value: 'hiddenAnswerDownTags',
        css: '.css-9x8rdd{display: none;margin: 0;}',
      },
      {
        label: '回答「谢邀」标签',
        value: 'hiddenThanksInvite',
        css: '.css-1l65l8l{display: none;margin: 0;}',
      },
    ],
    [
      {
        label: '回答底部发布编辑时间和IP',
        value: 'hiddenAnswerItemTime',
        css: '.QuestionPage .ContentItem-time{display: none;margin: 0;}',
      },
      {
        label: '回答底部发布编辑时间（保留IP）',
        value: 'hiddenAnswerItemTimeButHaveIP',
        css: '.QuestionPage .ContentItem-time>a,.RichContent .ContentItem-time>a{display: none;}.QuestionPage .ContentItem-time:empty{display: none;margin: 0;}',
      },
      {
        label: '回答底部「继续追问」模块',
        value: 'hiddenAnswerKeepAsking',
        css: '.css-jghqwm{display: none!important;}',
      },
      {
        label: '回答内容「所属专栏」模块',
        value: 'hiddenAnswerBelongZhuanlan',
        css: '.css-3ibr72,.css-n4rzfz{display: none!important;}',
      },
      {
        label: '回答内容赞赏按钮',
        value: 'hiddenReward',
        css: '.Reward{display: none!important;}',
      },
      {
        label: '回答内容618红包链接',
        value: 'hidden618HongBao',
        css: '.MCNLinkCard[data-mcn-source="淘宝"],.MCNLinkCard[data-mcn-source="京东"],.MCNLinkCard[data-mcn-source="知乎"]{display:none;}',
      },
      {
        label: '回答内容底部热评',
        value: 'hiddenAnswerBottomComment',
        css: '.css-7v0dz0{display: none!important;}',
      },
    ],
    [
      {
        label: '问答页面右侧信息栏',
        value: 'hiddenAnswerRightFooter',
        css: AnswerRightHidden,
      },
      {
        label: '问答页面信息栏 - 关于作者',
        value: 'hiddenAnswerRightFooterAnswerAuthor',
        css: '.Question-sideColumn .AnswerAuthor{display: none;}',
      },
      {
        label: '问答页面信息栏 - 被收藏次数',
        value: 'hiddenAnswerRightFooterFavorites',
        css: '.Question-sideColumn .AnswerAuthor + .Card{display: none;}',
      },
      {
        label: '问答页面信息栏 - 相关问题',
        value: 'hiddenAnswerRightFooterRelatedQuestions',
        css: '.Question-sideColumn [data-za-detail-view-path-module="RelatedQuestions"]{display: none;}',
      },
      {
        label: '问答页面信息栏 - 相关推荐',
        value: 'hiddenAnswerRightFooterContentList',
        css: '.Question-sideColumn [data-za-detail-view-path-module="ContentList"]{display: none;}',
      },
      {
        label: '问答页面信息栏 - 知乎指南',
        value: 'hiddenAnswerRightFooterFooter',
        css: '.Question-sideColumn footer{display: none;}',
      },
      {
        label: '问答页面信息栏 - 大家都在搜',
        value: 'hiddenAnswerRightHotSearchCard',
        css: '.Question-sideColumn .HotSearchCard{display: none;}',
      },
    ],
  ],
};

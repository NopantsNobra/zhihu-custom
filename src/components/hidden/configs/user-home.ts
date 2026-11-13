import { IHiddenItem } from '../types';

export const HIDDEN_ITEM_USER_HOME: IHiddenItem = {
  key: 'CTZ_HIDDEN_USER_HOME',
  name: '用户主页',
  desc: '只在用户主页隐藏相应内容',
  content: [
    [
      {
        label: '用户主页付费咨询、认证和成就',
        value: 'hiddenUserHomeOtherCard',
        css: '.Profile-sideColumn .Card:not(.Publications):not(.FollowshipCard){display:none;}',
      },
      {
        label: '用户主页出版作品',
        value: 'hiddenUserHomePublications',
        css: '.Profile-sideColumn .Card.Publications{display:none;}',
      },
      {
        label: '用户主页创作中心',
        value: 'hiddenUserHomeCreateEntrance',
        css: '.Profile-sideColumn .CreatorEntrance{display:none;}',
      },
      {
        label: '用户主页关注和关注者卡片',
        value: 'hiddenUserHomeFollow',
        css: '.Profile-sideColumn .FollowshipCard{display:none;}',
      },
      {
        label: '用户主页关注的内容和赞助',
        value: 'hiddenUserHomeLightList',
        css: '.Profile-sideColumn .Profile-lightList{display:none;}',
      },
      {
        label: '用户主页右侧屏蔽·举报用户、个人主页被浏览次数',
        value: 'hiddenUserHomeFooterOperate',
        css: '.Profile-sideColumn .Profile-footerOperations{display:none;}',
      },
      {
        label: '用户主页知乎指南',
        value: 'hiddenUserHomeFooter',
        css: '.Profile-sideColumn footer{display:none;}',
      },
    ],
  ],
};

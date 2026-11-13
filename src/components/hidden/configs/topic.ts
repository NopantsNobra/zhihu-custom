import { IHiddenItem } from '../types';

export const HIDDEN_ITEM_TOPIC: IHiddenItem = {
  key: 'CTZ_HIDDEN_TOPIC',
  name: '话题',
  desc: '只在话题隐藏相应内容',
  content: [
    [
      {
        label: '话题主页右侧浏览/讨论量模块',
        value: 'hiddenTopicRightNumberBoard',
        css: '[data-za-detail-view-path-module="TopicItem"] .Card .NumberBoard{display:none;}',
      },
      {
        label: '话题主页右侧父子话题模块',
        value: 'hiddenTopicRightParentChild',
        css: '[data-za-detail-view-path-module="TopicItem"] .Card .Card-section{display:none;}',
      },
      {
        label: '话题主页右侧知乎指南',
        value: 'hiddenTopicRightFooter',
        css: '[data-za-detail-view-path-module="TopicItem"] footer{display:none;}',
      },
    ],
  ],
};

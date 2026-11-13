import { IHiddenItem } from '../types';

export const HIDDEN_ITEM_COLLECTIONS: IHiddenItem = {
  key: 'CTZ_HIDDEN_USER_COLLECTIONS',
  name: '收藏夹',
  desc: '只在我的收藏夹隐藏相应内容',
  content: [
    [
      {
        label: '收藏夹创作中心',
        value: 'hiddenCollectionsCreate',
        css: '.Collections-container .Card.CreatorEntrance{display:none;}',
      },
      {
        label: '收藏夹推荐关注',
        value: 'hiddenCollectionsRecommendFollow',
        css: '.Collections-container [data-za-detail-view-path-module="RightSideBar"]>div:last-of-type>.Card{display:none;}',
      },
      {
        label: '收藏夹圆桌入口',
        value: 'hiddenCollectionsCategory',
        css: '.Collections-container .Card.GlobalSideBar-category{display:none;}',
      },
      {
        label: '收藏夹更多分类',
        value: 'hiddenCollectionsComplementary',
        css: '.Collections-container .Card[aria-label="更多分类入口"]{display:none;}',
      },
      {
        label: '收藏夹知乎指南',
        value: 'hiddenCollectionsFooter',
        css: '.Collections-container footer{display:none;}',
      },
    ],
  ],
};

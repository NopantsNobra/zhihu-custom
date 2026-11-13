import { AnswerRightHidden } from './answer';

/** 多个配置影响到的隐藏内容 */
export const HIDDEN_ARRAY_MORE = [
  {
    keys: [
      'hiddenUserHomeOtherCard',
      'hiddenUserHomePublications',
      'hiddenUserHomeCreateEntrance',
      'hiddenUserHomeFollow',
      'hiddenUserHomeLightList',
      'hiddenUserHomeFooterOperate',
      'hiddenUserHomeFooter',
    ],
    value: '.Profile-sideColumn{display: none}',
  },
  {
    keys: ['hiddenSearchPageTopSearch', 'hiddenSearchPageFooter'],
    value: '.SearchSideBar{display: none}',
  },
  {
    keys: ['hiddenHomeCreatorEntrance', 'hiddenHomeRecommendFollow', 'hiddenHomeCategory', 'hiddenHomeCategoryMore', 'hiddenHomeFooter'],
    value: '.Topstory-mainColumn{margin: 0 auto;}',
  },
  {
    keys: ['hiddenHomeListTabFollow', 'hiddenHomeListTabRecommend', 'hiddenHomeListTabHot', 'hiddenHomeListTabVideo'],
    value: '.Topstory-container .TopstoryTabs{display: none}',
  },
  {
    keys: ['hiddenTopicRightNumberBoard', 'hiddenTopicRightParentChild', 'hiddenTopicRightFooter'],
    value: '[data-za-detail-view-path-module="TopicItem"]>div:nth-child(2){display: none;}',
  },
  {
    keys: ['hiddenHeaderEducationLearning', 'hiddenHeaderConsult'],
    value: '.AppHeader .css-53paqb{display: none;}',
  },
  {
    keys: [
      'hiddenAnswerRightFooterAnswerAuthor',
      'hiddenAnswerRightFooterFavorites',
      'hiddenAnswerRightFooterFavorites',
      'hiddenAnswerRightFooterRelatedQuestions',
      'hiddenAnswerRightFooterContentList',
      'hiddenAnswerRightFooterFooter',
      'hiddenAnswerRightHotSearchCard',
    ],
    value: AnswerRightHidden,
  },
];

import { IHiddenArray } from '../types';
import { HIDDEN_ITEM_ACTION } from './action';
import { HIDDEN_ITEM_ANSWER } from './answer';
import { HIDDEN_ITEM_ARTICLE } from './article';
import { HIDDEN_ITEM_COLLECTIONS } from './collections';
import { HIDDEN_ITEM_COMMON } from './common';
import { HIDDEN_ITEM_LIST } from './list';
import { HIDDEN_ITEM_TOPIC } from './topic';
import { HIDDEN_ITEM_USER_HOME } from './user-home';

/** 勾选隐藏对应内容 */
export const HIDDEN_ARRAY: IHiddenArray = [
  HIDDEN_ITEM_COMMON,
  HIDDEN_ITEM_ACTION,
  HIDDEN_ITEM_LIST,
  HIDDEN_ITEM_ANSWER,
  HIDDEN_ITEM_ARTICLE,
  HIDDEN_ITEM_USER_HOME,
  HIDDEN_ITEM_COLLECTIONS,
  HIDDEN_ITEM_TOPIC,
];

/** 多个配置影响到的隐藏内容 */
export { HIDDEN_ARRAY_MORE } from './more';

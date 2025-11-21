import type { PAGE_QUERY_SITE_1Result, PAGE_QUERY_SITE_2Result } from './sanity/types';

export type Maybe<T> = T | null | undefined;

export type PageBuilderTypesArray = NonNullable<NonNullable<PAGE_QUERY_SITE_1Result>['pageBuilder']>[number]['_type'];

export type PageBuilderTypes<T extends PageBuilderTypesArray> = Extract<
  NonNullable<NonNullable<PAGE_QUERY_SITE_1Result>['pageBuilder']>[number],
  { _type: T }
>;

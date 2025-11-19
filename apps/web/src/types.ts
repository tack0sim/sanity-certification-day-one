import type { PAGE_BUILDER_QUERYResult } from './sanity/types';

export type Maybe<T> = T | null | undefined;

export type PageBuilderTypesArray = NonNullable<
	NonNullable<PAGE_BUILDER_QUERYResult>['pageBuilder']
>[number]['_type'];

export type PageBuilderTypes<T extends PageBuilderTypesArray> = Extract<
	NonNullable<NonNullable<PAGE_BUILDER_QUERYResult>['pageBuilder']>[number],
	{ _type: T }
>;

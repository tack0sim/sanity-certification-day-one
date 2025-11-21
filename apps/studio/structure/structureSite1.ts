import type { StructureResolver } from 'sanity/structure';
import { documentTypeListItem } from './utils/documentTypeListItem';
import { pageSite1 } from '../schemaTypes/documents/pageSite1';
import { getSiteTitle, type SiteName } from '../lib/SITES';

const site: SiteName = 'site-1';
const title = getSiteTitle('Site 1');

export const structureSite1: StructureResolver = (S, context) => {
  const structureProps = { S, context, site };

  return S.list()
    .id('root')
    .title(title)
    .items([documentTypeListItem(structureProps, { ...pageSite1 })]);
};

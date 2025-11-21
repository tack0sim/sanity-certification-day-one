import type { StructureResolver } from 'sanity/structure';
import { getSiteTitle } from '../lib/SITES';

const title = getSiteTitle('Site 1');

export const structureSite1: StructureResolver = (S, context) =>
  S.list()
    .id('root')
    .title(title)
    .items([S.documentTypeListItem('pageSite1').title('Page')]);

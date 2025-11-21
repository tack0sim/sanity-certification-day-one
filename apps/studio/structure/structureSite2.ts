import type { StructureResolver } from 'sanity/structure';
import { getSiteTitle } from '../lib/SITES';

const title = getSiteTitle('Site 2');

export const structureSite2: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title(title)
    .items([
      S.documentTypeListItem('pageSite2').title('Page'),
      S.divider().title('Events'),
      S.listItem()
        .title('Upcoming')
        .schemaType('event')
        .child(S.documentList().title('Upcoming Events').filter('date >= now()')),
      S.listItem()
        .title('Past')
        .schemaType('event')
        .child(S.documentList().title('Past Events').filter('date < now()')),
      S.divider().title('Artists and Venues'),
      S.documentTypeListItem('artist').title('Artists'),
      S.documentTypeListItem('venue').title('Venues'),
    ]);

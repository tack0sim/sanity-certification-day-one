import type { DocumentDefinition } from 'sanity';
import type { StructureBuilder } from 'sanity/structure';
import { getSite, type SiteName } from '../../lib/SITES';

export const documentTypeListItem = (
  { S, site }: { S: StructureBuilder; site: SiteName },
  schema: DocumentDefinition,
) => {
  return S.documentTypeListItem(schema.name)
    .id(`${schema.name}-by-${site}`)
    .title(schema.title ?? schema.name)
    .child(
      S.documentTypeList(schema.name)
        .title(schema.title ?? schema.name)
        .filter('_type == $type && ($site in sites || !defined(sites))')
        .apiVersion('2025-05-08')
        .params({
          type: schema.name,
          site: getSite(site),
        })
        .initialValueTemplates([S.initialValueTemplateItem(`${schema.name}`, { site })]),
    );
};

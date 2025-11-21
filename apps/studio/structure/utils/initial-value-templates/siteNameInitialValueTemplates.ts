import type { DocumentDefinition } from 'sanity';
import { SITES, type SiteName } from '../../../lib/SITES';
import { documentSchemas } from '../../../schemaTypes';

export const siteNameInitialValueTemplate = [...documentSchemas].map((schema) => {
  const document = schema as DocumentDefinition;
  const schemaType = document.name;

  return {
    id: `${schemaType}`,
    title: `SiteNames for ${schemaType}`,
    schemaType,
    parameters: [
      {
        name: 'site',
        type: 'string',
      },
    ],
    value: ({ site }: { site: SiteName }) => ({
      sites: document.options?.crossSite ? SITES.map((s) => s.name) : [site],
    }),
  };
});

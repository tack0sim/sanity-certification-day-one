import { type DocumentDefinition, defineField, type FieldDefinition, type SchemaTypeDefinition } from 'sanity';
import { pageBuilderBlocks } from './blocks';
import { SiteNameInput } from './components/SiteNameInput';
import { documents } from './documents';
import { objects } from './objects';
import { Group } from './utils/groups';

const modifiedDocuments: SchemaTypeDefinition[] = documents.map((doc) => {
  const documents = doc as DocumentDefinition;
  let fields: FieldDefinition[] = documents.fields ?? [];

  fields = [
    defineField({
      name: 'sites',
      title: 'Sites',
      type: 'array',
      of: [{ type: 'string' }],
      // options: {
      //   crossSite: false,
      // },
      group: Group.sites,
      components: {
        input: SiteNameInput,
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!documents?.options?.crossSite && value && value.length > 1) {
            return 'The document can only be assigned to one site!';
          }
          if (!value || value.length === 0) {
            return 'The document must be assigned to at least one site!';
          }
          return true;
        }),
    }),
    ...fields,
  ];

  return {
    ...doc,
    fields,
  };
});

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [...modifiedDocuments, ...objects, ...pageBuilderBlocks],
};

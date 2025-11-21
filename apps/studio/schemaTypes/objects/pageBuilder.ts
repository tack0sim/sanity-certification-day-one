import { defineArrayMember, defineType } from 'sanity';
import { pageBuilderBlocks } from '../blocks';

const pageBuilderTypes = pageBuilderBlocks.map((block) => ({
  type: block.name,
}));

export const pageBuilder = defineType({
  name: 'pageBuilder',
  type: 'array',
  of: pageBuilderTypes.map((block) => defineArrayMember(block)),
});

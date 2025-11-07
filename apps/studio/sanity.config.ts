import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {defaultDocumentNode} from './structure/defaultDocumentNode'
import {presentationTool} from 'sanity/presentation'
import {assist} from '@sanity/assist'

export default defineConfig({
  name: 'default',
  title: 'Day One Content Operations',

  projectId: 'fk2hrasv',
  dataset: 'production',

  plugins: [
    structureTool({structure, defaultDocumentNode}),
    visionTool(),
    assist(),
    presentationTool({
      previewUrl: {
        initial: 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
  ],

  tools: (prev, {currentUser}) => {
    const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')
    if (isAdmin) {
      return prev
    }
    return prev.filter((tool) => tool.name !== 'vision')
  },

  schema: {
    types: schemaTypes,
  },

  deployment: {
    appId: 'ssb668i65dfuhr0vcak6p8f7',
  },
})

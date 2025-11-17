import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schema} from './schemaTypes'
import {structure} from './structure'
import {defaultDocumentNode} from './structure/defaultDocumentNode'
import {presentationTool} from 'sanity/presentation'
import {resolve} from './presentation/resolve'
// import {assist} from '@sanity/assist'

export default defineConfig({
  name: 'default',
  title: 'Day One Content Operations',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  schema,

  plugins: [
    structureTool({structure, defaultDocumentNode}),
    visionTool(),
    // assist(),
    presentationTool({
      resolve,
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

  deployment: {
    appId: 'ssb668i65dfuhr0vcak6p8f7',
  },
})

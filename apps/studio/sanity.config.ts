import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {resolve} from './presentation/resolve'
import {schema} from './schemaTypes'
import {structure} from './structure'
import {defaultDocumentNode} from './structure/defaultDocumentNode'
// import {assist} from '@sanity/assist'

export default defineConfig({
  name: 'default',
  title: 'Day One Content Operations',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
  dataset: process.env.SANITY_STUDIO_DATASET as string,
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

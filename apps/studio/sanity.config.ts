import {visionTool} from '@sanity/vision'
import {PluginOptions, SingleWorkspace, WorkspaceOptions, defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {resolve} from './presentation/resolve'
import {schema} from './schemaTypes'
import {structure, structureSite2} from './structure'
import {defaultDocumentNode} from './structure/defaultDocumentNode'
import {siteName} from './lib/SITES'
import {dataset, frontendHost, projectId} from './lib/env'
// import {assist} from '@sanity/assist'

const sharedConfig: SingleWorkspace = {
  projectId,
  dataset,
  schema,
}

const sharedPlugins: PluginOptions[] = [
  visionTool(),
  // assist(),
]

const name = (name: siteName) => name
const basePath = (name: siteName) => `/${name}`

const site1Config: WorkspaceOptions = {
  ...sharedConfig,
  name: name('site-1'),
  title: 'Site 1',
  basePath: basePath('site-1'),
  plugins: [
    structureTool({structure, defaultDocumentNode}),
    presentationTool({
      resolve,
      previewUrl: {
        initial: frontendHost,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    ...sharedPlugins,
  ],
  tools: (prev, {currentUser}) => {
    const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')
    if (isAdmin) {
      return prev
    }
    return prev.filter((tool) => tool.name !== 'vision')
  },
}

const site2Config: WorkspaceOptions = {
  ...sharedConfig,
  name: name('site-2'),
  title: 'Site 2',
  basePath: '/site-2',
  plugins: [structureTool({structure: structureSite2, defaultDocumentNode}), ...sharedPlugins],
  tools: (prev, {currentUser}) => {
    const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')
    if (isAdmin) {
      return prev
    }
    return prev.filter((tool) => tool.name !== 'vision')
  },
}

export default defineConfig([site1Config, site2Config])

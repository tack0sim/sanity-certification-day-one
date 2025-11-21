import { EarthGlobeIcon, HeartIcon } from '@sanity/icons';
import { visionTool } from '@sanity/vision';
import { defineConfig, type PluginOptions, type SingleWorkspace, type WorkspaceOptions } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { dataset, frontendHost, projectId } from './lib/env';
import { getSite, type SiteName } from './lib/SITES';
import { resolve } from './presentation/resolve';
import { schema } from './schemaTypes';
import { defaultDocumentNode } from './structure/defaultDocumentNode';
import { structureSite1 } from './structure/structureSite1';
import { structureSite2 } from './structure/structureSite2';

// import {assist} from '@sanity/assist'

const sharedConfig: SingleWorkspace = {
  projectId,
  dataset,
  schema,
};

const sharedPlugins: PluginOptions[] = [
  visionTool(),
  // assist(),
];

const basePath = (getSite: SiteName | string) => `/${getSite}`;

const site1Config: WorkspaceOptions = {
  ...sharedConfig,
  name: getSite('site-1'),
  title: 'Site 1',
  icon: HeartIcon,
  basePath: basePath(getSite('site-1')),
  plugins: [
    structureTool({ structure: structureSite1 }),
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
  tools: (prev, { currentUser }) => {
    const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator');
    if (isAdmin) {
      return prev;
    }
    return prev.filter((tool) => tool.name !== 'vision');
  },
};

const site2Config: WorkspaceOptions = {
  ...sharedConfig,
  name: getSite('site-2'),
  title: 'Site 2',
  icon: EarthGlobeIcon,
  basePath: basePath(getSite('site-2')),
  plugins: [structureTool({ structure: structureSite2, defaultDocumentNode }), ...sharedPlugins],
  tools: (prev, { currentUser }) => {
    const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator');
    if (isAdmin) {
      return prev;
    }
    return prev.filter((tool) => tool.name !== 'vision');
  },
};

export default defineConfig([site1Config, site2Config]);

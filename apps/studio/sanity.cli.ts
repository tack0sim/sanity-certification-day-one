import { defineCliConfig } from 'sanity/cli';
import { dataset, projectId, studioHost } from './lib/env';

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost,
  server: {
    port: 3334,
  },
  deployment: {
    appId: 'ssb668i65dfuhr0vcak6p8f7',
    autoUpdates: true,
  },
});

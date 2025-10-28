import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'fk2hrasv',
    dataset: 'production',
  },
  server: {
    port: 3334,
  },
  deployment: {
    appId: 'ssb668i65dfuhr0vcak6p8f7',
    autoUpdates: true,
  },
})

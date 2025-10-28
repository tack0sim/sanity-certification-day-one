import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  app: {
    organizationId: 'oG4Ppzmwr',
    entry: './src/App.tsx',
  },
  deployment: {
    appId: 'gp7bp6fs8s5ryo4hmqrdg4ag',
  },
});

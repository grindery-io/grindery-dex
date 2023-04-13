import { defineConfig } from 'cypress';
const synpressPlugins = require('@synthetixio/synpress/plugins');
require('dotenv').config({ path: '/.env.test.local' });

export default defineConfig({
  projectId: '1cse2f',
  userAgent: 'synpress',
  chromeWebSecurity: true,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,
  e2e: {
    testIsolation: true,
    setupNodeEvents(on, config) {
      synpressPlugins(on, config);
    },
    viewportWidth: 1280,
    viewportHeight: 768,
    baseUrl: 'http://localhost:3000',
  },
  env: {
    ...process.env,
  },
});

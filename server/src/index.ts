import { createApp } from './app.ts';
import { readConfig } from './config.ts';

const config = readConfig();

createApp(config).listen(config.port, () => {
  console.log(`shortlist server → http://localhost:${config.port}`);
});

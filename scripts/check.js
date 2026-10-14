import { checkRuntime } from '../src/runtime.js';
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
checkRuntime();
for (const dir of ['src', 'scripts', 'test']) {
  for (const file of readdirSync(dir).filter(file => file.endsWith('.js'))) {
    const result = spawnSync(process.execPath, ['--check', `${dir}/${file}`], { stdio: 'inherit' });
    if (result.status !== 0) process.exit(1);
  }
}

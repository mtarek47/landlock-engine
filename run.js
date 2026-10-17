#!/usr/bin/env node
/**
 * Cross-platform LandLock Engine Runner
 * Detects current OS and launches the appropriate script (start.sh or start.bat)
 */
import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = os.platform() === 'win32';
const script = isWindows ? path.join(__dirname, 'start.bat') : path.join(__dirname, 'start.sh');

console.log(`[LandLock Engine] Detected OS: ${os.type()} (${os.platform()})`);
console.log(`[LandLock Engine] Launching: ${script}`);

const child = isWindows
  ? spawn('cmd.exe', ['/c', script], { stdio: 'inherit', cwd: __dirname })
  : spawn('bash', [script], { stdio: 'inherit', cwd: __dirname });

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

process.on('SIGINT', () => {
  child.kill('SIGINT');
});
process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});

#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';

const [, , action = 'list', toolName, rawArguments = '{}'] = process.argv;
const server = spawn('/Users/lucasbuzatovenarusso/.codex/bin/monday-apps-mcp', [], {
  stdio: ['pipe', 'pipe', 'pipe'],
});

let nextId = 1;
const pending = new Map();
const stderr = [];

const lines = createInterface({ input: server.stdout });
lines.on('line', (line) => {
  if (!line.trim()) return;
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return;
  }
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(JSON.stringify(message.error)));
    else resolve(message.result);
  }
});

server.stderr.on('data', (chunk) => stderr.push(chunk.toString()));

function send(method, params) {
  const id = nextId++;
  server.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Timeout aguardando ${method}`));
    }, 180_000);
    pending.set(id, {
      resolve: (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      reject: (error) => {
        clearTimeout(timer);
        reject(error);
      },
    });
  });
}

function notify(method, params = {}) {
  server.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`);
}

async function main() {
  try {
    await send('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'codex-monday-publisher', version: '1.0.0' },
    });
    notify('notifications/initialized');

    const result = action === 'call'
      ? await send('tools/call', { name: toolName, arguments: JSON.parse(rawArguments) })
      : await send('tools/list', {});

    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    if (stderr.length) process.stderr.write(stderr.join(''));
    process.exitCode = 1;
  } finally {
    server.kill('SIGTERM');
  }
}

main();

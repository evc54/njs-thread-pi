const { isMainThread, parentPort } = require('worker_threads');
const fs = require('fs');

if (isMainThread) throw new Error('This script must be executed as thread worker');

const pi = require('./utils/bellard');

let task;

function onCommand({ command, ...options }) {
  switch (command) {
    case 'task':
      task = options.task;
      process.nextTick(run);
      break;

    case 'exit':
      parentPort.off('message', onCommand);
      break;

    default:
      console.warn(`Unknown command '${command}'`);
  }
}

function run() {
  const { id, params } = task;
  const result = pi(...params);

  parentPort.postMessage({
    status: 'result',
    id,
    result,
  });
  task = null;

  process.nextTick(imReady);
}

function imReady() {
  parentPort.postMessage({ status: 'ready' });
}

parentPort.on('message', onCommand);
imReady();

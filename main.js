const fs = require('fs');
const os = require('os');
const path = require('path');
const ProgressBar = require('progress');
const { program } = require('commander');
const { Worker } = require('worker_threads');

const DEFAULT_POOL_SIZE = 4; // a number of workers by default
const MAX_POOL_SIZE = os.cpus().length; // a number of CPU cores
const CHUNK_SIZE = 10; // chunk size
const DEFAULT_FILE_NAME = 'pi.txt';

const pool = []; // worker pool
const tasks = []; // calculation tasks
let precision, results, filename, started, progressBar;

//
// run a program via commander
//
program
  .option('-w, --workers <number>', 'a number of thread workers', parseInt)
  .option('-f, --file <name>', 'file name to save results as text', DEFAULT_FILE_NAME)
  .argument('<precision>', 'Pi constant precision to calculate', parseInt)
  .action(precision => {
    if (isNaN(precision)) {
      console.error("Invalid precision value!\n");
      return program.help();
    }

    const { workers = DEFAULT_POOL_SIZE, file } = program.opts();
    filename = file;
    start(precision, workers);
  });
program.showHelpAfterError();
program.parse();

//
// add tasks and spawn workers
//
function start(desiredPrecision, workerPoolSize) {
  precision = desiredPrecision;

  // make result array
  results = new Int8Array(precision + 2);
  results[0] = 51; // '3' in ascii
  results[1] = 46; // '.'

  // add computation tasks
  for (let i = precision / CHUNK_SIZE; i >= 0; i--) {
    tasks.push({
      id: i, // task id used to calculate results array position
      params: [i * 10 + 1], // digits chunk offset
    });
  }

  spawnWorkers(workerPoolSize);
  started = new Date();
  createProgressBar();
}

//
// spawn a <number> of thread workers and fill the pool
//
function spawnWorkers(number) {
  const poolSize = Math.max(1, Math.min(number, MAX_POOL_SIZE)); // min: 1, max: a number of CPU cores

  for (let i = 0; i < poolSize; i++) {
    const worker = new Worker('./worker.js');

    worker.on('exit', onComplete);
    worker.on('exit', onExit(worker));
    worker.on('message', onMessage(worker));

    pool.push(worker);
  }

  console.log(`* waiting for ${poolSize} worker${poolSize > 1 ? 's' : ''} to get ready`);
}

//
// create object to show a progress bar
//
function createProgressBar() {
  progressBar = new ProgressBar('* calculating pi [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: tasks.length,
  })
}

//
// worker's message handler
//
function onMessage(worker) {
  return function (message) {
    const { status } = message;

    switch (status) {
      case 'ready': // worker is ready
        if (tasks.length === 0) // no more tasks, stop worker
          return worker.postMessage({ command: 'exit' });

        // send next task to the worker
        const task = tasks.pop();
        worker.postMessage({
          command: 'task',
          task,
        });
        break;

      case 'result': // worker sends a result
        const { id, result } = message;
        const digits = `${result}`.split('').reverse();
        for (let i = 0; i < CHUNK_SIZE; i++) {
          const index = id * CHUNK_SIZE + CHUNK_SIZE - i + 1; // result array index for the digit
          results[index] = digits[i] ? +digits[i] + 48 : 48; // convert to ascii code
        }
        progressBar.tick();
        break;

      default:
        console.warn(`Unknown message status ${status}`);
    }
  };
}

//
// worker's shutdown handler
//
function onExit(worker) {
  return function () {
    worker.removeAllListeners('message');
    worker.removeAllListeners('exit');
    const workerIndex = pool.find(poolWorker => Object.is(poolWorker, worker));
    pool.splice(workerIndex, 1);
  };
}

//
// on complete handler
//
function onComplete() {
  if (pool.length > 1) return; // too early, some tasks isn't done yet

  const elapsed = +(new Date()) - started;
  console.log(`pi is calculated with precision of ${precision} in ${elapsed}ms`)

  const file = path.resolve('./', filename);
  fs.writeFile(file, results, err => {
    if (err) return console.error(err);
    console.log(`results saved to ${file}`);
  });
}

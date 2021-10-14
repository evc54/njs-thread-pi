## Pi constant calculator

The program demonstrates how Node.js threads can be used for heavy CPU load computing with example case of calculating Pi constant with given precision.

## Installation

You'll need to have `git`, `nodejs` and `npm` installed on your machine.

```bash
$ git clone https://github.com/evc54/njs-thread-pi pi
$ cd pi
$ npm install
```

## Usage

```
$ node main.js --help
Usage: main [options] <precision>

Arguments:
  precision               Pi constant precision to calculate

Options:
  -w, --workers <number>  a number of thread workers (default: 4)
  -c, --chunk <number>    digits chunk size (default: 10)
  -f, --file <name>       file name to save results as text (default: "pi.txt")
  -h, --help              display help for command
```

## Execution time test

All the tests were performed on AMD Ryzen 9 4900HS processor.

1 worker, 1000 digits precision.

```
$ node main.js -w 1 1000
* chunk size is set to 10
* waiting for 1 worker to get ready
* calculating pi [====================] 100% 0.0s
pi is calculated with precision of 1000 in 3826ms
results saved to pi.txt
```

2 workers, 1000 digits precision.

```
$ node main.js -w 2 1000
* chunk size is set to 10
* waiting for 2 workers to get ready
* calculating pi [====================] 100% 0.0s
pi is calculated with precision of 1000 in 1957ms
results saved to pi.txt
```

4 workers, 1000 digits precision.

```
$ node main.js -w 4 1000
* chunk size is set to 10
* waiting for 4 workers to get ready
* calculating pi [====================] 100% 0.0s
pi is calculated with precision of 1000 in 1055ms
results saved to pi.txt
```

8 workers, 1000 digits precision.

```
$ node main.js -w 8 1000
* chunk size is set to 10
* waiting for 8 workers to get ready
* calculating pi [====================] 100% 0.0s
pi is calculated with precision of 1000 in 604ms
results saved to pi.txt
```

16 workers, 1000 digits precision.

```
$ node main.js -w 16 1000
* chunk size is set to 10
* waiting for 16 workers to get ready
* calculating pi [====================] 100% 0.0s
pi is calculated with precision of 1000 in 444ms
results saved to pi.txt
```

16 workers, 15 digits chunk size, 1000 digits precision.

```
$ node main.js -w 16 -c 15 1000
* chunk size is set to 15
* waiting for 16 workers to get ready
* calculating pi [====================] 100% 0.0s
pi is calculated with precision of 1000 in 366ms
results saved to pi.txt
```

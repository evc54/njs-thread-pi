// Simon Plouffe solution coded by Fabrice Bellard

/* (a * b) mod m */
function mulMod(a, b, m) {
  return (a * b) % m;
}

/* inverse of x mod y */
function invMod(x, y) {
  let q, u = x, v = y, a = 0, c = 1, t;

  do {
    q = Math.floor(v / u);

    t = c;
    c = a - q * c;
    a = t;

    t = u;
    u = v - q * u;
    v = t;
  } while (u !== 0);

  a = a % y;
  if (a < 0) a = y + a;

  return a;
}

/* (a^b) mod m */
function powMod(a, b, m) {
  let r = 1, aa = a;

  while (true) {
    if (b & 1) r = mulMod(r, aa, m);
    b = b >> 1;
    if (b === 0) break;
    aa = mulMod(aa, aa, m);
  }

  return r;
}

/* n is prime */
function isPrime(n) {
  if ((n % 2) === 0) return false;

  let r = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= r; i += 2)
    if ((n % i) === 0)
        return false;

  return true;
}

/* next prime number after n */
function getNextPrime(n) {
  do {
    n++;
  } while (!isPrime(n));

  return n;
}

/* calculate `x` numbers at offset `n` */
function piNth(n, x = 10) {
  let N = (n + 20) * Math.log(10) / Math.log(2);
  let sum = 0;
  for (let a = 3; a <= 2 * N; a = getNextPrime(a)) {
    let vmax = Math.floor(Math.log(2 * N) / Math.log(a));
    let av = 1;
    for (let i = 0; i < vmax; i++) av = av * a;

    let s = v = 0;
    let num = den = kq = kq2 = 1;

    for (let k = 1; k <= N; k++) {
      let t = k;

      if (kq >= a) {
        do {
            t = t / a;
            v--;
        } while ((t % a) === 0);
        kq = 0;
      }

      kq++;
      num = mulMod(num, t, av);
      t = (2 * k - 1);

      if (kq2 >= a) {
        if (kq2 == a) {
          do {
            t = t / a;
            v++;
          } while ((t % a) === 0);
        }
        kq2 -= a;
      }
      den = mulMod(den, t, av);
      kq2 += 2;

      if (v > 0) {
        t = invMod(den, av);
        t = mulMod(t, num, av);
        t = mulMod(t, k, av);
        for (let i = v; i < vmax; i++) t = mulMod(t, a, av);
        s += t;
        if (s >= av) s -= av;
      }
    }

    t = powMod(10, n - 1, av);
    s = mulMod(s, t, av);
    sum = (sum + s / av) % 1;
  }

  return Math.floor(sum * 10 ** x);
}

module.exports = piNth;

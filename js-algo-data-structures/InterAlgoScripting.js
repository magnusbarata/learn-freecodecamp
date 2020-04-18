/* Sum All Numbers in a Range */
function sumAll(arr) {
  // Using recursion
  if (arr[1] === arr[0])
    return arr[0];
  else if (arr[0] < arr[1])
    return arr[1] + sumAll([arr[0], arr[1]-1]);
  else
    return arr[0] + sumAll([arr[0]-1, arr[1]]);

  // Using loop
  /*for (var sum=arr[0]; arr[0]!==arr[1];)
    if (arr[0] < arr[1]) sum += ++arr[0];
    else sum += --arr[0];
  return sum;*/
}

sumAll([1, 4]) === sumAll([4, 1]);

/* Diff Two Arrays */
function diffArray(arr1, arr2) {
  let d1 = arr1.filter(elm => arr2.indexOf(elm) == -1);
  let d2 = arr2.filter(elm => arr1.indexOf(elm) == -1);
  return d1.concat(d2);
}

diffArray([1, 2, 3, 5], [1, 2, 3, 4, 5]); // [4]

/* Seek and Destroy */
function destroyer(arr, ...args) {
  return arr.filter(elm => args.indexOf(elm) == -1);
}

destroyer([1, 2, 3, 1, 2, 3], 2, 3); // [1, 1]


/* Wherefore art thou */
function whatIsInAName(collection, source) {
  var arr = [];

  for (let item of collection) {
    let match = true;
    for (let prop in source) {
      if (!item.hasOwnProperty(prop) || item[prop] !== source[prop])
        match = false;
    }
    if (match) arr.push(item);
  }

  return arr;
}

whatIsInAName([{ first: "Romeo", last: "Montague" }, { first: "Mercutio", last: null }, { first: "Tybalt", last: "Capulet" }], { last: "Capulet" }); // [{ first: "Tybalt", last: "Capulet" }]

/* Spinal Tap Case */
function spinalCase(str) {
  str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  return str.split(/[\W_]/).join('-').toLowerCase();
}

spinalCase('AllThe-small Things') === 'all-the-small-things';

/* Pig Latin */
function translatePigLatin(str) {
  return /^[^aiueo]/.test(str) ?
    str.replace(/^([^aiueo]+)(.*)$/, '$2$1') + 'ay' :
    str.replace(/(^[aiueo])/, '$1') + 'way';
}

translatePigLatin("consonant") === 'onsonantcay';
translatePigLatin("algorithm") === 'algorithmway';

/* Search and Replace */
function myReplace(str, before, after) {
  let retStr = [];
  for (let word of str.split(' ')) {
    let tkn = word === before ?
      word[0] === word[0].toUpperCase() ?
        tkn = after[0].toUpperCase() + after.slice(1) :
        tkn = after[0].toLowerCase() + after.slice(1) :
      word;
   retStr.push(tkn);
  }
  return retStr.join(' ');
}

myReplace("Let us get back to more Coding", "Coding", "algorithms") === "Let us get back to more Algorithms";

/* DNA Pairing */
function pairElement(str) {
  const basepairs = {A: 'T', T: 'A', C:'G', G:'C'};
  return str.split('').map(c => [c, basepairs[c]]);
}

pairElement("CTCTA"); // [["C","G"],["T","A"],["C","G"],["T","A"],["A","T"]]

/* Missing letters */
function fearNotLetter(str) {
  for (let i=1; i<str.length; i++)
    if (str.charCodeAt(i) - str.charCodeAt(i-1) != 1)
      return String.fromCharCode(str.charCodeAt(i)-1);
  return undefined;
}

fearNotLetter("abce") === 'd';

/* Sorted Union */
function uniteUnique(...arrays) {
  return arrays.reduce((unique, arr) => {
    let ret = [];
    for (let a of arr)
      if (unique.indexOf(a) === -1) ret.push(a);
    return unique.concat(ret);
  }, []);
}

uniteUnique([1, 2, 3], [5, 2, 1, 4], [2, 1], [6, 7, 8]); // [1, 2, 3, 5, 4, 6, 7, 8]

/* Convert HTML Entities */
function convertHTML(str) {
  let htmlEntities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'};
  return str.replace(/([&<>"'])/g, ($1 => {return htmlEntities[$1]}));
}

convertHTML("Dolce & Gabbana < Pizza > \"test\'") === "Dolce &amp; Gabbana &lt; Pizza &gt; &quot;test&apos;";

/* Sum All Odd Fibonacci Numbers */
function sumFibs(num) {
  let next, fib = [1, 1];
  while ((next = fib[fib.length-2] + fib[fib.length-1]) <= num)
    fib.push(next);

  return fib
    .filter(a => a%2 !== 0)
    .reduce((sum, a) => sum += a, 0);
}

sumFibs(4000000) === 4613732;

/* Sum All Primes */
function sumPrimes(num) {
  let primes = [];
  for (let i=2; i<=num; i++) {
    let isPrime = true;
    for (let j=2; j<i; j++)
      if (i % j == 0) {
        isPrime = false;
        break;
      }
    if (isPrime) primes.push(i);
  }

  return primes.reduce((sum, a) => sum += a, 0);
}

sumPrimes(977) === 73156;

/* Smallest Common Multiple */
function smallestCommons(arr) {
  let ranges = (function range(a, b) {
    if (b === a) {
      return [a];
    } else if (a < b) {
      const next = range(a, b-1);
      next.push(b);
      return next;
    } else {
      const next = range(a-1, b);
      next.push(a);
      return next;
    }
  })(...arr);

  for (let i=1; ; i++) {
    for (let n of ranges) {
      if (i % n !== 0) break;
      else if (n == ranges[ranges.length-1])
        return i;
    }
  }
}

smallestCommons([23, 18]) === 6056820;

/* Drop it */
function dropElements(arr, func) {
  for (var i=0; i<arr.length; i++)
    if (!func(arr[i])) continue;
    else break;

  return arr.slice(i);
}

dropElements([1, 2, 3, 9, 2], function(n) {return n > 2;}); // [3, 9, 2]

/* Steamroller */
function steamrollArray(arr) {
  return arr.reduce((unrolled, a) => {
    if (Array.isArray(a))
      return unrolled.concat(steamrollArray(a));
    else
      return unrolled.concat(a);
  }, []);
}

steamrollArray([1, [2, 3], [4, {}, [[]], [[5]]]]); // [ 1, 2, 3, 4, {}, 5 ]

/* Binary Agent */
function binaryAgent(str) {
  return str
    .split(' ')
    .map(a => String.fromCharCode(parseInt(a,2)))
    .join('');
}

binaryAgent("01000001 01110010 01100101 01101110 00100111 01110100 00100000 01100010 01101111 01101110 01100110 01101001 01110010 01100101 01110011 00100000 01100110 01110101 01101110 00100001 00111111") === "Aren't bonfires fun!?";

/* Everything Be True */
function truthCheck(collection, pre) {
  return collection.reduce((ans, a) => {
    return ans && Boolean(a[pre]);
  }, true);
}

truthCheck([{"user": "Tinky-Winky", "sex": "male"}, {"user": "Dipsy", "sex": "male"}, {"user": "Laa-Laa", "sex": "female"}, {"user": "Po", "sex": "female"}], "sex") === true;

/* Arguments Optional */
function addTogether(...a) {
  for (let tkn of a)
    if (typeof tkn != 'number') return undefined;

  if (a.length == 2)
    return a[0] + a[1];
  else if (a.length == 1)
    return (b) => {
      if (typeof b != 'number') return undefined;
      return Number(a) + b;
    }
}

addTogether(2,3) === addTogether(2)(3);

/* Make a Person */
var Person = function(firstAndLast) {
  // Complete the method below and implement the others similarly
  this.getFirstName = () => {
    return "";
  }

  this.getLastName = () => {
    return "";
  };

  this.getFullName = () => {
    return `${this.getFirstName()} ${this.getLastName()}`;
  };

  this.setFirstName = (first) => {
    this.getFirstName = () => {
      return first;
    }
  }

  this.setLastName = (last) => {
    this.getLastName = () => {
      return last;
    }
  };

  this.setFullName = (firstAndLast) => {
    this.setFirstName(firstAndLast.split(' ')[0]);
    this.setLastName(firstAndLast.split(' ')[1]);
  };

  this.setFirstName(firstAndLast.split(' ')[0]);
  this.setLastName(firstAndLast.split(' ')[1]);;
};

/* Map the Debris */
function orbitalPeriod(arr) {
  var GM = 398600.4418;
  var earthRadius = 6367.4447;
  return arr.map(a => {
    return {
      name: a.name,
      orbitalPeriod: Math.round(2 * Math.PI *
                     Math.sqrt(Math.pow(a.avgAlt + earthRadius, 3) / GM))
    }
  });
}

orbitalPeriod([{name: "iss", avgAlt: 413.6}, {name: "hubble", avgAlt: 556.7}, {name: "moon", avgAlt: 378632.553}])); // [{name : "iss", orbitalPeriod: 5557}, {name: "hubble", orbitalPeriod: 5734}, {name: "moon", orbitalPeriod: 2377399}]

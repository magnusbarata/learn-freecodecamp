/* Conver Celsius to Fahrenheit */
function convertToF(celsius) {
  return celsius * 9 / 5 + 32;
}

/* Reverse a String */
function reverseString(str) {
  for (var reversed="", i=str.length-1; i>=0; i--)
    reversed += str.charAt(i);
  return reversed;
}

/* Factorialize a Number */
function factorialize(num) {
  if (num < 1) return 1;
  return factorialize(num-1) * num;
}

/* Find the Longest Word in a String */
function findLongestWordLength(str) {
  let max = 0;
  for (let w of str.split(' '))
    if (max < w.length) max = w.length;
  return max;
}

/* Return Largest Numbers in Arrays */
function largestOfFour(arr) {
  let ans = [];
  for (let subArr of arr)
    ans.push(Math.max(...subArr));
  return ans;
}

/* Confirm the Ending */
function confirmEnding(str, target) {
  return str.slice(-target.length) === target;
}

/* Repeat a String */
function repeatStringNumTimes(str, num) {
  if (num < 1) return "";
  return str + repeatStringNumTimes(str, num-1);
}

/* Truncate a String */
function truncateString(str, num) {
  return str.length > num ?
    str.slice(0, num) + '...' : str;
}

/* Finders Keepers */
function findElement(arr, func) {
  for (let a of arr)
    if (func(a)) return a;
  return undefined;
}

/* Boo who */
function booWho(bool) {
  return typeof(bool) === 'boolean' ? true : false;
}

/* Title Case a Sentence */
function titleCase(str) {
  let ans = [];
  for (let w of str.split(' '))
    ans.push(w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return ans.join(' ');
}

/* Slice and Splice */
function frankenSplice(arr1, arr2, n) {
  return arr2.slice(0,n)
    .concat(arr1)
    .concat(arr2.slice(n));
}

/* Falsy Bouncer */
function bouncer(arr) {
  let ans = [];
  for (let a of arr) if (a) ans.push(a);
  return ans;
}

/* Where do I Belong */
function getIndexToIns(arr, num) {
  let ans = 0;
  for (let a of arr) if (a<num) ans++;
  return ans;
}

/* Mutations */
function mutation(arr) {
  for (let a of arr[1])
    if (!(new RegExp(a, 'i')).test(arr[0])) return false;
  return true;
}

/* Chunky Monkey */
function chunkArrayInGroups(arr, size) {
  let ans = [];
  for (let i=0; i<arr.length; i+=size)
    ans.push(arr.slice(i, i+size));
  return ans;
}

/* Palindrome Checker */
function palindrome(str) {
  str = str.replace(/[\W_]/g, '').toLowerCase();
  for (let i=0, j=str.length-1; i<j/2; i++)
    if (str[i] != str[j-i]) return false;
  return true;
}

palindrome("eye") === true;
palindrome("_eye") === true;
palindrome("race car") === true;
palindrome("A man, a plan, a canal. Panama") === true;
palindrome("never odd or even") === true;
palindrome("not a palindrome") === false;
palindrome("nope") === false;
palindrome("almostomla") === false;
palindrome("My age is 0, 0 si ega ym.") === true;
palindrome("1 eye for of 1 eye.") === false;
palindrome("0_0 (: /-\ :) 0-0") === true;
palindrome("five|\_/|four") === false;

/* Roman Numeral Converter */
function convertToRoman(num) {
  const sym = {1: 'I', 5: 'V', 10: 'X', 50: 'L', 100: 'C', 500: 'D', 1000: 'M'};

  return num
    .toString()
    .split('')
    .reduce((r, d, i, arr) => {
      let exp = Math.pow(10, arr.length-i-1);
      let tkn = '';
      switch (true) {
        case d > 0 && d < 4:
          for (; d>0; d--) tkn += sym[exp];
          break;
        case d == 4:
          tkn = sym[exp];
        case d > 4 && d < 9:
          tkn += sym[5*exp];
          for (; d-5>0; d--) tkn += sym[exp];
          break;
        case d == 9:
          tkn = sym[exp] + sym[10*exp];
      }
      return r + tkn;
    }, '');
}

/* Caesars Cipher */
function rot13(str) {
  return str.replace(/[A-Z]/g, c => {
    return String.fromCharCode(
      (c.charCodeAt() - 'A'.charCodeAt() + 13)
       % 26 + 'A'.charCodeAt());
  });
}

rot13("SERR PBQR PNZC") === "FREE CODE CAMP";
rot13("SERR CVMMN!") === "FREE PIZZA!";
rot13("SERR YBIR?") === "FREE LOVE?";
rot13("GUR DHVPX OEBJA SBK WHZCF BIRE GUR YNML QBT.") === "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.";

/* Telephone Number Validator */
function telephoneCheck(str) {
  return /^(1 *)*\d{3}[-| ]{0,1}\d{3}[-| ]{0,1}\d{4}$/.test(
    str.replace(/\(([^)]+)\)(.+)/,'$1$2'));
}

console.log(1, telephoneCheck("555-555-5555")===true);
console.log(2, telephoneCheck("(555)555-5555")===true);
console.log(3, telephoneCheck("(555) 555-5555")===true);
console.log(4, telephoneCheck("555 555 5555")===true);
console.log(5, telephoneCheck("5555555555")===true);
console.log(6, telephoneCheck("1 555 555 5555")===true);
console.log(7, telephoneCheck("1 (555) 555-5555")===true);
console.log(8, telephoneCheck("1(555)555-5555")===true);
console.log(9, telephoneCheck("1 456 789 4444")===true);
console.log(10, telephoneCheck("(555 555-5555")===false);
console.log(11, telephoneCheck("(555)-555-5555")===true);
console.log(12, telephoneCheck("1 555-555-5555")===true);
console.log(13, telephoneCheck("555-5555")===false);
console.log(14, telephoneCheck("5555555")===false);
console.log(15, telephoneCheck("1 555)555-5555")===false);
console.log(16, telephoneCheck("123**&!!asdf#")===false);
console.log(17, telephoneCheck("55555555")===false);
console.log(18, telephoneCheck("(6054756961)")===false);
console.log(19, telephoneCheck("2 (757) 622-7382")===false);
console.log(20, telephoneCheck("0 (757) 622-7382")===false);
console.log(21, telephoneCheck("-1 (757) 622-7382")===false);
console.log(22, telephoneCheck("2 757 622-7382")===false);
console.log(23, telephoneCheck("10 (757) 622-7382")===false);
console.log(24, telephoneCheck("27576227382")===false);
console.log(25, telephoneCheck("(275)76227382")===false);
console.log(26, telephoneCheck("2(757)6227382")===false);
console.log(27, telephoneCheck("2(757)622-7382")===false);
console.log(28, telephoneCheck("555)-555-5555")===false);
console.log(29, telephoneCheck("(555-555-5555")===false);
console.log(30, telephoneCheck("(555)5(55?)-5555")===false);

/* Cash Register */
function checkCashRegister(price, cash, cid) {
  const CU2A = {"PENNY": 1, "NICKEL": 5,
    "DIME": 10, "QUARTER": 25, "ONE": 100,
    "FIVE": 500, "TEN": 1000, "TWENTY": 2000,
    "ONE HUNDRED": 10000
  };

  let changeVal = (cash - price) * 100;
  let cidCount = cid.map(cu => Math.round(cu[1]*100/CU2A[cu[0]]));

  let ans = {status:"OPEN", change: []}
  for (let i=cid.length-1; i>=0 && changeVal>0; i--) {
    let changed=0, billCount = Math.floor(changeVal/CU2A[cid[i][0]]);

    if (cidCount[i] >= billCount) {
      changed = billCount * CU2A[cid[i][0]];
      cidCount[i] -= billCount;
      changeVal -= changed;
    } else if (cidCount[i] > 0) {
      changed = cidCount[i] * CU2A[cid[i][0]];
      changeVal -= changed;
    }

    if (changed > 0) ans.change.push([cid[i][0], changed/100]);
  }

  if (changeVal > 0) {
    ans.status = "INSUFFICIENT_FUNDS";
    ans.change = [];
  } else if (cidCount.reduce((s,a) => s+=a, 0) === 0) {
    ans.status = "CLOSED";
    ans.change = cid;
  }

  return ans;
}

checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]); // {status: "OPEN", change: [["QUARTER", 0.5]]}
checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]); // {status: "OPEN", change: [["TWENTY", 60], ["TEN", 20], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.5], ["DIME", 0.2], ["PENNY", 0.04]]}
checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]); // {status: "INSUFFICIENT_FUNDS", change: []}
checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]); // {status: "INSUFFICIENT_FUNDS", change: []}
checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]); // {status: "CLOSED", change: [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]}

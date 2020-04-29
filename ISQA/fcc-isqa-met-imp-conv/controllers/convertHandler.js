/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
  this.getNum = function(input) {
    var result = 'invalid number';
    var num = input.replace(/[A-Za-z]+$/, '').split('/');
    
    if (num.length < 3) {
      let nominator = (num[0] === undefined) || (num[0] === '') ? 1 : Number(num[0]);
      let denominator = num[1] === undefined ? 1 : Number(num[1]);
      if (!Object.is(nominator, NaN) && !Object.is(denominator, NaN))
        result = nominator / denominator;
    }
    
    return result;
  };
  
  this.getUnit = function(input) {
    var validUnit = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
    var result = input.match(/[A-Za-z]+$/)[0].toLowerCase();
    if (validUnit.indexOf(result) === -1) return 'invalid unit';
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    var unitMap = {gal: 'l', l: 'gal', lbs: 'kg', kg: 'lbs', mi: 'km', km: 'mi'};
    return unitMap[initUnit.toLowerCase()];
  };

  this.spellOutUnit = function(unit) {
    var unitSpelled = {
      gal: 'gallons', l: 'liters', lbs: 'pounds',
      kg: 'kilograms', mi: 'miles', km: 'kilometers'
    };
    return unitSpelled[unit.toLowerCase()];
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    
    var result;
    switch (this.getUnit(initUnit)) {
      case 'gal': result = initNum * galToL; break;
      case 'l': result = initNum / galToL; break;
      case 'lbs': result = initNum * lbsToKg; break;
      case 'kg': result = initNum / lbsToKg; break;
      case 'mi': result = initNum * miToKm; break;
      case 'km': result = initNum / miToKm; break;
    }
    
    return parseFloat(result.toFixed(5));
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
  
}

module.exports = ConvertHandler;

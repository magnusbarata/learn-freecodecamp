/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

var chai = require('chai');
var assert = chai.assert;
var ConvertHandler = require('../controllers/convertHandler.js');

var convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  
  suite('Function convertHandler.getNum(input)', function() {
    
    test('Whole number input', function(done) {
      var input = '32L';
      assert.equal(convertHandler.getNum(input),32);
      done();
    });
    
    test('Decimal Input', function(done) {
      assert.equal(convertHandler.getNum('5.4gal'),5.4);
      done();
    });
    
    test('Fractional Input', function(done) {
      assert.equal(convertHandler.getNum('1\/2km'),1/2);
      done();
    });
    
    test('Fractional Input w/ Decimal', function(done) {
      assert.equal(convertHandler.getNum('5.4\/3.2lbs'),5.4/3.2);
      done();
    });
    
    test('Invalid Input (double fraction)', function(done) {
      assert.equal(convertHandler.getNum('5.4\/2\/3mi'),'invalid number');
      assert.equal(convertHandler.getNum('5..4\/3mi'),'invalid number');
      assert.equal(convertHandler.getNum('5..4\/\/3mi'),'invalid number');
      done();
    });
    
    test('No Numerical Input', function(done) {
      assert.equal(convertHandler.getNum(''),1);
      assert.equal(convertHandler.getNum('kg'),1);
      done();
    }); 
    
  });
  
  suite('Function convertHandler.getUnit(input)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];

      input.forEach(function(ele) {
        assert.equal(convertHandler.getUnit(ele), ele.toLowerCase());
      });
      done();
    });
    
    test('Unknown Unit Input', function(done) {
      assert.equal(convertHandler.getUnit('1000gall'), 'invalid unit');
      assert.equal(convertHandler.getUnit('cm'), 'invalid unit');
      assert.equal(convertHandler.getUnit('N'), 'invalid unit');
      done();
    });  
    
  });
  
  suite('Function convertHandler.getReturnUnit(initUnit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','l','mi','km','lbs','kg'];
      var expect = ['l','gal','km','mi','kg','lbs'];
      input.forEach(function(ele, i) {
        assert.equal(convertHandler.getReturnUnit(ele), expect[i]);
      });
      done();
    });
    
  });  
  
  suite('Function convertHandler.spellOutUnit(unit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','l','mi','km','lbs','kg'];
      var expect = ['gallons', 'liters', 'miles', 'kilometers', 'pounds', 'kilograms'];
      input.forEach(function(ele ,i) {
        assert.equal(convertHandler.spellOutUnit(ele), expect[i]);
      });
      done();
    });
    
  });
  
  suite('Function convertHandler.convert(num, unit)', function() {
    
    test('Gal to L', function(done) {
      var input = [5, 'gal'];
      var expected = 18.9271;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });

    test('L to Gal', function(done) {
      assert.approximately(convertHandler.convert(3,'L'),3/3.78541,0.1);
      done();
    });
    
    test('Mi to Km', function(done) {
      assert.approximately(convertHandler.convert(3,'Mi'),3*1.60934,0.1);
      done();
    });
    
    test('Km to Mi', function(done) {
      assert.approximately(convertHandler.convert(3,'Km'),3/1.60934,0.1);
      done();
    });
    
    test('Lbs to Kg', function(done) {
      assert.approximately(convertHandler.convert(3,'Lbs'),3*0.453592,0.1);
      done();
    });
    
    test('Kg to Lbs', function(done) {
      assert.approximately(convertHandler.convert(3,'Kg'),3/0.453592,0.1);
      done();
    });
    
  });

});
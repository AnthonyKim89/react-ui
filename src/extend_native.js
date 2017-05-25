import numeral from 'numeral';
/**
 * BE CAREFUL using this file.
 * There is risk introduced by extending native components.
 * All extensions must have eslint exceptions annotated!
 */
/*eslint no-extend-native: ["error", { "exceptions": ["Number", "Array"] }]*/

// This is to avoid having to wrap conversions and other things with toFixed and parseFloat calls
Number.prototype.fixFloat = function(digits) {
  return parseFloat(this.toFixed(digits));
};
Number.prototype.formatNumeral = function(fmt) {
  return numeral(this).format(fmt);
};

// IE11 doesn't have Array.fill()
if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {

      // Steps 1-2.
      if (this === null) {
        throw new TypeError('this is null or not defined');
      }

      let O = Object(this);

      // Steps 3-5.
      let len = O.length >>> 0;

      // Steps 6-7.
      let start = arguments[1];
      let relativeStart = start >> 0;

      // Step 8.
      let k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);

      // Steps 9-10.
      let end = arguments[2];
      let relativeEnd = end === undefined ?
        len : end >> 0;

      // Step 11.
      let final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}

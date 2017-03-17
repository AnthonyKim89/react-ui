/**
 * BE CAREFUL using this file.
 * There is risk introduced by extending native components.
 * All extensions must have eslint exceptions annotated!
 */

// This is to avoid having to wrap conversions and other things with toFixed and parseFloat calls
/*eslint no-extend-native: ["error", { "exceptions": ["Number"] }]*/
Number.prototype.fixFloat = function(digits) {
  return parseFloat(this.toFixed(digits));
};

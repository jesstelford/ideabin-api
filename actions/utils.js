'use strict';

module.exports = {

  validateParams: function validateParams(validator, params) {

    var message;

    if (!validator(params)) {
      message = validator.errors.map(function stringifyError(error) {
        return '`'
          + error.field.replace('data.', '')
          + '` '
          + error.message;
      }).join(', ');
      return new Error(message);
    }

  },

  checkRequiredParams: function checkRequiredParams(requiredParams, params) {
    var missingKeys = [],
        missingMessage = '';

    requiredParams.forEach(function pushKeyIfMissing(paramKey) {
      if (!params[paramKey]) {
        missingKeys.push(paramKey);
      }
    });

    if (missingKeys.length) {
      missingMessage = '`' + missingKeys.join('`, `') + '` missing';
      return new Error(missingMessage);
    }

    return undefined;

  }
};

var restify = require('restify');

module.exports = {

  checkRequiredParams: function(requiredParams, params) {
    var missingKeys = [],
        missingMessage = '';

    requiredParams.forEach(function(paramKey) {
      if (!params[paramKey]) {
        missingKeys.push(paramKey);
      }
    });

    if (missingKeys.length) {
      missingMessage = '`' + missingKeys.join('`, `') + '` missing';
      return new restify.MissingParameterError(missingMessage);
    }

    return;

  }
}

module.exports = {

  validateParams: function(validator, params) {

    if (!validator(params)) {
      message = validator.errors.map(function(error) {
        return '`'
          + error.field.replace('data.', '')
          + '` '
          + error.message;
      }).join(', ');
      return new Error(message);
    }

  },

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
      return new Error(missingMessage);
    }

    return;

  }
}

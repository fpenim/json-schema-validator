class ValidationError {
  constructor(errorObject) {
    // dataPath
    if(errorObject.params.missingProperty) {
      this.dataPath = errorObject.dataPath + "." + errorObject.params.missingProperty;
    } else {
      this.dataPath = errorObject.dataPath;
    }

    // errors
    if(errorObject.params.allowedValues) { // enum case
      this.errors = [errorObject.message + ": " + JSON.stringify(errorObject.params.allowedValues)];
    } else {
      this.errors = [errorObject.message];
    }
  }
}

module.exports = ValidationError;
const validate = require("./validator");

exports.handleValidation = function (schemas, entity, rootSchemaId = schemas[0].$id) {
    return validate(schemas, entity, rootSchemaId);
}

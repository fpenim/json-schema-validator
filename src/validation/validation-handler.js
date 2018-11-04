const logger = require("../winston");
const validate = require("./validator");

exports.handleValidation = function (schemas, entity, rootSchemaId = schemas[0].$id) {
    try {
        return validate(schemas, entity, rootSchemaId);
    } catch(err) {
        logger.log("error", err.stack);
        if(err.message.startsWith("no schema with key or ref")) {
            throw new Error("Unsuported schema version specified. Supported version is draft-07.");
        }
    }
}

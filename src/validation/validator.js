let Ajv = require("ajv");
const logger = require("../winston");

function validate(schemas, entity, rootSchemaId) {
    let ajv = new Ajv({schemas: schemas, allErrors: true});
    let validate;
    try {
        validate = ajv.getSchema(rootSchemaId);
        validate(entity);
    } catch(err) {
        logger.log("error", err);
        throw new Error(err.message);
    }

    logger.log("debug", ajv.errorsText(validate.errors, {dataVar: entity.alias}));
    return validate.errors;
}

module.exports = validate;

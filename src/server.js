const express = require("express");
const logger = require("./winston");
const AppError = require("./model/application-error");
const { check, validationResult } = require("express-validator/check");
const { handleValidation } = require("./validation/validation-handler");

const argv = require("yargs").argv;
const npid = require("npid");

const app = express();
const port = process.env.PORT || 3020;

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(function(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    let appError = new AppError("Received malformed JSON.");
    logger.log("info", appError.errors);
    res.status(400).send(appError);
  } else {
    let appError = new AppError(err.message);
    logger.log("error", appError.errors);
    res.status(err.status).send(appError);
  }
});

// -- Endpoint definition -- //
app.post("/validate", [
    check("schemas", "At least one schema to validate the entity against is required.").isArray().not().isEmpty(),
    check("entity", "An entity to be validated is required.").exists()
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    } else {
      logger.log("debug", "Received POST request.");
      try {
        logger.log("debug", "Triggered validation . . .")
        let errors = handleValidation(req.body.schemas, req.body.entity, req.body.rootSchemaId);
        return res.json(errors || []);
      } catch(err) {
        logger.log("error", err);
        return res.status(500).send(new AppError(err.message));
      }
    }
  }
);

app.get("/validate", (req, res) => {
  logger.log("silly", "Received GET request.");
  res.send({
    message: "This is a JSON Schema Validator. Please POST to this endpoint the schema and entity to validate structured as showed bellow.",
    body: {
      schemas: [{}],
      entity: {}
    },
    repository: "https://github.com/fpenim/json-schema-validator"
  });
});

app.get("/", (req, res) => {
  res.redirect("/validate");
});

app.listen(port, () => {
  logger.log("info", ` -- Started server on port ${port} --`);
  if(argv.logPath) { logger.log("info", ` --> Log output: ${argv.logPath}`); }
});

// -- For monitoring purposes -- //
const pidPath = argv.pidPath || "./server.pid";
try {
  let pid = npid.create(pidPath);
  pid.removeOnExit();
} catch(err) {
  logger.log("error", err);
  process.exit(1);
}

// Handles crt + c event
process.on("SIGINT", () => {
  npid.remove(pidPath);
  process.exit();
});

// Handles kill -USR1 pid event (monit)
process.on("SIGUSR1", () => {
  npid.remove(pidPath);
  process.exit();
});

//Handles kill -USR2 pid event (nodemon)
process.on("SIGUSR2", () => {
  npid.remove(pidPath);
  process.exit();
});
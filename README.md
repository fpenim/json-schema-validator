# JSON Schema Validator
[![Build Status](https://travis-ci.org/fpenim/json-schema-validator.svg?branch=dev)](https://travis-ci.org/fpenim/json-schema-validator) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/7fbabc981e294249a9a0967965418058)](https://www.codacy.com/app/fpenim/json-schema-validator?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=EMBL-EBI-SUBS/json-schema-validator&amp;utm_campaign=Badge_Grade)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

This repository contains a [JSON Schema](http://json-schema.org/). This validator runs as a standalone node server that receives validation requests and gives back it's results.
The validation is done using the [AJV](https://github.com/epoberezkin/ajv) library version ^6.0.0 that fully supports the JSON Schema **draft-07**.

Latest released version available [here](http://json-schema-validator.fpenim.com).

## Contents
  - [Getting Started](README.md#getting-started)

  - [Validation API](README.md#validation-api)

  - [Custom keywords](README.md#custom-keywords)

  - [License](README.md#license)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
To be able to run this project you'll need to have [Node.js](https://nodejs.org/en/about/) and [npm](https://www.npmjs.com/) installed in your machine.
npm is distributed with Node.js which means that when you download Node.js, you automatically get npm installed on your computer.

### Installing

#### Node.js / npm
  - Get Node.js: https://nodejs.org/en/ (v8.11.1 LTS)

  - If you use [Homebrew](https://brew.sh/) you can install node by doing: `brew install node`

After installation check that everything is correctly installed and which versions you are running:
```
node -v
npm -v
```

#### Project
Clone project and install dependencies:
```
git clone https://github.com/fpenim/json-schema-validator.git
cd json-schema-validator
npm install
```

### Running the Tests
```
npm test
```

### Executing
```
node src/server
```
The node server will run on port **3020** and will expose one endpoint: **/validate**.

#### Startup arguments

- logPath

If provided with a log path argument, the application will write the logs to a file on the specified directory with a 24h rotation. To provide the log path add a `logPath` property after the startup statement:
```
node src/server --logPath=/log/directory/path
```

- pidPath

If provided with a pid file path argument, the application will write the pid into the specified file. If no pid file argument is provided, the application will still create a pid file on the default path: `./server.pid`.
To provide the pid file path add a `pidPath` property after the startup statement:
```
node src/server --pidPath=/pid/file/path/server.pid
```
Note: This is the **file path** and not just the directory it will be written to.

### Executing with Docker
  1. Build docker image:
```
docker build -t subs/json-schema-validator .
```
  2. Run docker image:
```
docker run -p 3020:3020 -d subs/json-schema-validator
```

### Development
For development purposes using [nodemon](https://nodemon.io/) is useful. It reloads the application everytime something has changed on save time.
```
nodemon src/server
```

## Validation API
This validator exposes one endpoint that accepts `POST` requests.

### /validate
This endpoint expects the body to have the following structure:
```js
{
  "schemas": [],
  "entity": {},
  "rootSchemaId": ""
}
```
Where the schemas should contain at least one valid json schema to validate the entity against. Multiple schemas may be provided when these reference each other using the keyword `"$ref"`. When this is the case, the `"$id"` of the primary/root schema must also be provided.

**Single schema example:**
```js
{
  "schemas": [
    {
      "type": "object",
      "properties": {
        "foo": { "type": "string" },
        "bar": { "type": "integer" },
        "zed": { "type": "boolean" }
      }
    }
  ],
  "entity": {
    "foo": "abc",
    "bar": 123,
    "zed": true
  }
}
```

**Multiple schemas example:** 
```js
{
  "schemas": [
    {
      "$id": "http://example.com/schemas/schema.json",
      "type": "object",
      "properties": {
        "foo": { "$ref": "defs.json#/definitions/int" },
        "bar": { "$ref": "definitions.json#/definitions/str" },
        "abc": { "$ref": "defs.json#/definitions/array" }
      },
      "required": ["foo"]
    },
    {
      "$id": "http://example.com/schemas/defs.json",
      "definitions": {
        "int": { "type": "integer" },
        "array": { "$ref": "definitions.json#/definitions/nextarray" }
      }
    },
    {
      "$id": "http://example.com/schemas/definitions.json",
      "definitions": {
        "str": { "type": "string" },
        "nextarray": { "type": "string" }
      }
    }
  ],
  "rootSchemaId": "http://example.com/schemas/schema.json",
  "entity": {
    "foo": 3,
    "abc": ""
  }
}
```

### Output

Response with no validation errors:

HTTP status code `200`
```js
[]
```
An example of a validation response with errors:

HTTP status code `200`
```js
[
  {
    "errors": [
        "should have required property 'value'"
    ],
    "dataPath": ".attributes['age'][0].value"
  },
  {
    "errors": [
        "should NOT be shorter than 1 characters",
        "should match format \"uri\""
    ],
    "dataPath": ".attributes['breed'][0].terms[0].url"
  }
]
```
Where *errors* is an array of error messages for a given input identified by its path on *dataPath*. There may be one or more error objects within the response array. An empty array represents a valid validation result.

### API Errors
Sending malformed JSON or a body with either the schema or the submittable missing will result in an API error (the request will not reach the validation). 

- When sending malformed JSON:

  HTTP status code `400` - Bad Request
  ```js
  {
    "errors": "Malformed JSON please check your request body."
  }
  ```
- When any of the required body values is missing:

  HTTP status code `422` - Unprocessable Entity
  ```js
  {
    "errors": {
      "schema": {
        "location": "body",
        "param": "schema",
        "msg": "Required."
      },
      "object": {
        "location": "body",
        "param": "object",
        "msg": "Required."
      }
    }
  }
  ```

## Custom keywords
The AJV library supports the implementation of custom json schema keywords to address validation scenarios that go beyond what json schema can handle.

Two example custom keywords implementations are available under `examples/custom-keywords`, these are `isChildTermOf` and `isValidTerm`. For more details see the documentation on [CUSTOM KEYWORDS](CUSTOM_KW.md).

## License
 For more details about licensing see the [LICENSE](LICENSE.md).

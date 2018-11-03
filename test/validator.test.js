const fs = require("fs");
const validate = require("../src/validation/validator");

test("Empty Schema (empty object)", () => {

  let errors = validate([{}], {}, null);
  expect(errors).toBeNull();
});

test("Attributes Schema", () => {
  let inputSchema = fs.readFileSync("examples/schemas/attributes-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/entities/attributes.json"); 
  let jsonObj = JSON.parse(inputObj);

  let errors = validate([jsonSchema], jsonObj, null);

  expect(errors).toBeDefined();
  expect(errors.length).toBe(1);

  expect(errors[0].dataPath).toBe(".attributes['breed'][0].terms[0].url");
  expect(errors[0].message).toBe("should match format \"uri\"");
});

test("BioSamples Schema - FAANG \'organism\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/biosamples-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/entities/faang-organism-sample.json");
  let jsonObj = JSON.parse(inputObj);

  let errors = validate([jsonSchema], jsonObj, null);
  expect(errors).toBeNull();
});

test("Study Schema", () => {
  let inputSchema = fs.readFileSync("examples/schemas/submittables/study-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/entities/study.json");
  let jsonObj = JSON.parse(inputObj);

  let errors = validate([jsonSchema], jsonObj, null);
 
  expect(errors).toBeDefined();
  expect(errors.length).toBe(2);
 
  expect(errors[0].dataPath).toBe("");
  expect(errors[0].message).toBe("should have required property 'alias'");
  expect(errors[1].dataPath).toBe("");
  expect(errors[1].message).toBe("should have required property 'StudyDataType'");
});
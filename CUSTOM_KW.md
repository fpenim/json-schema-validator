# Custom Keywords

## isChildTermOf
This custom keyword *evaluates if an ontology term is child of other*. This keyword is applied to a string (url) and **passes validation if the term is a child of the term defined in the schema**.
The keyword requires the **parent term** and the **ontology id**, both of which should exist in [OLS - Ontology Lookup Service](https://www.ebi.ac.uk/ols).

This keyword works by doing an asynchronous call to the [OLS API](https://www.ebi.ac.uk/ols/api/) that will respond with the required information to know if a given term is child of another. 
Being an async validation step, whenever used is a schema, the schema must have the flag: `"$async": true` in it's object root.

### Usage
Schema:
```js
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$async": true,
  "properties": {
    "term": { 
      "type": "string", 
      "format": "uri",
      "isChildTermOf": {
        "parentTerm": "http://purl.obolibrary.org/obo/PATO_0000047",
        "ontologyId": "pato"
      } 
    }
  }
}
```
JSON object:
```js
{
  "term": "http://purl.obolibrary.org/obo/PATO_0000383"
}
```

## isValidTerm
This custom keyword *evaluates if a given ontology term url exists in OLS* ([Ontology Lookup Service](https://www.ebi.ac.uk/ols)). It is applied to a string (url) and **passes validation if the term exists in OLS**. It can be aplied to any string defined in the schema.

This keyword works by doing an asynchronous call to the [OLS API](https://www.ebi.ac.uk/ols/api/) that will respond with the required information to determine if the term exists in OLS or not. 
Being an async validation step, whenever used is a schema, the schema must have the flag: `"$async": true` in it's object root.

### Usage
Schema:
```js
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$async": true,

  "properties": {
    "url": { 
      "type": "string", 
      "format": "uri",
      "isValidTerm": true 
    } 
  }
}
```
JSON object:
```js
{
  "url": "http://purl.obolibrary.org/obo/PATO_0000383"
}
```
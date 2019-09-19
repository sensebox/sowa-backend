const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;
const endpoint = 'http://localhost:3030/senph/sparql';
const updatepoint = 'http://localhost:3030/senph/update';
// const unitpoint = 'http://localhost:3030/uo/sparql';



// const unitsClient = new SparqlClient(unitpoint)
//     .register({   owl: 'http://www.w3.org/2002/07/owl#',
//                 rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
//                 uo: 'http://purl.obolibrary.org/obo/',
//                 rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
//     })  


const client = new SparqlClient(endpoint, {
  updateEndpoint: updatepoint
})
  .register({
    owl: 'http://www.w3.org/2002/07/owl#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    s: 'http://www.opensensemap.org/SENPH#',
    uo: 'http://purl.obolibrary.org/obo/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    xsd: 'http://www.w3.org/2001/XMLSchema#'

  })


/* ---------- All sensor funtions: -----------------*/

//get all sensors @returns iris and labels
module.exports.getSensors = function () {
  return client
    .query(SPARQL`
                     SELECT ?label ?sensor
                     WHERE {
                       ?sensor rdf:type s:sensor.
                       OPTIONAL {?sensor rdfs:label ?label.}
                     }`)
    .execute({ format: { resource: 'sensor' } })
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}


//get a single sensor identified by its iri @returns the sensor's labels, descriptions, datasheet, image, lifeperiod, manufacturer, price, phenomena it can measueres and accuracy values, devices it is part of
module.exports.getSensor = function (iri) {
  return client
    .query(SPARQL`
    Select Distinct ?iri  ?labels ?description  ?manufacturer ?price ?datasheet  ?lifeperiod ?image ?device ?selement
                     WHERE {   
  						          {	
                            ${{ s: iri }}  rdfs:label ?name.
                            ?iri ?rdf ?name
                        }
                        UNION 
                        {   
                          ${{ s: iri }}  rdfs:label ?labels.
                        }
                        UNION 
                        {   
                            ${{ s: iri }} rdfs:comment ?description.
                        }
                        UNION
                        {
                            ${{ s: iri }} s:hasElement ?selement.
                        }
                        UNION
                        {
                            ${{ s: iri }} s:isSensorOf ?devices.
                        }  
                        UNION
                        {
                            ${{ s: iri }} s:manufacturer ?manufacturer.
                        }
                        UNION
                        {
                            ${{ s: iri }} s:priceInEuro ?price.
                        }
                        UNION
                        {	
                            ${{ s: iri }} s:dataSheet ?datasheet.
                        }
                        UNION
                        {
                            ${{ s: iri }} s:lifePeriod ?lifeperiod.
                        } 
                        UNION
                        {
                            ${{ s: iri }} s:image ?image.
                        } 
                     }
                Group BY ?iri ?labels ?description ?datasheet ?image ?lifeperiod ?manufacturer ?price ?device ?selement
                ORDER BY ?iri ?phenomena ?device ?selement
          `)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}

//get a single sensorelment identified by its iri @returns phenomena it can measueres and accuracy values
module.exports.getSensorElement = function (iri) {
  iri = iri.slice(34);
  return client
    .query(SPARQL`
    Select Distinct ?phenomena ?unit ?accVal
                     WHERE {   
                            ${{ s: iri }} s:canMeasure ?phenomena.
                            ?sensorElement s:canMeasure ?phenomena.
                            OPTIONAL { ?sensorElement s:hasAccuracyUnit ?unit.}
                            OPTIONAL { ?sensorElement s:accuracyValue ?accVal.}                         
                     }
                Group BY ?phenomena ?unit ?accVal
                ORDER BY ?phenomena
          `)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}





//get a single sensor identified by its iri @returns the sensor's labels, descriptions, datasheet, image, lifeperiod, manufacturer, price, phenomena it can measueres and accuracy values, devices it is part of
module.exports.getSensorIRI = function (iri) {
  return client
    .query(SPARQL`
  Select Distinct ?iri ?label ?description ?datasheet ?image ?lifeperiod ?manufacturer ?price ?phenomena ?unit ?device
                   WHERE {   
            {	
                          ${{ s: iri }}  rdfs:label ?label.
                        ?iri ?rdf ?label
                      }
                      UNION 
                      {   
                          ${{ s: iri }} rdfs:comment ?description.
                      }
                      UNION
                      {	
                          ${{ s: iri }} s:dataSheet ?datasheet.
                      }
                      UNION
                      {
                          ${{ s: iri }} s:image ?image.
                      } 
                      UNION
                      {
                          ${{ s: iri }} s:lifePeriod ?lifeperiod.
                      } 
                      UNION
                      {
                          ${{ s: iri }} s:manufacturer ?manufacturer.
                      }
                      UNION
                      {
                          ${{ s: iri }} s:priceInEuro ?price.
                      }
                      UNION
                      {
                          ${{ s: iri }} s:hasElement ?selement.
                          ?selement   s:canMeasure ?phenomena.
                          OPTIONAL {?phenomena rdfs:label ?phenomenaLabel.}
                          OPTIONAL { ?selement s:hasAccuracyUnit ?unit.}
                      }
                      UNION
                      {
                          ${{ s: iri }} s:isSensorOf ?devices.
                      }  

                   }
              Group BY ?iri ?label ?description ?datasheet ?image ?lifeperiod ?manufacturer ?price ?phenomena ?unit ?device 
              ORDER BY ?iri ?phenomena ?device
        `)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}

//update/add a new sensor @inputs required: label +language, description + language, a phenomenon that is meaured with according accuracy value; optional: manufacturer, data sheet, price in Euro, life period (currently not available because of datatype issue) and an image  
module.exports.updateSensor = function (sensor) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  var sElem = sensor.sensorElement[0].phenomenon + "_" + sensor.name.label;
  if (sensor.image == undefined) { sensor.image = "" }
  var bindingsText = 'INSERT DATA {' +
    '?sensorname rdf:type     s:sensor.' +
    '?sensorname rdfs:label   ?sensorlabel. ' +
    '?sensorname rdfs:comment ?desc.' +
    (sensor.manufacturer ? '?sensorname s:manufacturer ?manu.' : '') +
    (sensor.dataSheet ? '?sensorname s:dataSheet    ?datasheet.' : '') +
    (sensor.price ? '?sensorname s:priceInEuro  ?price.' : '') +
    (sensor.lifePeriod ? '?sensorname s:lifePeriod   ?life.' : '') +
    (sensor.image ? '?sensorname s:image        ?image.' : '') +
    (sensor.device ? '?sensorname s:isSensorOf   ?device.' : '') +
    '?sensorname s:hasElement       ?elem.' +
    '?elem       s:canMeasure       ?phenomenon.' +
    '?elem       s:hasAccuracyValue ?uoa.' +
    '}';
  return client
    .query(bindingsText)
    .bind({
      sensorname: { value: senphurl + sensor.uri, type: 'uri' },
      sensorlabel: { value: sensor.name.label, lang: sensor.name.lang },
      desc: { value: sensor.description.comment, lang: sensor.description.lang },
      manu: { value: sensor.manufacturer, type: 'string' },
      datasheet: { value: sensor.dataSheet, type: 'string' },
      price: { value: sensor.price, type: 'float' },
      life: { value: sensor.lifePeriod, type: 'string' },
      image: { value: sensor.image, type: 'string' },
      device: { value: senphurl + sensor.device, type: 'uri' },
      elem: { value: senphurl + sElem, type: 'uri' },
      phenomenon: { value: senphurl + sensor.sensorElement[0].phenomenon, type: 'uri' },
      uoa: { value: sensor.sensorElement[0].uoa, type: 'float' }
    })
    .execute()
    .then(Promise.resolve(console.log("everthing ok")))
    .catch(function (error) {
      console.log(error.httpStatus);
      console.log(error);
    });
}


module.exports.editSensor = function (sensor) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  var sElements = '';
  console.log(sensor);
  sensor.sensorElements.forEach(element => {
    element['uri'] = "sensorElement_" + sensor.uri + "_" + element.phenomenonUri.slice(34);
  })
  console.log(sensor);
  var bindingsText = 'DELETE {?a ?b ?c}' +
    'INSERT {' +
    '?sensorURI rdf:type     s:sensor.' +
    '?sensorURI rdfs:comment ?desc.';
  sensor.labels.forEach(element => {
    var string = '?sensorURI rdfs:label ' + '"' + element.value + '"' + '@' + element.lang + '. ';
    bindingsText = bindingsText.concat(string)
  });
  if (sensor.manufacturer != '') {
    var string = '?sensorURI s:manufacturer ?manu.'
    bindingsText = bindingsText.concat(string)
  }
  if (sensor.datasheet != '') {
    var string = '?sensorURI s:dataSheet ?datasheet.'
    bindingsText = bindingsText.concat(string)
  }
  if (sensor.price != '') {
    var string = '?sensorURI s:priceInEuro ?price.'
    bindingsText = bindingsText.concat(string)
  }
  if (sensor.lifeperiod != '') {
    var string = '?sensorURI s:lifePeriod ?life.'
    bindingsText = bindingsText.concat(string)
  }
  if (sensor.image != '') {
    var string = '?sensorURI s:image ?image.'
    bindingsText = bindingsText.concat(string)
  }
  sensor.devices.forEach(element => {
    var string = '?sensorURI s:isSensorOf s:' + element.deviceUri.slice(34) + '. ';
    bindingsText = bindingsText.concat(string)
  });
  sensor.sensorElements.forEach(element => {
    var string = '?sensorUri s:hasElement s:' + element.uri + '. ' +
      's:' + element.uri + ' s:canMeasure s:' + element.phenomenonUri.slice(34) + '. ' +
      's:' + element.uri + ' s:hasAccuracyUnit <' + element.unitOfAccuracy + '>. ' +
      's:' + element.uri + ' s:accuracyValue ' + '"' + element.accuracyValue + '"' + '^^xsd:float.';
    var filterString = ' ?a = s:' + element.uri + ' && (?b = s:canMeasure ||'+
    ' ?b = s:hasAccuracyUnit ||'+
    ' ?b = s:accuracyValue) ||'+
    ' ?c = s:' + element.uri + ' && ?b = s:measuredBy ||';
    sElements = filterString;
      bindingsText = bindingsText.concat(string)
  });
  bindingsText = bindingsText.concat('} WHERE {?a ?b ?c. FILTER (',
    ' (?a = ?sensorUri) && (?b = s:manufacturer ||',
    ' ?b = s:dataSheet ||',
    ' ?b = s:priceInEuro ||',
    ' ?b = s:lifePeriod ||',
    ' ?b = s:image ||',
    ' ?b = s:hasElement ||',
    ' ?b = s:isSensorOf ||',
    ' ?b = rdfs:comment ||',
    ' ?b = rdfs:label ||',
    ' ?b = rdf:type) ||',
    sElements,
    // ' ?a = s:' + element.uri + ' && ?b = s:canMeasure ||',
    // ' ?a = s:' + element.uri + ' && ?b = s:hasAccuracyUnit ||',
    // ' ?a = s:' + element.uri + ' && ?b = s:accuracyValue ||',

    // ' ?c = s:' + element.uri + ' && ?b = s:measuredBy ||',
    ' ?c = ?sensorUri && (?b = s:hasSensor ||',
    '  ?b = s:isElementOf))}');
  // TODO: FINISH the bind part check whether all variables are fine!!!
  // TODO: Add dynamic description language tag!
  console.log(bindingsText)
  return client
    .query(bindingsText)
    .bind({
      sensorUri: { value: senphurl + sensor.uri, type: 'uri' },
      desc: { value: sensor.description, lang: 'en' },
      manu: { value: sensor.manufacturer, type: 'string' },
      datasheet: { value: sensor.datasheet, type: 'string' },
      price: { value: sensor.price, type: 'float' },
      life: { value: sensor.lifeperiod, type: 'string' },
      image: { value: sensor.image, type: 'string' }
    })
    .execute()
    .then(Promise.resolve(console.log("everthing ok")))
    .catch(function (error) {
      console.log(error.httpStatus);
      console.log(error);
    });
}



//get a single device identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
module.exports.editPhenomenon = function (phenomenon) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  console.log(phenomenon);

  // create SPARQL Query: 
  var bindingsText = 'DELETE {?a ?b ?c}' +
    'INSERT {' +
    '?sensorURI rdf:type     s:sensor.' +
    '?sensorURI rdfs:comment ?desc.';
  // create insert ;line for each unit 
  phenomenon.label.forEach(element => {
    console.log(element);
    var string = '?phenomenonURI rdfs:label ' + '"' + element.value + '"' + '@' + element.lang + '. ';
    bindingsText = bindingsText.concat(string)
  });
  // create insert ;line for each unit 
  phenomenon.unit.forEach(element => {
    console.log(element);
    var string = '?phenomenonURI s:describedBy ' + '<' + element.unitUri + '>' + '.' +
      '<' + element.unitUri + '> rdfs:label "' + element.unitLabel + '".';

    bindingsText = bindingsText.concat(string)
  });
  // create insert ;line for each domain 
  phenomenon.domain.forEach(element => {
    console.log(element);
    var string = '?phenomenonURI s:hasDomain s:' + element.domainUri.slice(34) + '. ';
    bindingsText = bindingsText.concat(string)
  });
  // add WHERE statement 
  bindingsText = bindingsText.concat('} WHERE {?a ?b ?c. FILTER (?a = ?phenomenonURI && ?b = s:hasDomain || ?a = ?phenomenonURI && ?b = s:describedBy || ?a = ?phenomenonURI && ?b = rdfs:comment || ?a = ?phenomenonURI && ?b = rdfs:label || ?a = ?phenomenonURI && ?b = rdf:type || ?c = ?phenomenonURI && ?b = s:isDomainOf || ?c = ?phenomenonURI && ?b = s:isDescribedBy)}');
  console.log(bindingsText);

  return client
    .query(bindingsText)
    // bind values to variable names
    .bind({
      phenomenonURI: { value: senphurl + phenomenon.uri, type: 'uri' },
      // +++ FIXME +++ language hardcoded, make it dynamic
      // phenomenonLabel:      {value: phenomenon.name, lang: "en"},
      // +++ FIXME +++ language hardcoded, make it dynamic
      desc: { value: phenomenon.description, lang: "en" },
    })
    .execute()
    .then(Promise.resolve(console.log("evertyhing ok")))
    .catch(function (error) {
      console.log(error);
    });
}



/**--------------Get all phenomena that can be measured by a given sensor ----------------------- */
module.exports.getPhenomenaForSensor = function (iri) {
  return client
    .query(SPARQL`
                     SELECT ?label ?phenomenon
                     WHERE {
                       ${{ s: iri }} s:hasElement ?sensorElement;
                       ?sensorElement s:canMeasure ?phenomenon
                       ?phenomenon rdfs:label ?label 
                     }`)
    .execute({ format: { resource: 'phenomenon' } })
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}

/**--------------Get all sensors that can measure a given phenomenon --------------- */
module.exports.getSensorsForPhenomenon = function (iri) {
  return client
    .query(SPARQL`
                     SELECT ?label ?sensors
                     WHERE {
                       ${{ s: iri }} s:measurableBy ?sensorElement;
                       ?sensorElement s:isElementOf ?sensors
                       ?sensors rdfs:label ?label 
                     }`)
    .execute({ format: { resource: 'sensors' } })
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}


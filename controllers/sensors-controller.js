const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;
const config = require('config');
const Sensor = require('../models/Sensor');
const Sensors = require('../models/Sensors');

const fuseki_endpoint = config.get('fuseki_endpoint');
const endpoint = `${fuseki_endpoint}/senph/sparql`;
const updatepoint = `${fuseki_endpoint}/senph/update`;
const history_endpoint = `${fuseki_endpoint}/senph-history/sparql`;
const history_updatepoint = `${fuseki_endpoint}/senph-history/update`;
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

const historyClient = new SparqlClient(history_endpoint, {
  updateEndpoint: history_updatepoint
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
                     SELECT ?sensorLabel ?sensor ?validation
                     WHERE {
                       ?sensor rdf:type s:sensor.
                       ?sensor rdfs:label ?sensorLabel.
                       OPTIONAL{
                       ?sensor s:isValid ?validation.
                       }
                    }`)
    .execute({ format: { resource: 'sensor' } })
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log(error);
      console.log("Oh no, error!")
    });
}


//get history of a sensors
module.exports.getSensorHistory = function (iri) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  var bindingsText = `
  SELECT ?sensor ?dateTime ?user
                      WHERE {
                        ?sensor rdf:type s:sensor.
                        OPTIONAL{
                          ?sensor s:editDate ?dateTime
                        }
                        OPTIONAL{
                          ?sensor s:editBy ?user
                        }   
                        FILTER(regex(str(?sensor), ?iri, "i" ))
                      }`;
  return historyClient
    .query(bindingsText)
    .bind('iri', senphurl + iri + "_")
    .execute()
    .then(res => {
      console.log(res.results.bindings)
      return res.results.bindings
    })
    .catch(function (error) {
      console.log(error);
      console.log("Oh no, error!")
    });
}




//get a single sensor identified by its iri @returns the sensor's labels, descriptions, datasheet, image, lifeperiod, manufacturer, price, phenomena it can measueres and accuracy values, devices it is part of
// module.exports.getSensorIRI = function (iri) {
//   console.log(iri);
//   return client
//     .query(SPARQL`
//     Select Distinct ?iri  ?label ?description  ?manufacturer ?price ?datasheet  ?lifeperiod ?image ?device ?deviceLabel ?sensorElement ?phenomenon  ?unit ?accVal
//                      WHERE {   
//   						          {	
//                             ${{ s: iri }}  rdfs:label ?name.
//                             ?iri ?rdf ?name
//                         }
//                         UNION 
//                         {   
//                           ${{ s: iri }}  rdfs:label ?label.
//                         }
//                         UNION 
//                         {   
//                             ${{ s: iri }} rdfs:comment ?description.
//                         }
//                         UNION
//                         {
//                             ${{ s: iri }} s:hasElement ?sensorElement.
//                               ?sensorElement s:canMeasure ?phenomenon.
//                               ?sensorElement s:hasAccuracyUnit ?unit.
//                               ?sensorElement s:accuracyValue ?accVal.
//                         }
//                         UNION
//                         {
//                             ${{ s: iri }} s:isSensorOf ?device.
//                             OPTIONAL
//                             { ?device rdfs:label ?deviceLabel.}
//                         }  
//                         UNION
//                         {
//                             ${{ s: iri }} s:manufacturer ?manufacturer.
//                         }
//                         UNION
//                         {
//                             ${{ s: iri }} s:priceInEuro ?price.
//                         }
//                         UNION
//                         {	
//                             ${{ s: iri }} s:dataSheet ?datasheet.
//                         }
//                         UNION
//                         {
//                             ${{ s: iri }} s:lifePeriod ?lifeperiod.
//                         } 
//                         UNION
//                         {
//                             ${{ s: iri }} s:image ?image.
//                         } 
//                      }
//                 Group BY ?iri ?label ?description ?datasheet ?image ?lifeperiod ?manufacturer ?price ?device ?deviceLabel ?sensorElement ?phenomenon  ?unit ?accVal
//                 ORDER BY ?iri ?phenomenon ?device ?sensorElement
//           `)
//     .execute()
//     .then(res => {
//       console.log(res.results.bindings)
//       return res.results.bindings
//     })
//     .catch(function (error) {
//       console.dir(arguments, { depth: null })
//       console.log("Oh no, error!")
//     });
// }

//get a single sensorelment identified by its iri @returns phenomena it can measueres and accuracy values
module.exports.getSensorElement = function (iri) {
  iri = iri.slice(34);
  return client
    .query(SPARQL`
    Select Distinct ?sensorElement ?phenomenon ?unit ?accVal
                     WHERE {   
                            ${{ s: iri }} s:canMeasure ?phenomenon.
                            ?sensorElement s:canMeasure ?phenomenon.
                            ?sensorElement s:hasAccuracyUnit ?unit.
                            ?sensorElement s:accuracyValue ?accVal.                         
                     }
                Group BY ?sensorElement ?phenomenon ?unit ?accVal
                ORDER BY ?phenomenon
          `)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log(error);
console.log("Oh no, error!")
    });
}





//get a single sensor identified by its iri @returns the sensor's labels, descriptions, datasheet, image, lifeperiod, manufacturer, price, phenomena it can measueres and accuracy values, devices it is part of
module.exports.getSensor = function (iri) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';

  var bindingsText = `Select Distinct ?label ?description  ?manufacturer ?price ?datasheet  ?lifeperiod ?image ?device ?deviceLabel ?sensorElement ?phenomenon  ?unit ?accVal ?validation
  WHERE {   
     {   
       ?iri  rdfs:label ?label.
     }
     UNION 
     {   
         ?iri rdfs:comment ?description.
     }
     UNION
     {
         ?iri s:hasElement ?sensorElement.
           ?sensorElement s:canMeasure ?phenomenon.
           ?sensorElement s:hasAccuracyUnit ?unit.
           ?sensorElement s:accuracyValue ?accVal.
     }
     UNION
     {
         ?iri s:isSensorOf ?device.
         OPTIONAL
         { ?device rdfs:label ?deviceLabel.}
     }  
     UNION
     {
         ?iri s:manufacturer ?manufacturer.
     }
     UNION
     {
         ?iri s:priceInEuro ?price.
     }
     UNION
     {	
         ?iri s:dataSheet ?datasheet.
     }
     UNION
     {
         ?iri s:lifePeriod ?lifeperiod.
     } 
     UNION
     {
         ?iri s:image ?image.
     } 
     UNION
     {
         ?iri s:isValid ?validation.
     } 
  }
Group BY ?label ?description ?datasheet ?image ?lifeperiod ?manufacturer ?price ?device ?deviceLabel ?sensorElement ?phenomenon  ?unit ?accVal ?validation
ORDER BY ?phenomenon ?device ?sensorElement`;
  return client
    .query(bindingsText)
    .bind('iri', { s: iri })
    .execute()
    .then(res => {
      res.results.bindings.push({
        'iri':
        {
          type: 'uri',
          value: senphurl + iri
        }
      })
      console.log(res.results.bindings)
      return res.results.bindings
    })
    .catch(function (error) {
      console.dir(arguments, { depth: null })
      console.log("Oh no, error!")
      console.log(error)
    });
}


//get a single historic sensor entry identified by its iri @returns the sensor's labels, descriptions, datasheet, image, lifeperiod, manufacturer, price, phenomena it can measueres and accuracy values, devices it is part of
module.exports.getHistoricSensor = function (iri) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';

  var bindingsText = `Select Distinct ?label ?description  ?manufacturer ?price ?datasheet  ?lifeperiod ?image ?device ?deviceLabel ?sensorElement ?phenomenon  ?unit ?accVal ?validation
  WHERE {   
     {   
       ?iri  rdfs:label ?label.
     }
     UNION 
     {   
         ?iri rdfs:comment ?description.
     }
     UNION
     {
         ?iri s:hasElement ?sensorElement.
           ?sensorElement s:canMeasure ?phenomenon.
           ?sensorElement s:hasAccuracyUnit ?unit.
           ?sensorElement s:accuracyValue ?accVal.
     }
     UNION
     {
         ?iri s:isSensorOf ?device.
         ?device rdfs:label ?deviceLabel.
     }  
     UNION
     {
         ?iri s:manufacturer ?manufacturer.
     }
     UNION
     {
         ?iri s:priceInEuro ?price.
     }
     UNION
     {	
         ?iri s:dataSheet ?datasheet.
     }
     UNION
     {
         ?iri s:lifePeriod ?lifeperiod.
     } 
     UNION
     {
         ?iri s:image ?image.
     }
     UNION
     {
         ?iri s:isValid ?validation.
     } 

  }
Group BY ?label ?description ?datasheet ?image ?lifeperiod ?manufacturer ?price ?device ?deviceLabel ?sensorElement ?phenomenon  ?unit ?accVal ?validation
ORDER BY ?phenomenon ?device ?sensorElement`;
  return historyClient
    .query(bindingsText)
    .bind('iri', { s: iri })
    .execute()
    .then(res => {
      res.results.bindings.push({
        'iri':
        {
          type: 'uri',
          value: senphurl + iri
        }
      })
      console.log(res.results.bindings)
      return res.results.bindings
    })
    .catch(function (error) {
      console.dir(arguments, { depth: null })
      console.log("Oh no, error!")
      console.log(error)
    });
}



//update/add a new sensor @inputs required: label +language, description + language, a phenomenon that is meaured with according accuracy value; optional: manufacturer, data sheet, price in Euro, life period (currently not available because of datatype issue) and an image  
// module.exports.updateSensor = function (sensor) {
//   var senphurl = 'http://www.opensensemap.org/SENPH#';
//   var sElem = sensor.sensorElement[0].phenomenon + "_" + sensor.name.label;
//   if (sensor.image == undefined) { sensor.image = "" }
//   var bindingsText = 'INSERT DATA {' +
//     '?sensorname rdf:type     s:sensor.' +
//     '?sensorname rdfs:label   ?sensorlabel. ' +
//     '?sensorname rdfs:comment ?desc.' +
//     (sensor.manufacturer ? '?sensorname s:manufacturer ?manu.' : '') +
//     (sensor.dataSheet ? '?sensorname s:dataSheet    ?datasheet.' : '') +
//     (sensor.price ? '?sensorname s:priceInEuro  ?price.' : '') +
//     (sensor.lifePeriod ? '?sensorname s:lifePeriod   ?life.' : '') +
//     (sensor.image ? '?sensorname s:image        ?image.' : '') +
//     (sensor.device ? '?sensorname s:isSensorOf   ?device.' : '') +
//     '?sensorname s:hasElement       ?elem.' +
//     '?elem       s:canMeasure       ?phenomenon.' +
//     '?elem       s:hasAccuracyValue ?uoa.' +
//     '}';
//   return client
//     .query(bindingsText)
//     .bind({
//       sensorname: { value: senphurl + sensor.uri, type: 'uri' },
//       sensorlabel: { value: sensor.name.label, lang: sensor.name.lang },
//       desc: { value: sensor.description.comment, lang: sensor.description.lang },
//       manu: { value: sensor.manufacturer, type: 'string' },
//       datasheet: { value: sensor.dataSheet, type: 'string' },
//       price: { value: sensor.price, type: 'float' },
//       life: { value: sensor.lifePeriod, type: 'string' },
//       image: { value: sensor.image, type: 'string' },
//       device: { value: senphurl + sensor.device, type: 'uri' },
//       elem: { value: senphurl + sElem, type: 'uri' },
//       phenomenon: { value: senphurl + sensor.sensorElement[0].phenomenon, type: 'uri' },
//       uoa: { value: sensor.sensorElement[0].uoa, type: 'float' }
//     })
//     .execute()
//     .then(Promise.resolve(console.log("everthing ok")))
//     .catch(function (error) {
//       console.log(error.httpStatus);
//       console.log(error);
//     });
// }


module.exports.editSensor = function (sensor, role) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  // if (role != 'expert' && role != 'admin') {
  //   console.log("User has no verification rights!");
  //   sensor.validation = false;
  // }
  sensor.sensorElement.forEach(element => {
    element['uri'] = "sensorElement_" + sensor.uri + "_" + element.phenomenonUri.slice(34);
  })

  // DELETE {...} INSERT{...}
  var bindingsText = 'DELETE {?a ?b ?c}' +
    'INSERT {' +
    '?sensorURI rdf:type        s:sensor. ' +
    '?sensorURI rdfs:comment    ?desc. ' +
    '?sensorURI s:manufacturer  ?manu.' +
    '?sensorURI s:dataSheet     ?datasheet.' +
    '?sensorURI s:priceInEuro   ?price.' +
    '?sensorURI s:lifePeriod    ?life.' +
    '?sensorURI s:image         ?image.' +
    '?sensorURI s:isValid       ?validation.';


  sensor.label.forEach(element => {
    bindingsText = bindingsText.concat(
      '?sensorURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
    );
  });

  sensor.device.forEach(element => {
    bindingsText = bindingsText.concat(
      '?sensorURI s:isSensorOf s:' + element.deviceUri.slice(34) + '. '
    );
  });

  sensor.sensorElement.forEach(element => {
    var string = '?sensorURI s:hasElement s:' + element.uri + '. ' +
      's:' + element.uri + ' s:canMeasure s:' + element.phenomenonUri.slice(34) + '. ' +
      's:' + element.uri + ' s:hasAccuracyUnit <' + element.unitOfAccuracy + '>. ' +
      's:' + element.uri + ' s:accuracyValue ' + JSON.stringify(element.accuracyValue) + '.';
    bindingsText = bindingsText.concat(string)
  });

  // WHERE { ... FILTER{...}}
  bindingsText = bindingsText.concat(
    '} WHERE {?a ?b ?c. FILTER ('
  );

  sensor.sensorElement.forEach(element => {
    bindingsText = bindingsText.concat(
      '?a = s:' + element.uri + ' || ?c = s:' + element.uri + ' || '
    );
  });

  bindingsText = bindingsText.concat(' ?a = ?sensorURI || ?c = ?sensorURI )}');

  // TODO: Add dynamic description language tag!
  // LOG and EXECTUE UPDATE 
  console.log(bindingsText)
  return client
    .query(bindingsText)
    .bind({
      sensorURI: { value: senphurl + sensor.uri, type: 'uri' },
      desc: { value: sensor.description, lang: "en" },
      manu: sensor.manufacturer,
      datasheet: { value: sensor.datasheet, type: 'uri' },
      price: { value: sensor.price, type: 'decimal' },
      life: { value: sensor.lifeperiod, type: 'integer' },
      image: { value: sensor.image, type: 'string' },
      validation: { value: sensor.validation, type: 'boolean' }
    })
    .execute();
}

module.exports.deleteSensor = function (sensor, role) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  // if (role != 'expert' && role != 'user') {
  //   console.log("User has no verification rights!");
  // }
  // else {
    var bindingsText =
      ` DELETE {?a ?b ?c}
    WHERE { ?a ?b ?c .
            FILTER (?a = ?sensorURI || ?c = ?sensorURI )
          }`;
    console.log(bindingsText)
    return client
      .query(bindingsText)
      .bind({
        sensorURI: { value: senphurl + sensor.uri, type: 'uri' },
      })
      .execute();
  //}
}



module.exports.createHistorySensor = function (sensor, user) {
  var date = Date.now();
  var isoDate = new Date(date).toISOString();
  sensor['dateTime'] = date;
  //console.log(sensor);
  // if (user.role != 'expert' && user.role != 'admin') {
  //   console.log("User has no verification rights!");
  //   sensor.validation = false;
  // }
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  sensor.sensorElement.forEach(element => {
    element['uri'] = "sensorElement_" + sensor.uri + "_" + element.phenomenonUri.slice(34) + '_' + sensor.dateTime;
  })

  // DELETE {...} INSERT{...}
  var bindingsText = 'INSERT DATA {' +
    '?sensorURI rdf:type        s:sensor. ' +
    '?sensorURI rdfs:comment    ?desc. ' +
    '?sensorURI s:manufacturer  ?manu.' +
    '?sensorURI s:dataSheet     ?datasheet.' +
    '?sensorURI s:priceInEuro   ?price.' +
    '?sensorURI s:lifePeriod    ?life.' +
    '?sensorURI s:image         ?image.' +
    '?sensorURI s:isValid       ?validation.' +
    '?sensorURI s:editDate      ?dateTime.' +
    '?sensorURI s:editBy        ?userName.';


  sensor.label.forEach(element => {
    bindingsText = bindingsText.concat(
      '?sensorURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
    );
  });

  sensor.device.forEach(element => {
    bindingsText = bindingsText.concat(
      '?sensorURI s:isSensorOf s:' + element.deviceUri.slice(34) + '. '
    );
  });

  sensor.sensorElement.forEach(element => {
    var string = '?sensorURI s:hasElement s:' + element.uri + '. ' +
      's:' + element.uri + ' s:canMeasure s:' + element.phenomenonUri.slice(34) + '. ' +
      's:' + element.uri + ' s:hasAccuracyUnit <' + element.unitOfAccuracy + '>. ' +
      's:' + element.uri + ' s:accuracyValue ' + JSON.stringify(element.accuracyValue) + '.';
    bindingsText = bindingsText.concat(string)
  });

  bindingsText = bindingsText.concat('}')
  // TODO: Add dynamic description language tag!
  // LOG and EXECTUE UPDATE 
  //console.log(bindingsText)
  return historyClient
    .query(bindingsText)
    .bind({
      sensorURI: { value: senphurl + sensor.uri + '_' + sensor.dateTime, type: 'uri' },
      desc: { value: sensor.description, lang: "en" },
      manu: sensor.manufacturer,
      datasheet: { value: sensor.datasheet, type: 'uri' },
      price: { value: sensor.price, type: 'decimal' },
      life: { value: sensor.lifeperiod, type: 'integer' },
      image: { value: sensor.image, type: 'string' },
      validation: { value: sensor.validation, type: 'boolean' },
      dateTime: { value: isoDate, type: 'http://www.w3.org/2001/XMLSchema#dateTime' },
      //userName: user.name
    })
    .execute();
}

module.exports.createNewSensor = function (sensor, role) {
  console.log(sensor);
  // if (role != 'expert' && role != 'admin') {
  //   console.log("User has no verification rights!");
  //   sensor.validation = false;
  // }
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  sensor.sensorElement.forEach(element => {
    element['uri'] = "sensorElement_" + sensor.uri + "_" + element.phenomenonUri.slice(34);
  })

  // DELETE {...} INSERT{...}
  var bindingsText = 'INSERT DATA {' +
    '?sensorURI rdf:type        s:sensor. ' +
    '?sensorURI rdfs:comment    ?desc. ' +
    '?sensorURI s:manufacturer  ?manu.' +
    '?sensorURI s:dataSheet     ?datasheet.' +
    '?sensorURI s:priceInEuro   ?price.' +
    '?sensorURI s:lifePeriod    ?life.' +
    '?sensorURI s:image         ?image.' +
    '?sensorURI s:isValid       ?validation.';

  sensor.label.forEach(element => {
    bindingsText = bindingsText.concat(
      '?sensorURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
    );
  });

  sensor.device.forEach(element => {
    bindingsText = bindingsText.concat(
      '?sensorURI s:isSensorOf s:' + element.deviceUri.slice(34) + '. '
    );
  });

  sensor.sensorElement.forEach(element => {
    var string = '?sensorURI s:hasElement s:' + element.uri + '. ' +
      's:' + element.uri + ' s:canMeasure s:' + element.phenomenonUri.slice(34) + '. ' +
      's:' + element.uri + ' s:hasAccuracyUnit <' + element.unitOfAccuracy + '>. ' +
      's:' + element.uri + ' s:accuracyValue ' + JSON.stringify(element.accuracyValue) + '.';
    bindingsText = bindingsText.concat(string)
  });

  bindingsText = bindingsText.concat('}')
  // TODO: Add dynamic description language tag!
  // LOG and EXECTUE UPDATE 
  //console.log(bindingsText)
  return client
    .query(bindingsText)
    .bind({
      sensorURI: { value: senphurl + sensor.uri, type: 'uri' },
      desc: { value: sensor.description, lang: "en" },
      manu: sensor.manufacturer,
      datasheet: { value: sensor.datasheet, type: 'uri' },
      price: { value: sensor.price, type: 'decimal' },
      life: { value: sensor.lifeperiod, type: 'integer' },
      image: { value: sensor.image, type: 'string' },
      validation: { value: sensor.validation, type: 'boolean' }
    })
    .execute();
}


// //get a single device identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
// module.exports.editPhenomenon = function (phenomenon) {
//   var senphurl = 'http://www.opensensemap.org/SENPH#';
//   console.log(phenomenon);

//   // create SPARQL Query: 
//   var bindingsText = 'DELETE {?a ?b ?c}' +
//     'INSERT {' +
//     '?sensorURI rdf:type     s:sensor.' +
//     '?sensorURI rdfs:comment ?desc.';
//   // create insert ;line for each unit 
//   phenomenon.label.forEach(element => {
//     console.log(element);
//     var string = '?phenomenonURI rdfs:label ' + '"' + element.value + '"' + '@' + element.lang + '. ';
//     bindingsText = bindingsText.concat(string)
//   });
//   // create insert ;line for each unit 
//   phenomenon.unit.forEach(element => {
//     console.log(element);
//     var string = '?phenomenonURI s:describedBy ' + '<' + element.unitUri + '>' + '.' +
//       '<' + element.unitUri + '> rdfs:label "' + element.unitLabel + '".';

//     bindingsText = bindingsText.concat(string)
//   });
//   // create insert ;line for each domain 
//   phenomenon.domain.forEach(element => {
//     console.log(element);
//     var string = '?phenomenonURI s:hasDomain s:' + element.domainUri.slice(34) + '. ';
//     bindingsText = bindingsText.concat(string)
//   });
//   // add WHERE statement 
//   bindingsText = bindingsText.concat('} WHERE {?a ?b ?c. FILTER (?a = ?phenomenonURI && ?b = s:hasDomain || ?a = ?phenomenonURI && ?b = s:describedBy || ?a = ?phenomenonURI && ?b = rdfs:comment || ?a = ?phenomenonURI && ?b = rdfs:label || ?a = ?phenomenonURI && ?b = rdf:type || ?c = ?phenomenonURI && ?b = s:isDomainOf || ?c = ?phenomenonURI && ?b = s:isDescribedBy)}');
//   console.log(bindingsText);

//   return client
//     .query(bindingsText)
//     // bind values to variable names
//     .bind({
//       phenomenonURI: { value: senphurl + phenomenon.uri, type: 'uri' },
//       // +++ FIXME +++ language hardcoded, make it dynamic
//       // phenomenonLabel:      {value: phenomenon.name, lang: "en"},
//       // +++ FIXME +++ language hardcoded, make it dynamic
//       desc: { value: phenomenon.description, lang: "en" },
//     })
//     .execute()
//     .then(Promise.resolve(console.log("evertyhing ok")))
//     .catch(function (error) {
//       console.log(error);
//     });
// }



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
      console.log(error);
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
      console.log(error);
    });
}

module.exports.convertSensorToJson = function(sensor){
  return new Sensor(sensor);
}
module.exports.convertSensorsToJson = function (sensors){
  console.log(sensors)
  return sensors.map(sensor => new Sensors(sensor));
}

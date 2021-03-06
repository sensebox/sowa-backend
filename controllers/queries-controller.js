const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;
const config = require('config');

const fuseki_endpoint = config.get('fuseki_endpoint');
const endpoint = `${fuseki_endpoint}/senph/sparql`;
const updatepoint = `${fuseki_endpoint}/senph/update`;
const unitpoint = 'http://sparql.hegroup.org/sparql/'; 
const localUnitpoint = `${fuseki_endpoint}/ui/sparql`;




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

  const unitClient = new SparqlClient(unitpoint)
  .register({
    owl: 'http://www.w3.org/2002/07/owl#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    s: 'http://www.opensensemap.org/SENPH#',
    uo: 'http://purl.obolibrary.org/obo/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    xsd: 'http://www.w3.org/2001/XMLSchema#'


  })

  const localUnitClient = new SparqlClient(localUnitpoint)
  .register({
    owl: 'http://www.w3.org/2002/07/owl#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    s: 'http://www.opensensemap.org/SENPH#',
    uo: 'http://purl.obolibrary.org/obo/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    xsd: 'http://www.w3.org/2001/XMLSchema#'
  })


/* ---------- All Phenomenon funtions: -----------------*/

//get all phenomena @returns iris and labels
module.exports.getPhenomena = function () {
  return client
    .query(SPARQL`
                     SELECT ?label ?phenomenon
                     WHERE {
                       ?phenomenon rdf:type s:phenomenon.
                       OPTIONAL {?phenomenon rdfs:label ?label.}
                     }`)
    .execute({ format: { resource: 'phenomenon' } })
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}

//get a single phenomenon identified by its iri @returns the phenomenon's labels, descriptions, units it is described by, domains, sensors it can be measured by  
module.exports.getPhenomenonDEPRECATED = function (iri) {
  // //still missing: ?domains rdfs:label ?domainsLabel.
  // return client
  // .query(SPARQL`
  // Select Distinct ?iri ?irid ?label ?description ?sensors ?sensorsLabel ?domains ?domainsLabel ?units 
  //                  WHERE {   
  // 					{	
  //                         ${{s: iri}}  rdfs:label ?label.
  //                       ?iri ?rdf ?label
  //                     }
  //                     UNION 
  //                     {   
  //                         ${{s: iri}} rdfs:comment ?description.
  //                         ?irid ?rdf ?description
  //                     }
  //                     UNION
  //                     {	
  //                         ${{s: iri}} s:describedBy ?units.
  //                     }
  //                     UNION
  //                     {
  //                         ${{s: iri}} s:hasDomain ?domains.
  //                       ?domains rdfs:label ?domainsLabel.
  //                     } 
  //                     UNION
  //                     {
  //                         ${{s: iri}} s:measurableBy ?selement.
  //                       ?selement   s:isElementOf ?sensors.
  //                       ?sensors rdfs:label ?sensorsLabel.}            
  //                  }
  //             Group BY ?sensors  ?domains ?units ?iri  ?label ?irid ?description  ?sensorsLabel ?domainsLabel
  //             ORDER BY ?sensors ?iri ?irid ?domain ?units
  //       `)
  // .execute()
  // .then(res => res.results.bindings)
  // .catch(function (error) {
  //     console.log("Oh no, error!")
  //   });
}


//get a single phenomenon identified by its iri @returns the phenomenon's labels, descriptions, units it is described by, domains, sensors it can be measured by  
module.exports.getPhenomenon = function (iri) {
  //still missing: ?domains rdfs:label ?domainsLabel.
  return client
    .query(SPARQL`
  Select Distinct ?iri ?label ?description ?sensors ?domain ?unit ?sensorlabel ?unitLabel ?domainLabel
                   WHERE {   
                      {	
                          ${{ s: iri }}  rdfs:label ?name.
                          ?iri ?rdf ?name
                      }
                      UNION 
                      {   
                          ${{ s: iri }} rdfs:label ?label
                      }
                      UNION 
                      {   
                          ${{ s: iri }} rdfs:comment ?description.
                      }
                      UNION
                      {	
                          ${{ s: iri }} s:describedBy ?unit.
                        OPTIONAL
                          {?unit rdfs:label ?unitLabel.} 
                      }
                      UNION
                      {
                          ${{ s: iri }} s:hasDomain ?domain.
                        OPTIONAL
                          {?domain rdfs:label ?domainLabel.}
                      } 
                      UNION
                      {
                          ${{ s: iri }} s:measurableBy ?selement.
                        ?selement   s:isElementOf ?sensors.
                        OPTIONAL {
                          ?sensors rdfs:label ?sensorlabel.    
                        }
                      }            
                   }
              Group BY ?sensors  ?domain ?unit ?iri  ?label ?description ?sensorlabel ?domainLabel ?unitLabel
              ORDER BY ?sensors ?iri ?domain ?unit
        `)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log(error)
    });
}


//update/add a new phenomenon @inputs required: label +language, description + language, unit; optional: domain 
module.exports.updatePhenomenon = function (phenomenon) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  var bindingsText = 'INSERT DATA {' +
    '?phenoname rdf:type      s:phenomenon. ' +
    '?phenoname rdfs:label    ?phenolabel. ' +
    '?phenoname rdfs:comment  ?desc. ' +
    '?phenoname s:describedBy ?unit.' +
    (phenomenon.domain ? '?phenoname s:hasDomain ?domain.' : '') +
    '}';
  return client
    .query(bindingsText)
    .bind({
      phenoname: { value: senphurl + phenomenon.uri, type: 'uri' },
      phenolabel: { value: phenomenon.name.label, lang: phenomenon.name.lang },
      desc: { value: phenomenon.description.comment, lang: phenomenon.description.lang },
      unit: { value: phenomenon.unit, type: 'string' },
      domain: { value: phenomenon.domain, type: 'string' },
    })
    .execute()
    .then(Promise.resolve(console.log("everthing ok")))
    .catch(function (error) {
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
    '?phenomenonURI rdf:type     s:phenomenon.' +
    '?phenomenonURI rdfs:comment ?desc.';
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



/* ---------- All domain funtions: -----------------*/

//get all domains @returns iris and labels
module.exports.getDomains = function () {
  return client
    .query(SPARQL`
                    SELECT ?label ?domain
                    WHERE {
                      ?domain rdf:type s:domain.
                    OPTIONAL{
                      ?domain rdfs:label ?label.}
                      }`)
    .execute({ format: { resource: 'domain' } })
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
      console.log(error);
    });
}


//get a single domain identified by its iri @returns the domain's labels, descriptions and phenomena it is domain of
module.exports.getDomain = function (iri) {
  return client
    .query(SPARQL`
    Select Distinct ?iri ?label ?description ?phenomena ?phenomenaLabel 
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
                            ${{ s: iri }} s:isDomainOf ?phenomena.
                          ?phenomena  rdfs:label ?phenomenaLabel
                        }  

                     }
                Group BY ?iri ?label ?description ?phenomena ?phenomenaLabel 
                ORDER BY ?iri ?phenomena
          `)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}


//update/add a new domain @inputs required: label +language, description + language; optional: manufacturer, data sheet, price in Euro, life period (currently not available because of datatype issue) and image 
module.exports.updateDomain = function (domain) {
  console.log(domain);
  // `+ (domain.phenomenon ?`${{s: domain.name.label}} s:isDomainOf ${{s: domain.phenomenon}}.`:``) + `
  return client
    .query(SPARQL`INSERT DATA {
        ${{ s: domain.uri }} rdf:type s:domain;
                    rdfs:label  ${{ value: domain.name.label, lang: domain.name.lang }};
                    rdfs:comment  ${{ value: domain.description.comment, lang: domain.description.lang }}.
            }`)
    .execute()
    .then(Promise.resolve(console.log("everthing ok")))
    .catch(function (error) {
      console.log(error);
    });
}




/* ---------- All device funtions: -----------------*/

//get all devices @returns iris and labels
module.exports.getDevices = function () {
  return client
    .query(SPARQL`
                     SELECT ?label ?device
                     WHERE {
                       ?device rdf:type s:device.
                       OPTIONAL{
                       ?device rdfs:label ?label}
                    }`)
    .execute({ format: { resource: 'device' } })
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}

//get a single device identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
module.exports.getDevice = function (iri) {
  return client
    .query(SPARQL`
    Select Distinct ?iri ?label ?description ?website ?image ?contact ?sensors ?sensorsLabel 
                     WHERE {   
  						{	
                            ${{ s: iri }}  rdfs:label ?name.
                          ?iri ?rdf ?name
                        }
                        UNION 
                        {   
                            ${{ s: iri }} rdfs:label ?label
                        }
                        UNION 
                        {   
                            ${{ s: iri }} rdfs:comment ?description
                        }
                        UNION
                        {
                            ${{ s: iri }} s:website ?website.
                        }  
                        UNION
                        {
                            ${{ s: iri }} s:image ?image.
                        } 
                        UNION
                        {
                            ${{ s: iri }} s:hasContact ?contact.
                        }   
                        UNION
                        {
                            ${{ s: iri }} s:hasSensor ?sensors.
                            ?sensors rdfs:label ?sensorsLabel.
                        }   
                     }
                Group BY ?iri ?label ?description ?website ?image ?contact ?sensors ?sensorsLabel 
                ORDER BY ?iri ?sensors
          `)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}


//update/add a new device @inputs required: label + language, description + language; optional: website, image, contact, compatible sensor
module.exports.updateDevice = function (device) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  console.log(device);
  var bindingsText = 'INSERT DATA {' +
    '?deviceURI rdf:type     s:device.' +
    '?deviceURI rdfs:label   ?deviceLabel. ' +
    '?deviceURI rdfs:comment ?desc.' +
    (device.website ? '?deviceURI s:website ?website.' : '') +
    (device.image ? '?deviceURI s:image ?image.' : '') +
    (device.contact ? '?deviceURI s:hasContact ?contact.' : '') +
    (device.sensor ? '?deviceURI s:hasSensor ?sensor.' : '') +
    '}';
  return client
    .query(bindingsText)
    .bind({
      deviceURI: { value: senphurl + device.uri, type: 'uri' },
      deviceLabel: { value: device.name.label, lang: device.name.lang },
      desc: { value: device.description.comment, lang: device.description.lang },
      website: { value: device.website, type: 'string' },
      image: { value: device.image, type: 'string' },
      contact: { value: device.contact, type: 'string' },
      sensor: { value: senphurl + device.sensor, type: 'uri' }
    })
    .execute()
    .then(Promise.resolve(console.log("everthing ok")))
    .catch(function (error) {
      console.log(error);
    });
}


//get a single device identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
module.exports.editDevice = function (device) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  console.log(device);

  // create SPARQL Query: 
  var bindingsText = 'DELETE {?a ?b ?c}' +
    'INSERT {' +
    '?deviceURI rdf:type     s:device.' +
    '?deviceURI rdfs:label   ?deviceLabel. ' +
    '?deviceURI rdfs:comment ?desc.' +
    (device.website ? '?deviceURI s:website ?website.' : '') +
    (device.image ? '?deviceURI s:image ?image.' : '') +
    (device.contact ? '?deviceURI s:hasContact ?contact.' : '');
  // create insert ;line for each sensor 
  device.sensor.forEach(element => {
    var string = '?deviceURI s:hasSensor s:' + element.sensorUri.slice(34) + '. ';
    bindingsText = bindingsText.concat(string)
  });
  // add WHERE statement 
  bindingsText = bindingsText.concat('} WHERE {?a ?b ?c. FILTER (?a = ?deviceURI || ?c = ?deviceURI)}');
  console.log(bindingsText);

  return client
    .query(bindingsText)
    // bind values to variable names
    .bind({
      deviceURI: { value: senphurl + device.uri, type: 'uri' },
      // +++ FIXME +++ language hardcoded, make it dynamic
      deviceLabel: { value: device.name, lang: "en" },
      // +++ FIXME +++ language hardcoded, make it dynamic
      desc: { value: device.description, lang: "en" },
      website: { value: device.website, type: 'string' },
      image: { value: device.image, type: 'string' },
      contact: { value: device.contact, type: 'string' },
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


/**--------------Get all sensors that are part of a given device --------------- */
module.exports.getSensorsForDevice = function (iri) {
  return client
    .query(SPARQL`
                     SELECT ?label ?sensors
                     WHERE {
                       ${{ s: iri }} s:hasSensor ?sensors;
                       ?sensors rdfs:label ?label 
                     }`)
    .execute({ format: { resource: 'sensors' } })
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}


/**--------------Get all phenomena that are part of a given domain --------------- */
module.exports.getPhenomenaForDomain = function (iri) {
  return client
    .query(SPARQL`
                     SELECT ?label ?phenomena
                     WHERE {
                       ${{ s: iri }} s:isDomainOf ?phenomena;
                       ?phenomena rdfs:label ?label 
                     }`)
    .execute({ format: { resource: 'phenomena' } })
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}


/**--------------Get all units that describe a given phenomenon --------------- */
module.exports.getUnitsForPhenomenon = function (iri) {
  return client
    .query(SPARQL`
                     SELECT ?label ?unit
                     WHERE {
                       ${{ s: iri }} s:describedBy ?unit;
                     }`)
    .execute({ format: { resource: 'unit' } })
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}

module.exports.getUnits = function (iri) {
  return unitClient
    .query(SPARQL`
    SELECT DISTINCT ?y ?label
    WHERE
    {
    ?y <http://www.geneontology.org/formats/oboInOwl#inSubset>  <http://purl.obolibrary.org/obo/uo#unit_slim>.
    ?y rdfs:label ?label
    }`)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.dir(arguments, { depth: null })
      console.log("Oh no, error!")
      console.log(error)
    });
}

module.exports.getUnitLabel = function (iri) {
  console.log(iri)
  return unitClient
    .query(SPARQL`
    SELECT DISTINCT ?label
    from <http://purl.obolibrary.org/obo/merged/UO>
    WHERE
      { 
        ${{ uo: iri }} <http://www.geneontology.org/formats/oboInOwl#inSubset>  <http://purl.obolibrary.org/obo/uo#unit_slim>.
        ${{ uo: iri }} rdfs:label ?label
    }`)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log(error.httpStatus);
      console.log(error);
    });
}

//get all sensors @returns iris and labels
module.exports.getAll = function () {
  return client
    .query(SPARQL`
                     SELECT ?label ?entity ?type ?validation
                     WHERE {
                      ?entity rdf:type ?type.
                      ?entity rdfs:label ?label.
                      ?entity s:isValid ?validation 
                      FILTER (?type IN (s:sensor, s:phenomenon, s:domain, s:device ))
                     }`)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
      console.log(error)
    });
}



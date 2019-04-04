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
    .register({   owl: 'http://www.w3.org/2002/07/owl#',
                rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
                s: 'http://www.opensensemap.org/SENPH#',
                uo: 'http://purl.obolibrary.org/obo/',
                rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'

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
    .execute({format: {resource: 'phenomenon'}})
    .then(res => res.results.bindings)
    .catch(function (error) {
        console.log("Oh no, error!")
      });
}

//get a single phenomenon identified by its iri @returns the phenomenon's labels, descriptions, units it is described by, domains, sensors it can be measured by  
module.exports.getPhenomenon = function (iri) {
    //still missing: ?domains rdfs:label ?domainsLabel.
    return client
    .query(SPARQL`
    Select Distinct ?iri ?irid ?label ?description ?sensors ?sensorsLabel ?domains ?domainsLabel ?units 
                     WHERE {   
  						{	
                            ${{s: iri}}  rdfs:label ?label.
                          ?iri ?rdf ?label
                        }
                        UNION 
                        {   
                            ${{s: iri}} rdfs:comment ?description.
                            ?irid ?rdf ?description
                        }
                        UNION
                        {	
                            ${{s: iri}} s:describedBy ?units.
                        }
                        UNION
                        {
                            ${{s: iri}} s:hasDomain ?domains.
                          ?domains rdfs:label ?domainsLabel.
                        } 
                        UNION
                        {
                            ${{s: iri}} s:measurableBy ?selement.
                          ?selement   s:isElementOf ?sensors.
                          ?sensors rdfs:label ?sensorsLabel.}            
                     }
                Group BY ?sensors  ?domains ?units ?iri  ?label ?irid ?description  ?sensorsLabel ?domainsLabel
                ORDER BY ?sensors ?iri ?irid ?domain ?units
          `)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
        console.log("Oh no, error!")
      });
}

//update/add a new phenomenon @inputs required: label +language, description + language, unit; optional: domain 
module.exports.updatePhenomenon = function (phenomenon) {
    console.log(phenomenon);
    return client
    .query(SPARQL`INSERT DATA {
        ${{s: phenomenon.name.label}} rdf:type s:phenomenon;
                    rdfs:label  ${{value: phenomenon.name.label, lang: phenomenon.name.lang}};
                    rdfs:comment  ${{value: phenomenon.description.comment, lang: phenomenon.description.lang}};
                    s:describedBy ${{uo: phenomenon.unit}}.
                    `+ (phenomenon.domain ?`${{s: phenomenon.name.label}} s:hasDomain ${{s: domain}}.`:``) + `
            }`)
    .execute()
    .then(Promise.resolve(console.log("everthing ok")))
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
                       ?sensor rdfs:label ?label 
                     }`)
    .execute({format: {resource: 'sensor'}})
    .then(res => res.results.bindings)
    .catch(function (error) {
        console.log("Oh no, error!")
      });
}


//get a single sensor identified by its iri @returns the sensor's labels, descriptions, datasheet, image, lifeperiod, manufacturer, price, phenomena it can measueres and accuracy values, devices it is part of
module.exports.getSensor = function (iri) {
    return client
    .query(SPARQL`
    Select Distinct ?iri ?irid ?label ?description ?datasheet ?image ?lifeperiod ?manufacturer ?price ?phenomena ?phenomenaLabel ?unit ?device ?devicesLabel
                     WHERE {   
  						{	
                            ${{s: iri}}  rdfs:label ?label.
                          ?iri ?rdf ?label
                        }
                        UNION 
                        {   
                            ${{s: iri}} rdfs:comment ?description.
                            ?irid ?rdf ?description
                        }
                        UNION
                        {	
                            ${{s: iri}} s:dataSheet ?datasheet.
                        }
                        UNION
                        {
                            ${{s: iri}} s:image ?image.
                        } 
                        UNION
                        {
                            ${{s: iri}} s:lifePeriod ?lifeperiod.
                        } 
                        UNION
                        {
                            ${{s: iri}} s:manufacturer ?manufacturer.
                        }
                        UNION
                        {
                            ${{s: iri}} s:priceInEuro ?price.
                        }
                        UNION
                        {
                            ${{s: iri}} s:hasElement ?selement.
                          ?selement   s:canMeasure ?phenomena.
                          ?phenomena rdfs:label ?phenomenaLabel.
                          ?selement s:hasAccuracyUnit ?unit
                        }
                        UNION
                        {
                            ${{s: iri}} s:isSensorOf ?devices.
                          ?devices  rdfs:label ?devicesLabel
                        }  

                     }
                Group BY ?iri ?irid ?label ?description ?datasheet ?image ?lifeperiod ?manufacturer ?price ?phenomena ?phenomenaLabel ?unit ?device ?devicesLabel
                ORDER BY ?iri ?irid ?phenomena ?device
          `)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
        console.log("Oh no, error!")
      });
}

//update/add a new sensor @inputs required: label +language, description + language, a phenomenon that is meaured with according accuracy value; optional: manufacturer, data sheet, price in Euro, life period (currently not available because of datatype issue) and an image  
module.exports.updateSensor = function (sensor) {
    console.log(sensor);
    return client
    .query(SPARQL`INSERT DATA {
        ${{s: sensor.name.label}} rdf:type s:sensor;
                    rdfs:label  ${{value: sensor.name.label, lang: sensor.name.lang}};
                    rdfs:comment  ${{value: sensor.description.comment, lang: sensor.description.lang}}.
        `+ (sensor.manufacturer ?`${{s: sensor.name.label}} s:manufacturer ${{value: sensor.manufacturer, type: 'string'}}.`:``) + `
        `+ (sensor.dataSheet ?`${{s: sensor.name.label}} s:dataSheet ${{value: sensor.datasheet, type: 'string'}}.`:``) + `
        `+ (sensor.priceInEuro ?`${{s: sensor.name.label}} s:priceInEuro ${{value: sensor.price, type: 'float'}}.`:``) + `
        `/*+ (sensor.lifePeriod ?`${{s: sensor.name.label}} s:lifePeriod ${{value: sensor.lifePeriod, type: 'string'}}.`:``)*/ + `
        `+ (sensor.image ?`${{s: sensor.name.label}} s:image ${{value: sensor.image, type: 'string'}}.`:``) + `
        `+ (sensor.device ?`${{s: sensor.name.label}} s:isSensorOf ${{s: sensor.device}}.`:``) + `
        ${{s: sensor.name.label}} s:hasElement ${{s: sensor.phenomenon.iri+"_"+sensor.name.label}}.
        ${{s: sensor.phenomenon.iri+"_"+sensor.name.label}} s:canMeasure ${{s: sensor.phenomenon.iri}}.
        ${{s: sensor.phenomenon.iri+"_"+sensor.name.label}} s:hasAccuracyValue ${{value: sensor.phenomenon.value, type: 'float'}}.
            }`)
    .execute()
    .then(Promise.resolve(console.log("everthing ok")))
    .catch(function (error) {
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
                       ?domain rdfs:label ?label} 
                     }`)
    .execute({format: {resource: 'domain'}})
    .then(res => res.results.bindings)
    .catch(function (error) {
        console.log("Oh no, error!")
      });
}


//get a single domain identified by its iri @returns the domain's labels, descriptions and phenomena it is domain of
module.exports.getDomain = function (iri) {
    return client
    .query(SPARQL`
    Select Distinct ?iri ?irid ?label ?description ?phenomena ?phenomenaLabel 
                     WHERE {   
  						{	
                            ${{s: iri}}  rdfs:label ?label.
                          ?iri ?rdf ?label
                        }
                        UNION 
                        {   
                            ${{s: iri}} rdfs:comment ?description.
                            ?irid ?rdf ?description
                        }
                        UNION
                        {
                            ${{s: iri}} s:isDomainOf ?phenomena.
                          ?phenomena  rdfs:label ?phenomenaLabel
                        }  

                     }
                Group BY ?iri ?irid ?label ?description ?phenomena ?phenomenaLabel 
                ORDER BY ?iri ?irid ?phenomena
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
    return client
    .query(SPARQL`INSERT DATA {
        ${{s: domain.name.label}} rdf:type s:domain;
                    rdfs:label  ${{value: domain.name.label, lang: domain.name.lang}};
                    rdfs:comment  ${{value: domain.description.comment, lang: domain.description.lang}}.
        `+ (domain.phenomenon ?`${{s: domain.name.label}} s:isDomainOf ${{s: domain.phenomenon}}.`:``) + `
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
    .execute({format: {resource: 'device'}})
    .then(res => res.results.bindings)
    .catch(function (error) {
        console.log("Oh no, error!")
      });
}

//get a single device identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
module.exports.getDevice = function (iri) {
    return client
    .query(SPARQL`
    Select Distinct ?iri ?irid ?label ?description ?website ?image ?contact ?sensors ?sensorsLabel 
                     WHERE {   
  						{	
                            ${{s: iri}}  rdfs:label ?label.
                          ?iri ?rdf ?label
                        }
                        UNION 
                        {   
                            ${{s: iri}} rdfs:comment ?description.
                            ?irid ?rdf ?description
                        }
                        UNION
                        {
                            ${{s: iri}} s:website ?website.
                        }  
                        UNION
                        {
                            ${{s: iri}} s:image ?image.
                        } 
                        UNION
                        {
                            ${{s: iri}} s:hasContact ?contact.
                        }   
                        UNION
                        {
                            ${{s: iri}} s:hasSensor ?sensors.
                            ?sensors rdfs:label ?sensorsLabel.
                        }   
                     }
                Group BY ?iri ?irid ?label ?description ?website ?image ?contact ?sensors ?sensorsLabel 
                ORDER BY ?iri ?irid ?sensors
          `)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
        console.log("Oh no, error!")
      });
}


//update/add a new device @inputs required: label + language, description + language; optional: website, image, contact, compatible sensor
module.exports.updateDevice = function (device) {
    console.log(device);
    return client
    .query(SPARQL`INSERT DATA {
        ${{s: device.name.label}} rdf:type s:device;
                    rdfs:label  ${{value: device.name.label, lang: device.name.lang}};
                    rdfs:comment  ${{value: device.description.comment, lang: device.description.lang}}.
        `+ (device.website ?`${{s: device.name.label}} s:website ${{value: device.website, type:'string'}}.`:``) + `
        `+ (device.image ?`${{s: device.name.label}} s:image ${{value: device.image, type:'string'}}.`:``) + `
        `+ (device.contact ?`${{s: device.name.label}} s:contact ${{value: device.contact, type:'string'}}.`:``) + `
        `+ (device.sensor ?`${{s: device.name.label}} s:hasSensor ${{s: device.sensor}}.`:``) + `
            }`)
    .execute()
    .then(Promise.resolve(console.log("everthing ok")))
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
                       ${{s: iri}} s:hasElement ?sensorElement;
                       ?sensorElement s:canMeasure ?phenomenon
                       ?phenomenon rdfs:label ?label 
                     }`)
    .execute({format: {resource: 'phenomenon'}})
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
                       ${{s: iri}} s:measurableBy ?sensorElement;
                       ?sensorElement s:isElementOf ?sensors
                       ?sensors rdfs:label ?label 
                     }`)
    .execute({format: {resource: 'sensors'}})
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
                       ${{s: iri}} s:hasSensor ?sensors;
                       ?sensors rdfs:label ?label 
                     }`)
    .execute({format: {resource: 'sensors'}})
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
                       ${{s: iri}} s:isDomainOf ?phenomena;
                       ?phenomena rdfs:label ?label 
                     }`)
    .execute({format: {resource: 'phenomena'}})
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
                       ${{s: iri}} s:describedBy ?unit;
                     }`)
    .execute({format: {resource: 'unit'}})
    .then(res => res.results.bindings)
    .catch(function (error) {
        console.log("Oh no, error!")
      });
}
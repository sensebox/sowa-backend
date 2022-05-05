const config = require('config');

const Sensor = require('../models/Sensor');
const Sensors = require('../models/Sensors');

const prisma = require('../lib/prisma');

/* ---------- All sensor funtions: -----------------*/

//get all sensors @returns iris and labels
module.exports.getSensors = async function (lang) {
  let languageFilter = true;
  if (lang) {
    languageFilter = {
      where: {
        languageCode: lang,
      },
    };
  }

  const result = await prisma.sensor.findMany({
    select: {
      // markdown: true,
      id: true,
      label: {
        select: {
          item: languageFilter,
        },
      },
      description: {
        select: {
          item: languageFilter,
        },
      },
      price: true,
      lifePeriod: true,
      manufacturer: true,
      validation: true,
    },
  });

  return result;
}


//get history of a sensors
module.exports.getSensorHistory = function (iri) {
  var senphurl = 'http://sensors.wiki/SENPH#';
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
  iri = iri.slice(senphurl.length);
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
module.exports.getSensor = async function (iri, lang) {
  let languageFilter = true;
  if (lang) {
    languageFilter = {
      where: {
        languageCode: lang,
      },
    };
  }

  const result = await prisma.sensor.findUnique({
    where: {
      id: parseInt(iri)
    },
    select: {
      id: true,
      label: {
        select: {
          item: languageFilter,
        },
      },
      description: {
        select: {
          item: languageFilter,
        },
      },
      elements: {
        select: {
          id: true,
          accuracy: true,
          accuracyUnit: true,
          phenomena: {
            select: {
              id: true,
              label: {
                select: {
                  item: languageFilter,
                },
              }
            }
          },
        }
      },
      devices: {
        select: {
          id: true,
          label: {
            select: {
              item: languageFilter
            }
          },
          validation: true,
        }
      },
      price: true,
      image: true,
      manufacturer: true,
      lifePeriod: true,
      datasheet: true,
      validation: true,
    },
  });

  return result;
}


//get a single historic sensor entry identified by its iri @returns the sensor's labels, descriptions, datasheet, image, lifeperiod, manufacturer, price, phenomena it can measueres and accuracy values, devices it is part of
module.exports.getHistoricSensor = function (iri) {
  var senphurl = 'http://sensors.wiki/SENPH#';

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
//   var senphurl = 'http://sensors.wiki/SENPH#';
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


module.exports.editSensor = async function (sensorForm, role) {

  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    sensorForm.validation = false;
  }

  console.log(sensorForm)

  /////////// Current sensor ////////////
  // retrive current phenomeonon with current attributes from database 
  const sensor = await prisma.sensor.findUnique({
    where: {
      id: sensorForm.id,
    }
  })

  
  //////////// Labels ////////////
  // delete, update or create labels
  sensorForm.deletedLabels.forEach( async (label) => {
    console.log(label.translationId)
    console.log(label.lang)
    const deleteLabel = await prisma.translationItem.deleteMany({
      where: {
        translationId: label.translationId,
        languageCode: label.lang,
      }
    })
  })


  sensorForm.label.forEach( async (label) => {
    if (label.translationId !== null) {
      const updateLabel = await prisma.translationItem.updateMany({
        where: {
          translationId: label.translationId,
          languageCode: label.lang
        },
        data:  {
          text: label.value
        }
      })
    } else if (label.translationId === null) {
      const createLabel = await prisma.translationItem.create({
        data: {
          translationId: sensor.labelId,
          text: label.value,
          languageCode: label.lang
        }
      })
    }
  })


  /////////// Description //////////////
  // update description text; if the whole text is deleted, description is set to an empty string
  const updateDescription = await prisma.translationItem.updateMany({
    where: {
      translationId: sensorForm.description.translationId,
      languageCode: "en",
      // langageCode hardcoded, needs to be changed in schema that description is no longer a multi-language option
    },
    data: {
      text:  sensorForm.description.text,
    }
  })


  /////////// Sensor //////////////
  // update sensor values: image, manufacturer, price, lifeperiod, datasheet, validation
  const updateSensor = await prisma.sensor.update({
    where: {
      id: sensorForm.id,
    },
    data: {
      image: sensorForm.image,
      manufacturer: sensorForm.manufacturer,
      price: sensorForm.price,
      lifePeriod: sensorForm.lifeperiod,
      datasheet: sensorForm.datasheet,
      validation: sensorForm.validation,
    }
  })


  /////////// Devices //////////////
  // delete, update or create devices for editing
  sensorForm.deletedDevices.forEach( async (device) => {
    console.log(device.device)
    console.log(device.exists)
    if (device.exists === true) {
      const disconnectDevice = await prisma.sensor.update({
        where: {
          id: sensorForm.id
        },
        data: {
          devices: {
            disconnect: {
              id: device.device
            }
          }
        }
      })
    } 
  })

  sensorForm.device.forEach( async (device) => {
    if (device.exists === false) {
      const connectDevice = await prisma.sensor.update({
        where: {
          id: sensorForm.id
        },
        data: {
          devices: {
            connect: {
              id: device.device
            }
          }
        }
      })
    }
  })



  ////////// Phenomena/ SensorElements //////////////
  // delete, update or create sensorElements/phenomena for editing
  sensorForm.deletedSensorElements.forEach( async (sensorElement) => {
    console.log(sensorElement)
    const deleteSensorElement = await prisma.element.delete({
      where: {
        id: sensorElement.sensorElementId
      }
    })
  })

  sensorForm.sensorElement.forEach( async (sensorElement) => {
    console.log(sensorElement)
    if (sensorElement.sensorElementId !== null) {
      const updateSensorElement = await prisma.element.update({
        where: {
          id: sensorElement.sensorElementId
        },
        data: {
          accuracy: sensorElement.accuracyValue,
          unitId: sensorElement.unitId,
          phenomenonId: sensorElement.phenomenonId,
        }
      })
    }
    else if (sensorElement.sensorElementId === null) {
      const createSensorElement = await prisma.element.create({
        data: {
          accuracy: sensorElement.accuracyValue,
          unitId: sensorElement.unitId,
          sensorId: sensorForm.id,
          phenomenonId: sensorElement.phenomenonId
        }
      })
    }
  })
}

module.exports.deleteSensor = async function (sensorForm, role) {

  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    sensorForm.validation = false;
  }
  
  console.log(sensorForm)

  const deleteElements = await prisma.element.deleteMany({
    where: {
      sensorId: sensorForm.id,
    },
  });

  sensorForm.device.forEach( async (device) => {
    const disconnectDevices = await prisma.sensor.update({
      where: {
        id: sensorForm.id
      },
      data: {
        devices: {
          disconnect: {
            id: device.device
          }
        }
      }
    })
  })
  
  const deletetranslationItems = await prisma.translationItem.deleteMany({
    where: {
      translationId: {
        in: sensorForm.translationIds,
      }
    }
  })

  const deletetranslations = await prisma.translation.deleteMany({
    where: {
      id: {
        in: sensorForm.translationIds,
      }
    }
  })

  const deleteSensor = await prisma.sensor.delete({
    where: {
      id: sensorForm.id,
    }
  })
}



// module.exports.createHistorySensor = function (sensor, user) {
//   var date = Date.now();
//   var isoDate = new Date(date).toISOString();
//   sensor['dateTime'] = date;
//   //console.log(sensor);
//   // if (user.role != 'expert' && user.role != 'admin') {
//   //   console.log("User has no verification rights!");
//   //   sensor.validation = false;
//   // }
//   var senphurl = 'http://sensors.wiki/SENPH#';
//   sensor.sensorElement.forEach(element => {
//     element['uri'] = "sensorElement_" + sensor.uri + "_" + element.phenomenonUri.slice(senphurl.length) + '_' + sensor.dateTime;
//   })

//   // DELETE {...} INSERT{...}
//   var bindingsText = 'INSERT DATA {' +
//     '?sensorURI rdf:type        s:sensor. ' +
//     '?sensorURI rdfs:comment    ?desc. ' +
//     '?sensorURI s:manufacturer  ?manu.' +
//     '?sensorURI s:dataSheet     ?datasheet.' +
//     '?sensorURI s:priceInEuro   ?price.' +
//     '?sensorURI s:lifePeriod    ?life.' +
//     '?sensorURI s:image         ?image.' +
//     '?sensorURI s:isValid       ?validation.' +
//     '?sensorURI s:editDate      ?dateTime.' +
//     '?sensorURI s:editBy        ?userName.';


//   sensor.label.forEach(element => {
//     bindingsText = bindingsText.concat(
//       '?sensorURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
//     );
//   });

//   sensor.device.forEach(element => {
//     bindingsText = bindingsText.concat(
//       '?sensorURI s:isSensorOf s:' + element.deviceUri.slice(senphurl.length) + '. '
//     );
//   });

//   sensor.sensorElement.forEach(element => {
//     var string = '?sensorURI s:hasElement s:' + element.uri + '. ' +
//       's:' + element.uri + ' s:canMeasure s:' + element.phenomenonUri.slice(senphurl.length) + '. ' +
//       's:' + element.uri + ' s:hasAccuracyUnit <' + element.unitOfAccuracy + '>. ' +
//       's:' + element.uri + ' s:accuracyValue ' + JSON.stringify(element.accuracyValue) + '.';
//     bindingsText = bindingsText.concat(string)
//   });

//   bindingsText = bindingsText.concat('}')
//   // TODO: Add dynamic description language tag!
//   // LOG and EXECTUE UPDATE 
//   //console.log(bindingsText)
//   return historyClient
//     .query(bindingsText)
//     .bind({
//       sensorURI: { value: senphurl + sensor.uri + '_' + sensor.dateTime, type: 'uri' },
//       desc: { value: sensor.description, lang: "en" },
//       manu: sensor.manufacturer,
//       datasheet: { value: sensor.datasheet, type: 'uri' },
//       price: { value: sensor.price, type: 'decimal' },
//       life: { value: sensor.lifeperiod, type: 'integer' },
//       image: { value: sensor.image, type: 'string' },
//       validation: { value: sensor.validation, type: 'boolean' },
//       dateTime: { value: isoDate, type: 'http://www.w3.org/2001/XMLSchema#dateTime' },
//       //userName: user.name
//     })
//     .execute();
// }

module.exports.createNewSensor = async function (sensorForm, role) {
  
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    sensorForm.validation = false;
  }

  console.log(sensorForm)

  const labelTranslation = await prisma.translation.create({data: {}})
  let devicesIds = null;
  if(sensorForm.device) {
    devicesIds = sensorForm.device.map(device => {return {"id": device.device}});
  }

  
  const descTranslation = await prisma.translation.create({data: {}})
  if(sensorForm.description) {
    const mappedDescription = [{languageCode: 'en', text: sensorForm.description.text, translationId: descTranslation.id}];
    const descriptions = await prisma.translationItem.createMany({data: mappedDescription})
  }


  if(sensorForm.label.length > 0) {
    const mappedLabel = sensorForm.label.map(label => {return {languageCode: label.lang, text: label.value, translationId: labelTranslation.id}});
    const labels = await prisma.translationItem.createMany({data: mappedLabel})
  }



  const sensor = await prisma.sensor.create({ data: {
    label: {
      connect: {id: labelTranslation.id}
    },
    description: {
      connect: {id: descTranslation.id}
    },
    price: sensorForm.price,
    image: sensorForm.image,
    manufacturer: sensorForm.manufacturer,
    lifePeriod: sensorForm.lifePeriod,
    datasheet: sensorForm.datasheet,
    validation: sensorForm.validation,
    devices: {
      connect: devicesIds
    }
  }})

  if(sensorForm.sensorElement.length > 0) {
    const mappedElements = sensorForm.sensorElement.map(element => {return {
      phenomenonId: element.phenomenonId,
      accuracy: element.accuracyValue,
      unitId: element.unitId,
      sensorId: sensor.id
    }});
    const elements = await prisma.element.createMany({data: mappedElements})
  }

  return sensor;
  
}


// //get a single device identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
// module.exports.editPhenomenon = function (phenomenon) {
//   var senphurl = 'http://sensors.wiki/SENPH#';
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
//     var string = '?phenomenonURI s:hasDomain s:' + element.domainUri.slice(senphurl.length) + '. ';
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
  return sensors.map(sensor => new Sensors(sensor));
}

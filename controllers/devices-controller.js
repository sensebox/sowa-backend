const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;
const config = require('config');
const Device = require('../models/Device');
const Devices = require('../models/Devices');
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
    s: 'http://sensor.wiki/#',
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
    s: 'http://sensor.wiki/#',
    uo: 'http://purl.obolibrary.org/obo/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    xsd: 'http://www.w3.org/2001/XMLSchema#'

  })



/* ---------- All device funtions: -----------------*/

//get all devices @returns iris and labels
module.exports.getDevices = function () {
  return client
    .query(SPARQL`
                     SELECT ?label ?device ?image ?validation
                     WHERE {
                        ?device rdf:type s:device.
                        ?device rdfs:label ?label.
                        ?device s:image ?image.
                        OPTIONAL{
                          ?device s:isValid ?validation.
                          }
                    }`)
    .execute({ format: { resource: 'device' } })
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.dir(arguments, { depth: null })
      console.log("Oh no, error!")
      console.log(error)
    });
}

//get history of a device
module.exports.getDeviceHistory = function (iri) {
  var senphurl = 'http://sensor.wiki/#';
  var bindingsText = `
  SELECT ?device ?dateTime ?user
                    WHERE {
                      ?device rdf:type s:device.
                      OPTIONAL{
                        ?device s:editDate ?dateTime
                      }
                      OPTIONAL{
                        ?device s:editBy ?user
                      }   
                      FILTER(regex(str(?device), ?iri, "i" ))
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
      console.dir(arguments, { depth: null })
      console.log("Oh no, error!")
      console.log(error)
    });
}


//get a single device identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
module.exports.getDevice = function (iri) {
  var senphurl = 'http://sensor.wiki/#';

  return client
    .query(SPARQL`
    Select Distinct ?label ?description ?website ?image ?markdown ?contact ?sensor ?sensorLabel ?validation
                     WHERE {
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
                            ${{ s: iri }} s:hasSensor ?sensor.
                        }
                        UNION
                        {
                            ${{ s: iri }} s:isValid ?validation.
                        }
                        UNION
                        {
                            ${{ s: iri }} s:markdown ?markdown.
                        }   
                     }
                Group BY ?label ?description ?website ?image ?markdown ?contact ?sensor ?sensorLabel ?validation
                ORDER BY ?sensor
          `)
    .execute()
    .then(res => {
      res.results.bindings.push({
        'iri':
        {
          type: 'uri',
          value: senphurl + iri
        }
      })
      console.log(res.results.bindings);
      return res.results.bindings;
    })
    .catch(function (error) {
      console.dir(arguments, { depth: null })
      console.log("Oh no, error!")
      console.log(error)
    });
}



//get a single historic device version identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
module.exports.getHistoricDevice = function (iri) {
  var senphurl = 'http://sensor.wiki/#';

  return historyClient
    .query(SPARQL`
    Select Distinct ?label ?description ?website ?image ?contact ?sensor ?sensorLabel ?validation
                     WHERE {
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
                            ${{ s: iri }} s:hasSensor ?sensor.
                        }   
                        UNION
                        {
                            ${{ s: iri }} s:isValid ?validation.
                        }  
                     }
                Group BY ?label ?description ?website ?image ?contact ?sensor ?sensorLabel ?validation
                ORDER BY ?sensor
          `)
    .execute()
    .then(res => {
      console.log(res);
      res.results.bindings.push({
        'iri':
        {
          type: 'uri',
          value: senphurl + iri
        }
      })
      console.log(res.results.bindings);
      return res.results.bindings;
    })
    .catch(function (error) {
      console.dir(arguments, { depth: null })
      console.log("Oh no, error!")
      console.log(error)
    });
}


module.exports.getSensorsOfDevice = function (iri) {
  var senphurl = 'http://sensor.wiki/#';
  console.log("IRI",iri);
  return client
    .query(SPARQL`
                     SELECT ?sensor ?label ?description ?sensorElement
                     WHERE {
                        ?sensor s:isSensorOf ${{ s: iri }}.
                        ?sensor rdfs:label ?label.
                        ?sensor rdfs:comment ?description.
                        ?sensor s:hasElement ?sensorElement.
                    }`)
    .execute({ format: { resource: 'sensor' } })
    .then(async res => {
      
      let mappedRes = [];
      for (let binding of res.results.bindings) {
        let allsensorElement = [];
        if(binding.sensorElement){
          for(let sensorElement of binding.sensorElement){
            let sensorElementValue = await this.getSensorElement(sensorElement.value);
            sensorElementValue.forEach(value => {
              if (value){
                let sensorElement = {phenomenon: value.phenomenon.value, unit: value.unit.value, acc: value.accuracy ? value.accuracy.value : undefined };
                allsensorElement.push(sensorElement);
              }
            })
          }
          binding.sensorElement = allsensorElement;
        }
        mappedRes.push(binding);
        }
       return mappedRes;

      }
    )
    .catch(function (error) {
      console.dir(arguments, { depth: null })
      console.log("Oh no, error!")
      console.log(error)
    });
}


//TODO: maybe move this function to sensors
module.exports.getAllSensorsOfAllDevices = function () {
  var senphurl = 'http://sensor.wiki/#';
  return client
    .query(SPARQL`
                     SELECT ?sensor ?label ?description ?sensorElement
                     WHERE {
                        ?sensor rdf:type s:sensor.
                        ?sensor rdfs:label ?label.
                        ?sensor rdfs:comment ?description.
                        ?sensor s:hasElement ?sensorElement.
                    }`)
    .execute({ format: { resource: 'sensor' } })
    .then(async res => {
      
      let mappedRes = [];
      for (let binding of res.results.bindings) {
        let allsensorElement = [];
        if(binding.sensorElement){
          for(let sensorElement of binding.sensorElement){
            let sensorElementValue = await this.getSensorElement(sensorElement.value);
            sensorElementValue.forEach(value => {
              if (value){
                let sensorElement = {phenomenon: value.phenomenon.value, unit: value.unit.value, acc: value.accuracy ? value.accuracy.value : undefined };
                allsensorElement.push(sensorElement);
              }
            })
          }
          binding.sensorElement = allsensorElement;
        }
        mappedRes.push(binding);
        }
       return mappedRes;

      }
    )
    .catch(function (error) {
      console.dir(arguments, { depth: null })
      console.log("Oh no, error!")
      console.log(error)
    });
}


module.exports.getSensorElement = function (iri) {
  console.log(iri)
  //still missing: ?domains rdfs:label ?domainsLabel.
  // var senphurl = 'http://sensor.wiki/#';

  var bindingsText = `
  Select Distinct ?phenomenon ?unit ?accuracy
                   WHERE {   
                    ?iri s:canMeasure ?phenomenon.
                    ?iri s:hasAccuracyUnit ?unit.
                    ?iri s:accuracyValue ?accVal.
                   }
        `;
  return client
    .query(bindingsText)
    .bind({iri: {value: iri, type: 'uri'}})
    .execute()
    .then(res => {
      console.log("BINDINGS", res.results.bindings)
      return res.results.bindings;
    })
    .catch(function (error) {
      console.dir(arguments, { depth: null })
      console.log("Oh no, error!")
      console.log(error)
    });
}



// //update/add a new device @inputs required: label + language, description + language; optional: website, image, contact, compatible sensor
// module.exports.updateDevice = function (device) {
//   var senphurl = 'http://sensor.wiki/#';
//   console.log(device);
//   var bindingsText = 'INSERT DATA {' +
//     '?deviceURI rdf:type     s:device.' +
//     '?deviceURI rdfs:label   ?deviceLabel. ' +
//     '?deviceURI rdfs:comment ?desc.' +
//     (device.website ? '?deviceURI s:website ?website.' : '') +
//     (device.image ? '?deviceURI s:image ?image.' : '') +
//     (device.contact ? '?deviceURI s:hasContact ?contact.' : '') +
//     (device.sensor ? '?deviceURI s:hasSensor ?sensor.' : '') +
//     '}';
//   return client
//     .query(bindingsText)
//     .bind({
//       deviceURI: { value: senphurl + device.uri, type: 'uri' },
//       deviceLabel: { value: device.name.label, lang: device.name.lang },
//       desc: { value: device.description.comment, lang: device.description.lang },
//       website: { value: device.website, type: 'string' },
//       image: { value: device.image, type: 'string' },
//       contact: { value: device.contact, type: 'string' },
//       sensor: { value: senphurl + device.sensor, type: 'uri' }
//     })
//     .execute()
//     .then(Promise.resolve(console.log("everthing ok")))
//     .catch(function (error) {
//       console.log(error);
//     });
// }


//edit a device
module.exports.editDevice = function (device, role) {
  var senphurl = 'http://sensor.wiki/#';
  console.log(device);
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    device.validation = false;
  }
  // create SPARQL Query: 
  var bindingsText = 'DELETE {?a ?b ?c}' +
    'INSERT {' +
    '?deviceURI rdf:type     s:device.' +
    '?deviceURI rdfs:comment ?desc.' +
    '?deviceURI s:website ?website.' +
    '?deviceURI s:image ?image.' +
    '?deviceURI s:hasContact ?contact.' +
    '?deviceURI s:isValid ?validation.' +
    '?deviceURI s:markdown ?markdown.';

  // create insert ;line for each sensor 
  device.sensor.forEach(element => {
    var string = '?deviceURI s:hasSensor s:' + element.sensorUri.slice(34) + '. ';
    bindingsText = bindingsText.concat(string)
  });
  device.label.forEach(element => {
    bindingsText = bindingsText.concat(
      '?deviceURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
    );
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
      desc: { value: device.description, lang: "en" },
      website: device.website,
      image: { value: device.image, type: 'string' },
      contact: device.contact,
      validation: { value: device.validation, type: 'boolean' },
      markdown: {value: device.markdown, type: 'string'}
    })
    .execute()
}

module.exports.deleteDevice = function (device, role) {
  var senphurl = 'http://sensor.wiki/#';
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
  }
  else {
    var bindingsText =
      ` DELETE {?a ?b ?c}
    WHERE { ?a ?b ?c .
            FILTER (?a = ?deviceURI || ?c = ?deviceURI )
          }`;
    console.log(bindingsText)
    return client
      .query(bindingsText)
      .bind({
        deviceURI: { value: senphurl + device.uri, type: 'uri' },
      })
      .execute();
  }
}

//create new version of a device in history db 
module.exports.createHistoryDevice = function (device, user) {
  var date = Date.now();
  device['dateTime'] = date;
  var isoDate = new Date(date).toISOString();
  // console.log(device);
  // console.log(isoDate);
  if (user.role != 'expert' && user.role != 'admin') {
    console.log("User has no verification rights!");
    device.validation = false;
  }
  var senphurl = 'http://sensor.wiki/#';

  // create SPARQL Query: 
  var bindingsText = 'INSERT DATA {' +
    '?deviceURI rdf:type     s:device.' +
    '?deviceURI rdfs:comment ?desc.' +
    '?deviceURI s:website ?website.' +
    '?deviceURI s:image ?image.' +
    '?deviceURI s:hasContact ?contact.' +
    '?deviceURI s:isValid ?validation.' +
    '?deviceURI s:editDate ?dateTime.' +
    '?deviceURI s:editBy ?userName.';


  // create insert ;line for each sensor 
  device.sensor.forEach(element => {
    var string = '?deviceURI s:hasSensor s:' + element.sensorUri.slice(34) + '. ';
    bindingsText = bindingsText.concat(string)
  });
  device.label.forEach(element => {
    bindingsText = bindingsText.concat(
      '?deviceURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
    );
  });
  // add WHERE statement 
  bindingsText = bindingsText.concat('}');
  console.log(bindingsText);

  return historyClient
    .query(bindingsText)
    // bind values to variable names
    .bind({
      deviceURI: { value: senphurl + device.uri + '_' + device.dateTime, type: 'uri' },
      // +++ FIXME +++ language hardcoded, make it dynamic
      desc: { value: device.description, lang: "en" },
      website: device.website,
      image: device.image,
      contact: device.contact,
      validation: { value: device.validation, type: 'boolean' },
      dateTime: { value: isoDate, type: 'http://www.w3.org/2001/XMLSchema#dateTime' },
      userName: user.name
    })
    .execute()
}


//create new device
module.exports.createNewDevice = function (device, role) {
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    device.validation = false;
  }
  var senphurl = 'http://sensor.wiki/#';

  // create SPARQL Query: 
  var bindingsText = 'INSERT DATA {' +
    '?deviceURI rdf:type     s:device.' +
    '?deviceURI rdfs:comment ?desc.' +
    '?deviceURI s:website ?website.' +
    '?deviceURI s:image ?image.' +
    '?deviceURI s:hasContact ?contact.' +
    '?deviceURI s:isValid ?validation.' +
    '?deviceURI s:markdown ?markdown.';

  // create insert ;line for each sensor 
  device.sensor.forEach(element => {
    var string = '?deviceURI s:hasSensor s:' + element.sensorUri.slice(34) + '. ';
    bindingsText = bindingsText.concat(string)
  });
  device.label.forEach(element => {
    bindingsText = bindingsText.concat(
      '?deviceURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
    );
  });
  // add WHERE statement 
  bindingsText = bindingsText.concat('}');
  console.log(bindingsText);

  return client
    .query(bindingsText)
    // bind values to variable names
    .bind({
      deviceURI: { value: senphurl + device.uri, type: 'uri' },
      // +++ FIXME +++ language hardcoded, make it dynamic
      desc: { value: device.description, lang: "en" },
      website: device.website,
      image: device.image,
      contact: device.contact,
      validation: { value: device.validation, type: 'boolean' },
      markdown: {value: device.markdown, type: 'string'}
    })
    .execute()
}

module.exports.convertDeviceToJson = function (device){
  return new Device(device)
}
module.exports.convertDevicesToJson = function (devices){
  return devices.map(dev => new Devices(dev));
}


// //get a single device identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
// module.exports.addDevice = function (device) {
//   var senphurl = 'http://sensor.wiki/#';
//   console.log(device);

//   // create SPARQL Query: 
//   'INSERT {' +
//     '?deviceURI rdf:type     s:device.' +
//     '?deviceURI rdfs:label   ?deviceLabel. ' +
//     '?deviceURI rdfs:comment ?desc.' +
//     (device.website ? '?deviceURI s:website ?website.' : '') +
//     (device.image ? '?deviceURI s:image ?image.' : '') +
//     (device.contact ? '?deviceURI s:hasContact ?contact.' : '');
//   // create insert ;line for each sensor 
//   device.sensor.forEach(element => {
//     var string = '?deviceURI s:hasSensor s:' + element.sensorUri.slice(34) + '. ';
//     bindingsText = bindingsText.concat(string)
//   });
//   // add WHERE statement 
//   bindingsText = bindingsText.concat('}');
//   console.log(bindingsText);
//   return client
//     .query(bindingsText)
//     // bind values to variable names
//     .bind({
//       deviceURI: { value: senphurl + device.uri, type: 'uri' },
//       // +++ FIXME +++ language hardcoded, make it dynamic
//       deviceLabel: { value: device.name, lang: "en" },
//       // +++ FIXME +++ language hardcoded, make it dynamic
//       desc: { value: device.description, lang: "en" },
//       website: { value: device.website, type: 'string' },
//       image: { value: device.image, type: 'string' },
//       contact: { value: device.contact, type: 'string' },
//     })
//     .execute()
//     .then(Promise.resolve(console.log("evertyhing ok")))
//     .catch(function (error) {
//       console.log(error);
//     });
// }
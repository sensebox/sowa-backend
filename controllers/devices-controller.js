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
//get a single device identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
module.exports.addDevice = function (device) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  console.log(device);

  // create SPARQL Query: 
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
  bindingsText = bindingsText.concat('}');
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
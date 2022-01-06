const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;
const config = require('config');

const fuseki_endpoint = config.get('fuseki_endpoint');
const endpoint = `${fuseki_endpoint}/senph/sparql`;
const updatepoint = `${fuseki_endpoint}/senph/update`;
const history_endpoint = `${fuseki_endpoint}/senph-history/sparql`;
const history_updatepoint = `${fuseki_endpoint}/senph-history/update`;

const Phenomenon = require('../models/Phenomenon');
const Phenomena = require('../models/Phenomena');
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
    s: 'http://sensor.wiki/SENPH#',
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
    s: 'http://sensor.wiki/SENPH#',
    uo: 'http://purl.obolibrary.org/obo/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    xsd: 'http://www.w3.org/2001/XMLSchema#'

  })


/* ---------- All Phenomenon funtions: -----------------*/

//get all phenomena @returns iris and labels
module.exports.getPhenomena = function () {
  return client
    .query(SPARQL`
                     SELECT ?phenomenonLabel ?phenomenon ?validation ?rovs ?unit
                     WHERE {
                     
                      ?phenomenon rdf:type s:phenomenon.

                      ?phenomenon rdfs:label ?phenomenonLabel.
                    
                      
                      OPTIONAL {
                        ?phenomenon s:describedBy ?rovs.
                        ?rovs s:describedBy ?unit.
                      }
                      OPTIONAL {
                        ?phenomenon s:isValid ?validation.
                        }
                      } GROUP BY ?phenomenonLabel ?phenomenon ?validation ?rovs ?unit`)
    .execute({ format: { resource: 'phenomenon' } })
    .then(async res => {
       let mappedRes = [];
      for (let binding of res.results.bindings) {
        let allrov = [];
        for(let rov of binding.rovs){
          let rovValue = await this.getROV(rov.value);
          rovValue.forEach(value => {
            if (value.unit){
              let rov = {unit: value.unit.value, min: value.min.value, max: value.max.value};
              console.log("ROV", rov);
              allrov.push(rov);
            }
          })
        }
        binding.rovs = allrov;
        mappedRes.push(binding);
        }
       return mappedRes;
      })
    .catch(function (error) {
      console.log("Oh no, error!", error)
    });
}

//get all phenomena @returns iris and labels
module.exports.getPhenomenaAllLabels = function () {
  return client
    .query(SPARQL`
                     SELECT ?phenomenonLabel ?phenomenon
                     WHERE {
                       ?phenomenon rdf:type s:phenomenon.
                       ?phenomenon rdfs:label ?phenomenonLabel.
                     }`)
    .execute()
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.log("Oh no, error!")
    });
}


//get history of a phenomenon
module.exports.getPhenomenonHistory = function (iri) {
  var senphurl = 'http://sensor.wiki/SENPH#';
  var bindingsText = `
  SELECT ?phenomenon ?dateTime ?user
                     WHERE {
                       ?phenomenon rdf:type s:phenomenon.
                       OPTIONAL{
                        ?phenomenon s:editDate ?dateTime
                      }
                      OPTIONAL{
                        ?phenomenon s:editBy ?user
                      }   
                       FILTER(regex(str(?phenomenon), ?iri, "i" ))
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
      console.log("Oh no, error!")
    });
}


//get a single phenomenon identified by its iri @returns the phenomenon's labels, descriptions, units it is described by, domains, sensors it can be measured by  
// module.exports.getPhenomenonDEPRECATED = function (iri) {
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
// }




//get a single phenomenon identified by its iri @returns the phenomenon's labels, descriptions, units it is described by, domains, sensors it can be measured by  
module.exports.getPhenomenon = function (iri) {
  //still missing: ?domains rdfs:label ?domainsLabel.
  var senphurl = 'http://sensor.wiki/SENPH#';

  var bindingsText = `
  Select Distinct ?label ?description ?markdown ?sensors ?domain ?rov ?min ?max ?unit ?sensorlabel ?unitLabel ?domainLabel ?validation
                   WHERE {   
                      {   
                          ?iri rdfs:label ?label
                      }
                      UNION 
                      {   
                          ?iri rdfs:comment ?description.
                      }
                      UNION
                      {	
                          ?iri s:describedBy ?rov.
                          ?rov s:describedBy ?unit.
                          ?rov s:min ?min.
                          ?rov s:max ?max.
                      }
                      UNION
                      {
                          ?iri s:hasDomain ?domain.
                        OPTIONAL
                          {?domain rdfs:label ?domainLabel.}
                      } 
                      UNION
                      {
                          ?iri s:measurableBy ?selement.
                          ?selement   s:isElementOf ?sensors.
                          ?sensors rdfs:label ?sensorlabel.    
                      }
                      UNION 
                      {   
                          ?iri s:isValid ?validation.
                      }
                      UNION 
                      {   
                          ?iri s:markdown ?markdown.
                      }            
                   }
              Group BY ?sensors ?domain ?rov ?min ?max ?unit ?label ?description ?markdown ?sensorlabel ?domainLabel ?unitLabel ?validation
              ORDER BY ?sensors ?domain ?unit
        `;
  return client
    .query(bindingsText)
    .bind('iri', { s: iri })
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

module.exports.getROV = function (iri) {
  console.log(iri)
  //still missing: ?domains rdfs:label ?domainsLabel.
  // var senphurl = 'http://sensor.wiki/SENPH#';

  var bindingsText = `
  Select Distinct ?unit ?min ?max
                   WHERE {   
                    ?iri s:describedBy ?unit.
                    ?iri s:min ?min.
                    ?iri s:max ?max.
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


//get a single historic phenomenon entry identified by its iri @returns the phenomenon's labels, descriptions, units it is described by, domains, sensors it can be measured by  
module.exports.getHistoricPhenomenon = function (iri) {
  //still missing: ?domains rdfs:label ?domainsLabel.
  var senphurl = 'http://sensor.wiki/SENPH#';

  var bindingsText = `
  Select Distinct ?label ?description ?sensors ?domain ?unit ?sensorlabel ?unitLabel ?domainLabel ?validation
                   WHERE {   
                      {	
                          ?iri  rdfs:label ?name.
                      }
                      UNION 
                      {   
                          ?iri rdfs:label ?label
                      }
                      UNION 
                      {   
                          ?iri rdfs:comment ?description.
                      }
                      UNION
                      {	
                          ?iri s:describedBy ?unit.
                          ?unit rdfs:label ?unitLabel.
                      }
                      UNION
                      {
                          ?iri s:hasDomain ?domain.
                          OPTIONAL
                         {?domain rdfs:label ?domainLabel.}
                      } 
                      UNION
                      {
                          ?iri s:measurableBy ?selement.
                          ?selement   s:isElementOf ?sensors.
                          ?sensors rdfs:label ?sensorlabel.    
                      }  
                      UNION 
                      {   
                          ?iri s:isValid ?validation.
                      }          
                   }
              Group BY ?sensors  ?domain ?unit ?label ?description ?sensorlabel ?domainLabel ?unitLabel ?validation
              ORDER BY ?sensors ?domain ?unit
        `;
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
      console.log(res.results.bindings);
      return res.results.bindings;
    })
    .catch(function (error) {
      console.dir(arguments, { depth: null })
      console.log("Oh no, error!")
      console.log(error)
    });
}




//update/add a new phenomenon @inputs required: label +language, description + language, unit; optional: domain 
// module.exports.updatePhenomenon = function (phenomenon) {
//   var senphurl = 'http://sensor.wiki/SENPH#';
//   var bindingsText = 'INSERT DATA {' +
//     '?phenoname rdf:type      s:phenomenon. ' +
//     '?phenoname rdfs:label    ?phenolabel. ' +
//     '?phenoname rdfs:comment  ?desc. ' +
//     '?phenoname s:describedBy ?unit.' +
//     (phenomenon.domain ? '?phenoname s:hasDomain ?domain.' : '') +
//     '}';
//   return client
//     .query(bindingsText)
//     .bind({
//       phenoname: { value: senphurl + phenomenon.uri, type: 'uri' },
//       phenolabel: { value: phenomenon.name.label, lang: phenomenon.name.lang },
//       desc: { value: phenomenon.description.comment, lang: phenomenon.description.lang },
//       unit: { value: phenomenon.unit, type: 'string' },
//       domain: { value: phenomenon.domain, type: 'string' },
//     })
//     .execute()
//     .then(Promise.resolve(console.log("everthing ok")))
//     .catch(function (error) {
//       console.log(error);
//     });
// }




//get a single device identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
module.exports.editPhenomenon = function (phenomenon, role) {
  var senphurl = 'http://sensor.wiki/SENPH#';
  console.log(phenomenon);
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    phenomenon.validation = false;
  }
  // create SPARQL Query: 
  var bindingsText = 'DELETE {?a ?b ?c}' +
    'INSERT {' +
    '?phenomenonURI rdf:type     s:phenomenon.' +
    '?phenomenonURI rdfs:comment ?desc.' +
    '?phenomenonURI s:isValid ?validation.' +
    '?phenomenonURI s:markdown ?markdown.';
  // create insert ;line for each unit 
  phenomenon.label.forEach(element => {
    bindingsText = bindingsText.concat(
      '?phenomenonURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
    );
  });
  // create insert ;line for each unit 
  phenomenon.unit.forEach(element => {
    var rov = senphurl + Math.random().toString().split(".")[1];
    bindingsText = bindingsText.concat(
      '?phenomenonURI s:describedBy ' + '<' + rov + '>.' +
      '<' + rov + '> s:describedBy ' + '<' + element.unitUri + '>' + '.' +
      '<' + element.unitUri + '> rdfs:label "' + element.unitLabel + '".' +
      '<' + rov + '> s:min "' + element.min + '".' +
      '<' + rov + '> s:max "' + element.max + '".'
    );
  });
  // create insert ;line for each domain 
  phenomenon.domain.forEach(element => {
    bindingsText = bindingsText.concat(
      '?phenomenonURI s:hasDomain s:' + element.domainUri.slice(34) + '. '
    );
  });
  // add WHERE statement 
  bindingsText = bindingsText.concat(
    '} WHERE {?a ?b ?c. FILTER (?a = ?phenomenonURI || ?c = ?phenomenonURI)}');
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
      validation: { value: phenomenon.validation, type: 'boolean' },
      markdown: { value: phenomenon.markdown, type: 'string'}
    })
    .execute();
}

//delete a single device identified by its iri 
module.exports.deletePhenomenon = function (phenomenon, role) {
  var senphurl = 'http://sensor.wiki/SENPH#';
  console.log(phenomenon);
  // create SPARQL Query: 
  var bindingsText =
    ` DELETE {?a ?b ?c}
    WHERE {?a ?b ?c .
    FILTER (?a = ?phenomenonURI || ?c = ?phenomenonURI)
  }`;
  console.log(bindingsText);

  return client
    .query(bindingsText)
    // bind values to variable names
    .bind({
      phenomenonURI: { value: senphurl + phenomenon.uri, type: 'uri' }
    })
    .execute();
}



module.exports.createHistoryPhenomenon = function (phenomenon, user) {
  var date = Date.now();
  var isoDate = new Date(date).toISOString();
  phenomenon['dateTime'] = date;
  console.log(phenomenon);
  if (user.role != 'expert' && user.role != 'admin') {
    console.log("User has no verification rights!");
    phenomenon.validation = false;
  }
  var senphurl = 'http://sensor.wiki/SENPH#';

  // DELETE {...} INSERT{...}
  var bindingsText = 'INSERT DATA {' +
    '?phenomenonURI rdf:type      s:phenomenon.' +
    '?phenomenonURI rdfs:comment  ?desc.' +
    '?phenomenonURI s:isValid     ?validation.' +
    '?phenomenonURI s:editDate    ?dateTime.' +
    '?phenomenonURI s:editBy      ?userName.';


  // create insert ;line for each unit 
  phenomenon.label.forEach(element => {
    bindingsText = bindingsText.concat(
      '?phenomenonURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
    );
  });
  // create insert ;line for each unit 
  phenomenon.unit.forEach(element => {
    bindingsText = bindingsText.concat(
      '?phenomenonURI s:describedBy ' + '<' + element.unitUri + '>' + '.' +
      '<' + element.unitUri + '> rdfs:label "' + element.unitLabel + '".'
    );
  });
  // create insert ;line for each domain 
  phenomenon.domain.forEach(element => {
    bindingsText = bindingsText.concat(
      '?phenomenonURI s:hasDomain s:' + element.domainUri.slice(34) + '. '
    );
  });
  bindingsText = bindingsText.concat('}')
  // TODO: Add dynamic description language tag!
  // LOG and EXECTUE UPDATE 
  console.log(bindingsText)
  return historyClient
    .query(bindingsText)
    .bind({
      phenomenonURI: { value: senphurl + phenomenon.uri + '_' + phenomenon.dateTime, type: 'uri' },
      // +++ FIXME +++ language hardcoded, make it dynamic
      desc: { value: phenomenon.description, lang: "en" },
      validation: { value: phenomenon.validation, type: 'boolean' },
      dateTime: { value: isoDate, type: 'http://www.w3.org/2001/XMLSchema#dateTime' },
      userName: user.name
    })
    .execute();
}


module.exports.createNewPhenomenon = function (phenomenon, role) {
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    phenomenon.validation = false;
  }
  var senphurl = 'http://sensor.wiki/SENPH#';

  // DELETE {...} INSERT{...}
  var bindingsText = 'INSERT DATA {' +
    '?phenomenonURI rdf:type     s:phenomenon.' +
    '?phenomenonURI rdfs:comment ?desc.' +
    '?phenomenonURI s:isValid ?validation.' +
    '?phenomenonURI s:markdown ?markdown.';
  // create insert ;line for each label 
  phenomenon.label.forEach(element => {
    bindingsText = bindingsText.concat(
      '?phenomenonURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
    );
  });
  // create insert ;line for each unit 
  phenomenon.unit.forEach(element => {
    var rov = senphurl + Math.random().toString().split(".")[1];
    bindingsText = bindingsText.concat(
      '?phenomenonURI s:describedBy ' + '<' + rov + '>.' +
      '<' + rov + '> s:describedBy ' + '<' + element.unitUri + '>' + '.' +
      '<' + element.unitUri + '> rdfs:label "' + element.unitLabel + '".' +
      '<' + rov + '> s:min "' + element.min + '".' +
      '<' + rov + '> s:max "' + element.max + '".'
    );
  });
  // create insert ;line for each domain 
  phenomenon.domain.forEach(element => {
    bindingsText = bindingsText.concat(
      '?phenomenonURI s:hasDomain s:' + element.domainUri.slice(34) + '. '
    );
  });
  bindingsText = bindingsText.concat('}')
  // TODO: Add dynamic description language tag!
  // LOG and EXECTUE UPDATE 
  console.log(bindingsText)
  return client
    .query(bindingsText)
    .bind({
      phenomenonURI: { value: senphurl + phenomenon.uri, type: 'uri' },
      rov: {value: senphurl + Math.random().toString().split(".")[1], type: "uri"},
      // +++ FIXME +++ language hardcoded, make it dynamic
      desc: { value: phenomenon.description, lang: "en" },
      validation: { value: phenomenon.validation, type: 'boolean' },
      markdown: { value: phenomenon.markdown, type: 'string'}
    })
    .execute();
}


module.exports.convertPhenomenonToJson = function (pheno) {
  return new Phenomenon(pheno);
}

module.exports.convertPhenomenaToJson = function (phenos) {
  //TODO: IMPLEMENT IF NEEDED
  console.log("PHENOS", phenos)
  

  return phenos.map(pheno => new Phenomena(pheno));
}

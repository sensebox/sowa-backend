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
    .then(res => { console.log(res);
                    return res.results.bindings;})
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



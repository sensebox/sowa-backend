const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;
const config = require('config');

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



/* ---------- All domain funtions: -----------------*/

//get all domains @returns iris and labels
module.exports.getDomains = function () {
  return client
    .query(SPARQL`
                    SELECT ?label ?domain ?validation
                    WHERE {
                      ?domain rdf:type s:domain.
                      ?domain rdfs:label ?label.
                      OPTIONAL{
                      ?domain s:isValid ?validation.
                      }
                    }`)
    .execute({ format: { resource: 'domain' } })
    .then(res => res.results.bindings)
    .catch(function (error) {
      console.dir(arguments, { depth: null })
      console.log("Oh no, error!")
      console.log(error)
    });
}

//get history of a domain
module.exports.getDomainHistory = function (iri) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  var bindingsText = `
  SELECT ?domain ?dateTime ?user
                     WHERE {
                       ?domain rdf:type s:domain.
                       OPTIONAL{
                        ?domain s:editDate ?dateTime
                      }
                      OPTIONAL{
                        ?domain s:editBy ?user
                      }   
                       FILTER(regex(str(?domain), ?iri, "i" ))
                     }`;
  return historyClient
    .query(bindingsText)
    .bind('iri', senphurl + iri)
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



//get a single domain identified by its iri @returns the domain's labels, descriptions and phenomena it is domain of
module.exports.getDomain = function (iri) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';

  return client
    .query(SPARQL`
    Select Distinct ?label ?description ?phenomenon ?phenomenonLabel ?validation
                     WHERE {
                        {   
                            ${{ s: iri }} rdfs:label ?label.
                        }
                        UNION 
                        {   
                            ${{ s: iri }} rdfs:comment ?description.
                        }
                        UNION
                        {
                            ${{ s: iri }} s:isDomainOf ?phenomenon.
                        }  
                        UNION
                        {
                            ${{ s: iri }} s:isValid ?validation.
                        }  

                     }
                Group BY ?label ?description ?phenomenon ?phenomenonLabel ?validation
                ORDER BY ?phenomenon
          `)
    .execute()
    .then(res => {
      console.log(res.results.bindings);
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


//get a single domain identified by its iri @returns the domain's labels, descriptions and phenomena it is domain of
module.exports.getHistoricDomain = function (iri) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';

  return historyClient
    .query(SPARQL`
    Select Distinct ?label ?description ?phenomenon ?phenomenonLabel ?validation
                     WHERE {
                        {   
                            ${{ s: iri }} rdfs:label ?label
                        }
                        UNION 
                        {   
                            ${{ s: iri }} rdfs:comment ?description.
                        }
                        UNION
                        {
                            ${{ s: iri }} s:isDomainOf ?phenomenon.
                        }  
                        UNION
                        {
                            ${{ s: iri }} s:isValid ?validation.
                        }  

                     }
                Group BY ?label ?description ?phenomenon ?phenomenonLabel ?validation
                ORDER BY ?phenomenon
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



// //update/add a new domain @inputs required: label +language, description + language; optional: manufacturer, data sheet, price in Euro, life period (currently not available because of datatype issue) and image 
// module.exports.updateDomain = function (domain) {
//   console.log(domain);
//   // `+ (domain.phenomenon ?`${{s: domain.name.label}} s:isDomainOf ${{s: domain.phenomenon}}.`:``) + `
//   return client
//     .query(SPARQL`INSERT DATA {
//         ${{ s: domain.uri }} rdf:type s:domain;
//                     rdfs:label  ${{ value: domain.name.label, lang: domain.name.lang }};
//                     rdfs:comment  ${{ value: domain.description.comment, lang: domain.description.lang }}.
//             }`)
//     .execute()
//     .then(Promise.resolve(console.log("everthing ok")))
//     .catch(function (error) {
//       console.log(error);
//     });
// }




//edit a domain
module.exports.editDomain = function (domain, role) {
  var senphurl = 'http://www.opensensemap.org/SENPH#';
  console.log(domain);
  if(role != ('expert' || 'admin')){
    console.log("User has no verification rights!");
    domain.validation = false;
  }
  // create SPARQL Query: 
  var bindingsText = 'DELETE {?a ?b ?c}' +
    'INSERT {' +
    '?domainURI rdf:type     s:domain.' +
    '?domainURI rdfs:comment ?desc.' +
    '?domainURI s:isValid ?validation.';

  // create insert ;line for each label 
  domain.label.forEach(element => {
    bindingsText = bindingsText.concat(
      '?domainURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
    );
  });

  // create insert ;line for each phenomenon 
  domain.phenomenon.forEach(element => {
    bindingsText = bindingsText.concat(
      '?domainURI s:isDomainOf ' + '<' + element.phenomenonURI + '>' + '.'
    );
  });

  // add WHERE statement 
  bindingsText = bindingsText.concat('} WHERE {?a ?b ?c. FILTER (?a = ?domainURI || ?c = ?domainURI)}');
  console.log(bindingsText);

  return client
    .query(bindingsText)
    // bind values to variable names
    .bind({
      domainURI: { value: senphurl + domain.uri, type: 'uri' },
      // +++ FIXME +++ language hardcoded, make it dynamic
      desc: { value: domain.description, lang: "en" },
      validation: { value: domain.validation, type: 'boolean' }
    })
    .execute()
}

//create new version of a domain in history db 
module.exports.createHistoryDomain = function (domain, user) {
  var date = Date.now();
  var isoDate =  new Date(date).toISOString();
  domain['dateTime'] = date;
  console.log(domain);
  if(user.role != ('expert' || 'admin')){
    console.log("User has no verification rights!");
    domain.validation = false;
  }
  var senphurl = 'http://www.opensensemap.org/SENPH#';

  // create SPARQL Query: 
  var bindingsText = 'INSERT DATA {' +
    '?domainURI rdf:type      s:domain.' +
    '?domainURI rdfs:comment  ?desc.' +
    '?domainURI s:isValid     ?validation.' +
    '?domainURI s:editDate    ?dateTime.' +
    '?domainURI s:editBy ?userName.';

  // create insert ;line for each label 
  domain.label.forEach(element => {
    bindingsText = bindingsText.concat(
      '?domainURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
    );
  });

  // create insert ;line for each phenomenon 
  domain.phenomenon.forEach(element => {
    bindingsText = bindingsText.concat(
      '?domainURI s:isDomainOf ' + '<' + element.phenomenonURI + '>' + '.'
    );
  });

  // add WHERE statement 
  bindingsText = bindingsText.concat('}');
  console.log(bindingsText);

  return historyClient
    .query(bindingsText)
    // bind values to variable names
    .bind({
      domainURI: { value: senphurl + domain.uri + '_' + domain.dateTime, type: 'uri' },
      // +++ FIXME +++ language hardcoded, make it dynamic
      desc: { value: domain.description, lang: "en" },
      validation: { value: domain.validation, type: 'boolean' },
      dateTime: {value: isoDate,  type: 'http://www.w3.org/2001/XMLSchema#dateTime'},
      userName: user.name
    })
    .execute()
}

//create new domain 
module.exports.createNewDomain = function (domain, role) {
  console.log(domain);
  if(role != ('expert' || 'admin')){
    console.log("User has no verification rights!");
    domain.validation = false;
  }
  var senphurl = 'http://www.opensensemap.org/SENPH#';

  // create SPARQL Query: 
  var bindingsText = 'INSERT DATA {' +
    '?domainURI rdf:type     s:domain.' +
    '?domainURI rdfs:comment ?desc.' +
    '?domainURI s:isValid    ?validation.';


  // create insert ;line for each label 
  domain.label.forEach(element => {
    bindingsText = bindingsText.concat(
      '?domainURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
    );
  });

  // create insert ;line for each phenomenon 
  domain.phenomenon.forEach(element => {
    bindingsText = bindingsText.concat(
      '?domainURI s:isDomainOf ' + '<' + element.phenomenonURI + '>' + '.'
    );
  });
  // add WHERE statement 
  bindingsText = bindingsText.concat('}');
  console.log(bindingsText);

  return client
    .query(bindingsText)
    // bind values to variable names
    .bind({
      domainURI: { value: senphurl + domain.uri, type: 'uri' },
      // +++ FIXME +++ language hardcoded, make it dynamic
      desc: { value: domain.description, lang: "en" },
      validation: { value: domain.validation, type: 'boolean' }
    })
    .execute()
}





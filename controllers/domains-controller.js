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
    Select Distinct ?iri ?label ?description ?phenomenon ?phenomenonLabel 
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
                            ${{ s: iri }} s:isDomainOf ?phenomenon.
                          ?phenomenon  rdfs:label ?phenomenonLabel
                        }  

                     }
                Group BY ?iri ?label ?description ?phenomenon ?phenomenonLabel 
                ORDER BY ?iri ?phenomenon
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

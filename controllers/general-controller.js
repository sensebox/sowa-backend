const SparqlClient = require('sparql-client-2');
const config = require('config');
const fuseki_endpoint = config.get('fuseki_endpoint');
const endpoint = `${fuseki_endpoint}/senph/sparql`;
const updatepoint = `${fuseki_endpoint}/senph/update`;
const history_endpoint = `${fuseki_endpoint}/senph-history/sparql`;
const history_updatepoint = `${fuseki_endpoint}/senph-history/update`;

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

module.exports.uriExists = function (iri) {
    var senphurl = 'http://www.opensensemap.org/SENPH#';
    var queryUrl = senphurl + iri;
    var bindingsText = 'ASK WHERE { {<' + queryUrl + '> ?p ?o . } UNION {?s ?p <' + queryUrl + '> . } }';

    return client
        .query(bindingsText)
        .execute()
        .then(res => {
            return res.boolean;
        })
}
const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;
const config = require('config');
const Domain = require('../models/Domain');

const prisma = require('../lib/prisma');


/* ---------- All domain funtions: -----------------*/

//get all domains @returns iris and labels
module.exports.getDomains = async function (lang) {

  let languageFilter = true;
  if (lang) {
    languageFilter = {
      where: {
        languageCode: lang,
      },
    };
  }

  const result = await prisma.domain.findMany({
    select: {
      id: true,
      phenomenon: true,
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
    },
  });

  return result;

}

//get history of a domain
module.exports.getDomainHistory = function (iri) {
  var senphurl = 'http://sensors.wiki/SENPH#';
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



//get a single domain identified by its iri @returns the domain's labels, descriptions and phenomena it is domain of
module.exports.getDomain = async function (iri, lang) {

  let languageFilter = true;
  if (lang) {
    languageFilter = {
      where: {
        languageCode: lang,
      },
    };
  }

  const result = await prisma.domain.findUnique({
    where: {
      id: parseInt(iri),
    },
    select: {
      id: true,
      phenomenon: true,
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
    },
  });

  return result;

}


//get a single domain identified by its iri @returns the domain's labels, descriptions and phenomena it is domain of
module.exports.getHistoricDomain = function (iri) {
  var senphurl = 'http://sensors.wiki/SENPH#';

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
  var senphurl = 'http://sensors.wiki/SENPH#';
  console.log(domain);
  if (role != ('expert' || 'admin')) {
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

module.exports.deleteDomain = function (domain, role) {
  var senphurl = 'http://sensors.wiki/SENPH#';
    var bindingsText =
      ` DELETE {?a ?b ?c}
    WHERE { ?a ?b ?c .
            FILTER (?a = ?domainURI || ?c = ?domainURI )
          }`;
    console.log(bindingsText)
    return client
      .query(bindingsText)
      .bind({
        domainURI: { value: senphurl + domain.uri, type: 'uri' },
      })
      .execute();
  }

//create new version of a domain in history db 
module.exports.createHistoryDomain = function (domain, user) {
  var date = Date.now();
  var isoDate = new Date(date).toISOString();
  domain['dateTime'] = date;
  console.log(domain);
  if (user.role != 'expert' && user.role != 'admin') {
    console.log("User has no verification rights!");
    domain.validation = false;
  }
  var senphurl = 'http://sensors.wiki/SENPH#';

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
      dateTime: { value: isoDate, type: 'http://www.w3.org/2001/XMLSchema#dateTime' },
      userName: user.name
    })
    .execute()
}

//create new domain 
module.exports.createNewDomain = function (domain, role) {
  console.log(domain);
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    domain.validation = false;
  }
  var senphurl = 'http://sensors.wiki/SENPH#';

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

module.exports.convertDomainToJson = function(domain){
  return new Domain(domain);
}



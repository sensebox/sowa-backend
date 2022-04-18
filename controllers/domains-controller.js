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
      validation: true,
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
      validation: true,
      phenomenon: {
        select: {
          id: true,
          label: {
            select: {
              item: languageFilter,
            }
          },
          validation: true,
        }
      }
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
module.exports.editDomain = async function (domainForm, role) {

  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    domainForm.validation = false;
  }

  console.log(domainForm)

  /////////// Current domain ////////////
  // retrive current phenomeonon with current attributes from database 
  const domain = await prisma.domain.findUnique({
    where: {
      id: domainForm.id,
    }
  })

  //////////// Labels ////////////
  // delete, update or create labels
  domainForm.deletedLabels.forEach( async (label) => {
    console.log(label.translationId)
    console.log(label.lang)
    const deleteLabel = await prisma.translationItem.deleteMany({
      where: {
        translationId: label.translationId,
        languageCode: label.lang,
      }
    })
  })

  domainForm.label.forEach( async (label) => {
    if (label.translationId !== null) {
      const updateLabel = await prisma.translationItem.updateMany({
        where: {
          translationId: label.translationId,
          languageCode: label.lang
        },
        data:  {
          text: label.value,
        }
      })
    } else if (label.translationId === null) {
      const createLabel = await prisma.translationItem.create({
        data: {
          translationId: domain.labelId,
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
      translationId: domainForm.description.translationId,
      languageCode: "en",
      // langageCode hardcoded, needs to be changed in schema that description is no longer a multi-language option
    },
    data: {
      text:  domainForm.description.text,
    }
  })


  /////////// Phenomena //////////////
  // delete, update or create phenomena
  domainForm.deletedPhenomena.forEach( async (phenomenon) => {
    console.log(phenomenon.phenomenon)
    console.log(phenomenon.exists)
    if (phenomenon.exists === true) {
      const disconnectPhenomenon = await prisma.domain.update({
        where: {
          id: domainForm.id
        },
        data: {
          phenomenon: {
            disconnect: {
              id: phenomenon.phenomenon
            }
          }
          
        }
      })
    } 
  })

  domainForm.phenomenon.forEach( async (phenomenon) => {
    if (phenomenon.exists === false) {
      const connectPhenomenon = await prisma.domain.update({
        where: {
          id: domainForm.id
        },
        data: {
          phenomenon: {
            connect: {
              id: phenomenon.phenomenon
            }
          }
        }
      })
    }
  })


  // var senphurl = 'http://sensors.wiki/SENPH#';
  // console.log(domain);
  // if (role != ('expert' || 'admin')) {
  //   console.log("User has no verification rights!");
  //   domain.validation = false;
  // }
  // // create SPARQL Query: 
  // var bindingsText = 'DELETE {?a ?b ?c}' +
  //   'INSERT {' +
  //   '?domainURI rdf:type     s:domain.' +
  //   '?domainURI rdfs:comment ?desc.' +
  //   '?domainURI s:isValid ?validation.';

  // // create insert ;line for each label 
  // domain.label.forEach(element => {
  //   bindingsText = bindingsText.concat(
  //     '?domainURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
  //   );
  // });

  // // create insert ;line for each phenomenon 
  // domain.phenomenon.forEach(element => {
  //   bindingsText = bindingsText.concat(
  //     '?domainURI s:isDomainOf ' + '<' + element.phenomenonURI + '>' + '.'
  //   );
  // });

  // // add WHERE statement 
  // bindingsText = bindingsText.concat('} WHERE {?a ?b ?c. FILTER (?a = ?domainURI || ?c = ?domainURI)}');
  // console.log(bindingsText);

  // return client
  //   .query(bindingsText)
  //   // bind values to variable names
  //   .bind({
  //     domainURI: { value: senphurl + domain.uri, type: 'uri' },
  //     // +++ FIXME +++ language hardcoded, make it dynamic
  //     desc: { value: domain.description, lang: "en" },
  //     validation: { value: domain.validation, type: 'boolean' }
  //   })
  //   .execute()
}

module.exports.deleteDomain = async function (domainForm, role) {
  
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    domainForm.validation = false;
  }

  console.log(domainForm)

  domainForm.phenomenon.forEach( async (phenomenon) => {
    const disconnectPhenomenon = prisma.domain.update({
      where: {
        id: domainForm.id
      },
      data: {
        phenomenon: {
          disconnect: {
            id: phenomenon.phenomenon
          }
        }
      }
    })
  })

  const deletetranslationItems = await prisma.translationItem.deleteMany({
    where: {
      translationId: {
        in: domainForm.translationIds,
      }
    }
  })

  const deletetranslations = await prisma.translation.deleteMany({
    where: {
      id: {
        in: domainForm.translationIds,
      }
    }
  })

  const deleteDomain = await prisma.domain.delete({
    where: {
      id: domainForm.id,
    }
  })

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
module.exports.createNewDomain = async function (domain, role) {
  console.log(domain);
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    domain.validation = false;
  } else {
    domain.validation = true;
  }

  const phenomenaIds = domain.phenomenon.map(pheno => {return {"id": pheno.phenomenon.id}});
  const labelTranslation = await prisma.translation.create({data: {}})
  const descTranslation = await prisma.translation.create({data: {}})

  if(domain.label.length > 0) {
    const mappedLabel = domain.label.map(label => {return {languageCode: label.lang, text: label.value, translationId: labelTranslation.id}});
    const labels = await prisma.translationItem.createMany({data: mappedLabel})
  }

  // if(domain.description.length > 0) {
  //   const mappedDesc = domain.description.map(label => {return {languageCode: label.lang, text: label.value, translationId: labelTranslation.id}});
  //   const descs = await prisma.translationItem.createMany({data: mappedDesc      
  //   })
  // }

  const domainItem = await prisma.domain.create({data: {
    label: {
      connect: {id: labelTranslation.id },
    },
    // descriptionId: descTranslation.id,
    validation: domain.validation,
    phenomenon: {
      connect: phenomenaIds
    }
  }})

  return domainItem;
}

module.exports.convertDomainToJson = function(domain){
  return new Domain(domain);
}



const config = require('config');

const Phenomenon = require('../models/Phenomenon');
const Phenomena = require('../models/Phenomena');

const prisma = require('../lib/prisma');

/* ---------- All Phenomenon funtions: -----------------*/

//get all phenomena @returns iris and labels
module.exports.getPhenomena = async function (lang) {

  let languageFilter = true;
  if (lang) {
    languageFilter = {
      where: {
        languageCode: lang,
      },
    };
  }

  const result = await prisma.phenomenon.findMany({
    select: {
      id: true,
      markdown: {
        select: {
          item: languageFilter,
        },
      },
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
  var senphurl = 'http://sensors.wiki/SENPH#';
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
module.exports.getPhenomenon = async function (iri, lang) {
  
  let languageFilter = true;
  if (lang) {
    languageFilter = {
      where: {
        languageCode: lang,
      },
    };
  }

  const result = await prisma.phenomenon.findUnique({
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
      markdown: {
        select: {
          item: languageFilter,
        },
      },
      validation: true,
      domains: {
        select: {
          id: true,
          label: {
            select: {
              item: languageFilter,
            }
          },
          validation: true,
        }
      },
      rov: {
        select: {
          id: true,
          min: true,
          max: true,
          unit: true,
        }
      },
    },
  });

  return result;

}

module.exports.getROV = function (iri) {
  console.log(iri)
  //still missing: ?domains rdfs:label ?domainsLabel.
  // var senphurl = 'http://sensors.wiki/SENPH#';

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
  var senphurl = 'http://sensors.wiki/SENPH#';

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
//   var senphurl = 'http://sensors.wiki/SENPH#';
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
// module.exports.editPhenomenon = function (phenomenon, role) {
//   var senphurl = 'http://sensors.wiki/SENPH#';
//   console.log(phenomenon);
//   if (role != 'expert' && role != 'admin') {
//     console.log("User has no verification rights!");
//     phenomenon.validation = false;
//   }
//   // create SPARQL Query: 
//   var bindingsText = 'DELETE {?a ?b ?c}' +
//     'INSERT {' +
//     '?phenomenonURI rdf:type     s:phenomenon.' +
//     '?phenomenonURI rdfs:comment ?desc.' +
//     '?phenomenonURI s:isValid ?validation.' +
//     '?phenomenonURI s:markdown ?markdown.';
//   // create insert ;line for each unit 
//   phenomenon.label.forEach(element => {
//     bindingsText = bindingsText.concat(
//       '?phenomenonURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
//     );
//   });
//   // create insert ;line for each unit 
//   phenomenon.unit.forEach(element => {
//     var rov = senphurl + Math.random().toString().split(".")[1];
//     bindingsText = bindingsText.concat(
//       '?phenomenonURI s:describedBy ' + '<' + rov + '>.' +
//       '<' + rov + '> s:describedBy ' + '<' + element.unitUri + '>' + '.' +
//       '<' + element.unitUri + '> rdfs:label "' + element.unitLabel + '".' +
//       '<' + rov + '> s:min "' + element.min + '".' +
//       '<' + rov + '> s:max "' + element.max + '".'
//     );
//   });
//   // create insert ;line for each domain 
//   phenomenon.domain.forEach(element => {
//     bindingsText = bindingsText.concat(
//       '?phenomenonURI s:hasDomain s:' + element.domainUri.slice(senphurl.length) + '. '
//     );
//   });
//   // add WHERE statement 
//   bindingsText = bindingsText.concat(
//     '} WHERE {?a ?b ?c. FILTER (?a = ?phenomenonURI || ?c = ?phenomenonURI)}');
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
//       validation: { value: phenomenon.validation, type: 'boolean' },
//       markdown: { value: phenomenon.markdown, type: 'string'}
//     })
//     .execute();
// }

//delete a single device identified by its iri 
// module.exports.deletePhenomenon = function (phenomenon, role) {
//   var senphurl = 'http://sensors.wiki/SENPH#';
//   console.log(phenomenon);
//   // create SPARQL Query: 
//   var bindingsText =
//     ` DELETE {?a ?b ?c}
//     WHERE {?a ?b ?c .
//     FILTER (?a = ?phenomenonURI || ?c = ?phenomenonURI)
//   }`;
//   console.log(bindingsText);

//   return client
//     .query(bindingsText)
//     // bind values to variable names
//     .bind({
//       phenomenonURI: { value: senphurl + phenomenon.uri, type: 'uri' }
//     })
//     .execute();
// }



module.exports.createHistoryPhenomenon = function (phenomenon, user) {
  var date = Date.now();
  var isoDate = new Date(date).toISOString();
  phenomenon['dateTime'] = date;
  console.log(phenomenon);
  if (user.role != 'expert' && user.role != 'admin') {
    console.log("User has no verification rights!");
    phenomenon.validation = false;
  }
  var senphurl = 'http://sensors.wiki/SENPH#';

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
      '?phenomenonURI s:hasDomain s:' + element.domainUri.slice(senphurl.length) + '. '
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


module.exports.createNewPhenomenon = async function (phenomenonForm, role) {
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    phenomenonForm.validation = false;
  }
  console.log(phenomenonForm)

  const domainIds = phenomenonForm.domain.map(domain => {return {"id": domain.domain}});
  console.log(domainIds)

  const labelTranslation = await prisma.translation.create({data: {}})
  if(phenomenonForm.label.length > 0) {
    const mappedLabel = phenomenonForm.label.map(label => {return {languageCode: label.lang, text: label.value, translationId: labelTranslation.id}});
    const labels = await prisma.translationItem.createMany({data: mappedLabel})
  }

  const units = phenomenonForm.unit.map(unit => {return {
    unit: {
      connect: {id: unit.unitUri}
    },
    min: unit.min,
    max: unit.max
  }})


  const phenomenon = await prisma.phenomenon.create({data: {
    label: {
      connect: {id: labelTranslation.id},
    },
    // descriptionId: descTranslation.id,
    validation: phenomenonForm.validation,
    domains: {
      connect: domainIds
    },
    rov: {
      create: units
    }
  }})

  console.log("PHENO ITEM", phenomenon)
  return phenomenon;

}

// editing 
module.exports.editPhenomenon = async function (phenomenonForm, role) {
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    phenomenonForm.validation = false;
  }

  console.log(phenomenonForm)

  /////////// Current phenomenon ////////////
  // retrive current phenomeonon with current attributes from database 
  const phenomenon = await prisma.phenomenon.findUnique({
    where: {
      id: phenomenonForm.id,
    }
  })

  
  //////////// Labels ////////////
  // delete, update or create labels
  phenomenonForm.deletedLabels.forEach( async (label) => {
    console.log(label.translationId)
    console.log(label.lang)
    const deleteLabel = await prisma.translationItem.deleteMany({
      where: {
        translationId: label.translationId,
        languageCode: label.lang,
      }
    })
  })

  phenomenonForm.label.forEach( async (label) => {
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
          translationId: phenomenon.labelId,
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
      translationId: phenomenonForm.description.translationId,
      languageCode: "en",
      // langageCode hardcoded, needs to be changed in schema that description is no longer a multi-language option
    },
    data: {
      text:  phenomenonForm.description.text,
    }
  })

  /////////// Markdown //////////////
  // update markdown text; if the whole text is deleted, markdown is set to an empty string
  const updateMarkdown = await prisma.translationItem.updateMany({
    where: {
      translationId: phenomenonForm.markdown.translationId,
      languageCode: "en",
      // langageCode hardcoded, needs to be changed in schema that description is no longer a multi-language option
    },
    data: {
      text:  phenomenonForm.markdown.text,
    }
  })


  /////////// Domains //////////////
  // delete, update or create domains
  phenomenonForm.deletedDomains.forEach( async (domain) => {
    console.log(domain.domain)
    console.log(domain.exists)
    if (domain.exists === true) {
      const disconnectDomain = await prisma.domain.update({
        where: {
          id: domain.domain
        },
        data: {
          phenomenon: {
            disconnect: {
              id: phenomenonForm.id
            }
          }
          
        }
      })
    } 
  })

  phenomenonForm.domain.forEach( async (domain) => {
    if (domain.exists === false) {
      const connectDomain = await prisma.domain.update({
        where: {
          id: domain.domain
        },
        data: {
          phenomenon: {
            connect: {
              id: phenomenonForm.id
            }
          }
        }
      })
    }
  })


  ////////// Units //////////////
  // delete, update or create range of values (units) for editing
  phenomenonForm.deletedUnits.forEach( async (unit) => {
    console.log(unit)
    const deleteUnit = await prisma.rangeOfValues.delete({
      where: {
        id: unit.rovId
      }
    })
  })

  phenomenonForm.unit.forEach( async (unit) => {
    console.log(unit)
    if (unit.rovId !== null) {
      const updateUnit = await prisma.rangeOfValues.update({
        where: {
          id: unit.rovId
        },
        data: {
          min: unit.min,
          max: unit.max,
          unitId: unit.unitUri,
        }
      })
    }
    else if (unit.rovId === null) {
      const createUnit = await prisma.rangeOfValues.create({
        data: {
          min: unit.min,
          max: unit.max,
          unitId: unit.unitUri,
          phenomenonId: phenomenonForm.id,
        }
      })
    }
  })
}


module.exports.deletePhenomenon = async function (phenomenonForm, role) {
  
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    phenomenonForm.validation = false;
  }

  console.log(phenomenonForm);

  const deleteElements = await prisma.element.deleteMany({
    where: {
      phenomenonId: phenomenonForm.id,
    },
  });

  const deleteRov = await prisma.rangeOfValues.deleteMany({
    where: {
      phenomenonId: phenomenonForm.id,
    }
  })

  const deletetranslationItems = await prisma.translationItem.deleteMany({
    where: {
      translationId: {
        in: phenomenonForm.translationIds,
      }
    }
  })

  const deletetranslations = await prisma.translation.deleteMany({
    where: {
      id: {
        in: phenomenonForm.translationIds,
      }
    }
  })

  const deletePhenomenon = await prisma.phenomenon.delete({
    where: {
      id: phenomenonForm.id,
    }
  })
}


module.exports.convertPhenomenonToJson = function (pheno) {
  return new Phenomenon(pheno);
}

module.exports.convertPhenomenaToJson = function (phenos) {
  //TODO: IMPLEMENT IF NEEDED
  console.log("PHENOS", phenos)
  

  return phenos.map(pheno => new Phenomena(pheno));
}

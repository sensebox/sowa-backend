const Domain = require('../models/Domain');
const helperFunctions = require('../helper/helperFunctions');
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
      slug: true,
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

  let where = (isNaN(parseInt(iri))) ? {slug: iri} : {id: parseInt(iri)};

  const result = await prisma.domain.findUnique({
    where: where,
    select: {
      id: true,
      slug: true,
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
          slug: true,
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






//edit a domain
module.exports.editDomain = async function (domainForm, role) {

  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    domainForm.validation = false;
  }
  else {
    domainForm.validation = true;
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
  for (const label of domainForm.deletedLabels) {
    console.log(label.translationId)
    console.log(label.lang)
    const deleteLabel = await prisma.translationItem.deleteMany({
      where: {
        translationId: label.translationId,
        languageCode: label.lang,
      }
    })
  };

  for (const label of domainForm.label) {
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
  };


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
  for (const phenomenon of domainForm.deletedPhenomena) {
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
  };

  for (const phenomenon of domainForm.phenomenon) {
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
  };

  /////////// Edited domain ////////////
  // retrive edited domain with edited attributes from database 
  const editedDomain = await prisma.domain.findUnique({
    where: {
      id: domainForm.id,
    }
  })

  return editedDomain;
}

module.exports.deleteDomain = async function (domainForm, role) {
  
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    domainForm.validation = false;
  }
  else {
    domainForm.validation = true;
  }

  console.log(domainForm)

  for (const phenomenon of domainForm.phenomenon) {
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
  };

  const deletetranslationItems = await prisma.translationItem.deleteMany({
    where: {
      translationId: {
        in: domainForm.translationIds,
      }
    }
  });

  const deletetranslations = await prisma.translation.deleteMany({
    where: {
      id: {
        in: domainForm.translationIds,
      }
    }
  });

  const deleteDomain = await prisma.domain.delete({
    where: {
      id: domainForm.id,
    }
  });

  return {info: "Domain successfully deleted"};
}



//create new domain 
module.exports.createNewDomain = async function (domainForm, role) {
  console.log(domainForm);
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    domainForm.validation = false;
  } else {
    domainForm.validation = true;
  }

  const phenomenaIds = domainForm.phenomenon.map(pheno => {return {"id": pheno.phenomenon}});
  const labelTranslation = await prisma.translation.create({data: {}})

  if(domainForm.label.length > 0) {
    const mappedLabel = domainForm.label.map(label => {return {languageCode: label.lang, text: label.value, translationId: labelTranslation.id}});
    const labels = await prisma.translationItem.createMany({data: mappedLabel})
  }


  const descTranslation = await prisma.translation.create({data: {}})
  if(domainForm.description) {
    const mappedDescription = [{languageCode: 'en', text: domainForm.description.text, translationId: descTranslation.id}];
    const descriptions = await prisma.translationItem.createMany({data: mappedDescription})
  }

  // generate slug from english label
  let domainSlug;
  for (const label of domainForm.label) {
    if (label.lang == 'en') {
      domainSlug = await helperFunctions.slugifyModified(label.value);
    }  
  };

  const domain = await prisma.domain.create({data: {
    slug: domainSlug,
    label: {
      connect: {id: labelTranslation.id },
    },
    description: {
      connect:  {id: descTranslation.id}
    },
    validation: domainForm.validation,
    phenomenon: {
      connect: phenomenaIds
    }
  }})

  return domain;
}

module.exports.convertDomainToJson = function(domain){
  return new Domain(domain);
}



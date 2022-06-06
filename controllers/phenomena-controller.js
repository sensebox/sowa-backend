const config = require('config');

const Phenomenon = require('../models/Phenomenon');
const Phenomena = require('../models/Phenomena');
const helperFunctions = require('../helper/helperFunctions');

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
      slug: true,
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

  let where = (isNaN(parseInt(iri))) ? {slug: iri} : {id: parseInt(iri)};

  const result = await prisma.phenomenon.findUnique({
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
      markdown: {
        select: {
          item: languageFilter,
        },
      },
      validation: true,
      domains: {
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

  const descTranslation = await prisma.translation.create({data: {}})
  if(phenomenonForm.description) {
    const mappedDescription = [{languageCode: 'en', text: phenomenonForm.description.text, translationId: descTranslation.id}];
    const descriptions = await prisma.translationItem.createMany({data: mappedDescription})
  }

  const markdownTranslation = await prisma.translation.create({data: {}})
  if(phenomenonForm.markdown) {
    const mappedMarkdown = [{languageCode: 'en', text: phenomenonForm.markdown.text, translationId: markdownTranslation.id}];
    const markdowns = await prisma.translationItem.createMany({data: mappedMarkdown})
  }

  const units = phenomenonForm.unit.map(unit => {return {
    unit: {
      connect: {id: unit.unitUri}
    },
    min: unit.min,
    max: unit.max
  }})

  // generate slug from english label
  let phenomenonSlug;
  phenomenonForm.label.forEach(async (label) => {
    if (label.lang == 'en') {
      phenomenonSlug = await helperFunctions.slugifyModified(label.value);
    }  
  });

  const phenomenon = await prisma.phenomenon.create({data: {
    slug: phenomenonSlug,
    label: {
      connect: {id: labelTranslation.id},
    },
    description: {
      connect: {id: descTranslation.id},
    },
    validation: phenomenonForm.validation,
    markdown: {
      connect: {id: markdownTranslation.id},
    },
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

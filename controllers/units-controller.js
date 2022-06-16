const config = require('config');
const { phenomenon } = require('../lib/prisma');
const helperFunctions = require('../helper/helperFunctions');

const prisma = require('../lib/prisma');

/* ---------- All Unit funtions: -----------------*/

//get all units @returns iris and labels
module.exports.getUnits = async function (lang) {

    let languageFilter = true;
    if (lang) {
      languageFilter = {
        where: {
          languageCode: lang,
        },
      };
    }
  
    const result = await prisma.unit.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        notation: true,
      },
    });
  
    return result;
}

//get a single unit identified by its iri @returns the unit's id, name, RoVs and elements
module.exports.getUnit = async function (iri, lang) {

  let languageFilter = true;
  if (lang) {
    languageFilter = {
      where: {
        languageCode: lang,
      },
    };
  }

  let where = (isNaN(parseInt(iri))) ? {slug: iri} : {id: parseInt(iri)};

  const result = await prisma.unit.findUnique({
    where: where,
    select: {
      id: true,
      slug: true,
      name: true,
      notation: true,
      description: {
        select: {
          item: languageFilter,
        },
      },
      rov: {
        select: {
          id: true,
          min: true,
          max: true,
          unit: true,
        }
      },
      Element: {
        select: {
          id: true,
          accuracy: true,
          accuracyUnit: true,
          phenomena: {
            select: {
              id: true,
              slug: true,
              label: {
                select: {
                  item: languageFilter,
                },
              }
            }
          },
          sensor: {
            select: {
              id: true,
              slug: true,
              label: {
                select: {
                  item: languageFilter,
                }
              }
            }
          }
        }
      },
    },
  });

  return result;

}

//create new unit 
module.exports.createNewUnit = async function (unitForm, role) {
  console.log(unitForm);
  console.log(role);

  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    unitForm.validation = false;
  } else {
    unitForm.validation = true;
  }

  const descriptionTranslation = await prisma.translation.create({data: {}});
  if(unitForm.description) {
    const mappedDescription = [{
                                languageCode: 'en', 
                                text: unitForm.description.text, 
                                translationId: descriptionTranslation.id
                              }];
    const descriptions = await prisma.translationItem.createMany({data: mappedDescription})
  }

  const unitSlug = await helperFunctions.slugifyModified(unitForm.name);

  const unit = await prisma.unit.create({data: {
    slug: unitSlug,
    name: unitForm.name,
    notation: unitForm.notation,
    description: {
      connect:  {id: descriptionTranslation.id}
    },
    validation: unitForm.validation,
  }})

  return unit;
}

// edit existing unit
module.exports.editUnit = async function (unitForm, role) {
  console.log(unitForm);
  console.log(role);

  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    unitForm.validation = false;
  } else {
    unitForm.validation = true;
  }


  /////////// Description //////////////
  // update description text; if the whole text is deleted, description is set to an empty string
  const updateDescription = await prisma.translationItem.updateMany({
    where: {
      translationId: unitForm.description.translationId,
      languageCode: "en",
      // langageCode hardcoded, needs to be changed in schema that description is no longer a multi-language option
    },
    data: {
      text:  unitForm.description.text,
    }
  })


}

// delete existing unit
module.exports.deleteUnit = async function (unitForm, role) {
  console.log(unitForm);
  console.log(role);

  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    unitForm.validation = false;
  } else {
    unitForm.validation = true;
  }

  for (const element of unitForm.sensorElement) {
    const updateElement = await prisma.element.update({
      where: {
        id: element.sensorElementId
      },
      data: {
        unitId: 1
      }
    });
  }

  for (const rov of unitForm.rov) {
    const updateElement = await prisma.rangeOfValues.update({
      where: {
        id: rov.rovId
      },
      data: {
        unitId: 1
      }
    });
  }
  

  const deletetranslationItems = await prisma.translationItem.deleteMany({
    where: {
      translationId: {
        in: unitForm.translationIds,
      }
    }
  })

  const deletetranslations = await prisma.translation.deleteMany({
    where: {
      id: {
        in: unitForm.translationIds,
      }
    }
  })

  const deleteUnit = await prisma.unit.delete({
    where: {
      id: unitForm.id
    }
  });

}
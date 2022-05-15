const config = require('config');
const { phenomenon } = require('../lib/prisma');

// const Sensor = require('../models/Unit');
// const Sensors = require('../models/Units');

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
        name: true
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

  const result = await prisma.unit.findUnique({
    where: {
      id: parseInt(iri),
    },
    select: {
      id: true,
      name: true,
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
}

// edit existing unit
module.exports.editUnit = async function (unitForm, role) {
  console.log(unitForm);
  console.log(role);
}

// delete existing unit
module.exports.deleteUnit = async function (unitForm, role) {
  console.log(unitForm);
  console.log(role);
}
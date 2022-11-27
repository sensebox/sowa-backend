const prisma = require('../lib/prisma');


/**--------------Get all sensors that are part of a given device --------------- */
module.exports.getSensorsForDevice = function (iri) {
  var sensors = prisma.sensor.findMany({
    where: {
      devices: {
        id: {
          in: [ID],
        },
      },
    }
  });
  res.send("sensors");
}


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
      name: true,
      rov: true,
      Element: true
    }
  });

  return result;

}
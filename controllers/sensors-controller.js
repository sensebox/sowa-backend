const config = require('config');

const Sensor = require('../models/Sensor');
const Sensors = require('../models/Sensors');
const helperFunctions = require('../helper/helperFunctions');

const prisma = require('../lib/prisma');

/* ---------- All sensor funtions: -----------------*/

//get all sensors @returns iris and labels
module.exports.getSensors = async function (lang) {
  let languageFilter = true;
  if (lang) {
    languageFilter = {
      where: {
        languageCode: lang,
      },
    };
  }

  const result = await prisma.sensor.findMany({
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
      price: true,
      lifePeriod: true,
      manufacturer: true,
      validation: true,
    },
  });

  return result;
}




//get a single sensor identified by its iri @returns the sensor's labels, descriptions, datasheet, image, lifeperiod, manufacturer, price, phenomena it can measueres and accuracy values, devices it is part of
module.exports.getSensor = async function (iri, lang) {
  let languageFilter = true;
  if (lang) {
    languageFilter = {
      where: {
        languageCode: lang,
      },
    };
  }

  let where = (isNaN(parseInt(iri))) ? {slug: iri} : {id: parseInt(iri)};

  const result = await prisma.sensor.findUnique({
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
      elements: {
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
      devices: {
        select: {
          id: true,
          label: {
            select: {
              item: languageFilter
            }
          },
          validation: true,
        }
      },
      price: true,
      image: true,
      manufacturer: true,
      lifePeriod: true,
      datasheet: true,
      validation: true,
    },
  });

  return result;
}



module.exports.editSensor = async function (sensorForm, role) {

  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    sensorForm.validation = false;
  }

  console.log(sensorForm)

  /////////// Current sensor ////////////
  // retrive current phenomeonon with current attributes from database 
  const sensor = await prisma.sensor.findUnique({
    where: {
      id: sensorForm.id,
    }
  })

  
  //////////// Labels ////////////
  // delete, update or create labels
  sensorForm.deletedLabels.forEach( async (label) => {
    console.log(label.translationId)
    console.log(label.lang)
    const deleteLabel = await prisma.translationItem.deleteMany({
      where: {
        translationId: label.translationId,
        languageCode: label.lang,
      }
    })
  })


  sensorForm.label.forEach( async (label) => {
    if (label.translationId !== null) {
      const updateLabel = await prisma.translationItem.updateMany({
        where: {
          translationId: label.translationId,
          languageCode: label.lang
        },
        data:  {
          text: label.value
        }
      })
    } else if (label.translationId === null) {
      const createLabel = await prisma.translationItem.create({
        data: {
          translationId: sensor.labelId,
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
      translationId: sensorForm.description.translationId,
      languageCode: "en",
      // langageCode hardcoded, needs to be changed in schema that description is no longer a multi-language option
    },
    data: {
      text:  sensorForm.description.text,
    }
  })


  /////////// Sensor //////////////
  // update sensor values: image, manufacturer, price, lifeperiod, datasheet, validation
  const updateSensor = await prisma.sensor.update({
    where: {
      id: sensorForm.id,
    },
    data: {
      image: sensorForm.image,
      manufacturer: sensorForm.manufacturer,
      price: sensorForm.price,
      lifePeriod: sensorForm.lifeperiod,
      datasheet: sensorForm.datasheet,
      validation: sensorForm.validation,
    }
  })


  /////////// Devices //////////////
  // delete, update or create devices for editing
  sensorForm.deletedDevices.forEach( async (device) => {
    console.log(device.device)
    console.log(device.exists)
    if (device.exists === true) {
      const disconnectDevice = await prisma.sensor.update({
        where: {
          id: sensorForm.id
        },
        data: {
          devices: {
            disconnect: {
              id: device.device
            }
          }
        }
      })
    } 
  })

  sensorForm.device.forEach( async (device) => {
    if (device.exists === false) {
      const connectDevice = await prisma.sensor.update({
        where: {
          id: sensorForm.id
        },
        data: {
          devices: {
            connect: {
              id: device.device
            }
          }
        }
      })
    }
  })



  ////////// Phenomena/ SensorElements //////////////
  // delete, update or create sensorElements/phenomena for editing
  sensorForm.deletedSensorElements.forEach( async (sensorElement) => {
    console.log(sensorElement)
    const deleteSensorElement = await prisma.element.delete({
      where: {
        id: sensorElement.sensorElementId
      }
    })
  })

  sensorForm.sensorElement.forEach( async (sensorElement) => {
    console.log(sensorElement)
    if (sensorElement.sensorElementId !== null) {
      const updateSensorElement = await prisma.element.update({
        where: {
          id: sensorElement.sensorElementId
        },
        data: {
          accuracy: sensorElement.accuracyValue,
          unitId: sensorElement.unitId,
          phenomenonId: sensorElement.phenomenonId,
        }
      })
    }
    else if (sensorElement.sensorElementId === null) {
      const createSensorElement = await prisma.element.create({
        data: {
          accuracy: sensorElement.accuracyValue,
          unitId: sensorElement.unitId,
          sensorId: sensorForm.id,
          phenomenonId: sensorElement.phenomenonId
        }
      })
    }
  })
}

module.exports.deleteSensor = async function (sensorForm, role) {

  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    sensorForm.validation = false;
  }
  
  console.log(sensorForm)

  const deleteElements = await prisma.element.deleteMany({
    where: {
      sensorId: sensorForm.id,
    },
  });

  sensorForm.device.forEach( async (device) => {
    const disconnectDevices = await prisma.sensor.update({
      where: {
        id: sensorForm.id
      },
      data: {
        devices: {
          disconnect: {
            id: device.device
          }
        }
      }
    })
  })
  
  const deletetranslationItems = await prisma.translationItem.deleteMany({
    where: {
      translationId: {
        in: sensorForm.translationIds,
      }
    }
  })

  const deletetranslations = await prisma.translation.deleteMany({
    where: {
      id: {
        in: sensorForm.translationIds,
      }
    }
  })

  const deleteSensor = await prisma.sensor.delete({
    where: {
      id: sensorForm.id,
    }
  })
}


module.exports.createNewSensor = async function (sensorForm, role) {
  
  if (role != 'expert' && role != 'admin') {
    console.log("User has no verification rights!");
    sensorForm.validation = false;
  }

  console.log(sensorForm)

  const labelTranslation = await prisma.translation.create({data: {}})
  let devicesIds = null;
  if(sensorForm.device) {
    devicesIds = sensorForm.device.map(device => {return {"id": device.device}});
  }

  
  const descTranslation = await prisma.translation.create({data: {}})
  if(sensorForm.description) {
    const mappedDescription = [{languageCode: 'en', text: sensorForm.description.text, translationId: descTranslation.id}];
    const descriptions = await prisma.translationItem.createMany({data: mappedDescription})
  }


  if(sensorForm.label.length > 0) {
    const mappedLabel = sensorForm.label.map(label => {return {languageCode: label.lang, text: label.value, translationId: labelTranslation.id}});
    const labels = await prisma.translationItem.createMany({data: mappedLabel})
  }

  // generate slug from english label
  let sensorSlug;
  sensorForm.label.forEach(async (label) => {
    if (label.lang == 'en') {
      sensorSlug = await helperFunctions.slugifyModified(label.value);
    }  
  });

  const sensor = await prisma.sensor.create({ data: {
    slug: sensorSlug,
    label: {
      connect: {id: labelTranslation.id}
    },
    description: {
      connect: {id: descTranslation.id}
    },
    price: sensorForm.price,
    image: sensorForm.image,
    manufacturer: sensorForm.manufacturer,
    lifePeriod: sensorForm.lifePeriod,
    datasheet: sensorForm.datasheet,
    validation: sensorForm.validation,
    devices: {
      connect: devicesIds
    }
  }})

  if(sensorForm.sensorElement.length > 0) {
    const mappedElements = sensorForm.sensorElement.map(element => {return {
      phenomenonId: element.phenomenonId,
      accuracy: element.accuracyValue,
      unitId: element.unitId,
      sensorId: sensor.id
    }});
    const elements = await prisma.element.createMany({data: mappedElements})
  }

  return sensor;
  
}

module.exports.convertSensorToJson = function(sensor){
  return new Sensor(sensor);
}
module.exports.convertSensorsToJson = function (sensors){
  return sensors.map(sensor => new Sensors(sensor));
}

const config = require("config");
const Device = require("../models/Device");
const Devices = require("../models/Devices");
const helperFunctions = require('../helper/helperFunctions');
const prisma = require("../lib/prisma");

/* ---------- All device funtions: -----------------*/

//get all devices @returns iris and labels
module.exports.getDevices = async function (lang) {
  let languageFilter = true;
  if (lang) {
    languageFilter = {
      where: {
        languageCode: lang,
      },
    };
  }

  const result = await prisma.device.findMany({
    select: {
      id: true,
      slug: true,
      markdown: true,
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
      sensors: true,
      validation: true,
    },
  });

  return result;
};



//get a single device identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
module.exports.getDevice = async function (iri, lang) {
  let languageFilter = true;
  if (lang) {
    languageFilter = {
      where: {
        languageCode: lang,
      },
    };
  }

  let where = (isNaN(parseInt(iri))) ? {slug: iri} : {id: parseInt(iri)};

  const result = await prisma.device.findUnique({
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
      contact: true,
      website: true,
      image: true,
      sensors: {
        select: {
          id: true,
          slug: true,
          label: {
            select: {
              item: languageFilter,
            },
          },
          validation: true,
        },
      },
      validation: true,
    },
  });
  return result;
};




//edit a device
module.exports.editDevice = async function (deviceForm, role) {
  if (role != "expert" && role != "admin") {
    console.log("User has no verification rights!");
    deviceForm.validation = false;
  }

  console.log(deviceForm);

  /////////// Current device ////////////
  // retrive current phenomeonon with current attributes from database
  const device = await prisma.device.findUnique({
    where: {
      id: deviceForm.id,
    },
  });

  //////////// Labels ////////////
  // delete, update or create labels
  deviceForm.deletedLabels.forEach(async (label) => {
    console.log(label.translationId);
    console.log(label.lang);
    const deleteLabel = await prisma.translationItem.deleteMany({
      where: {
        translationId: label.translationId,
        languageCode: label.lang,
      },
    });
  });

  deviceForm.label.forEach(async (label) => {
    if (label.translationId !== null) {
      const updateLabel = await prisma.translationItem.updateMany({
        where: {
          translationId: label.translationId,
          languageCode: label.lang,
        },
        data: {
          text: label.value,
        },
      });
    } else if (label.translationId === null) {
      const createLabel = await prisma.translationItem.create({
        data: {
          translationId: device.labelId,
          text: label.value,
          languageCode: label.lang,
        },
      });
    }
  });

  /////////// Description //////////////
  // update description text; if the whole text is deleted, description is set to an empty string
  const updateDescription = await prisma.translationItem.updateMany({
    where: {
      translationId: deviceForm.description.translationId,
      languageCode: "en",
      // langageCode hardcoded, needs to be changed in schema that description is no longer a multi-language option
    },
    data: {
      text: deviceForm.description.text,
    },
  });

  /////////// Markdown //////////////
  // update markdown text; if the whole text is deleted, markdown is set to an empty string
  const updateMarkdown = await prisma.translationItem.updateMany({
    where: {
      translationId: deviceForm.markdown.translationId,
      languageCode: "en",
      // langageCode hardcoded, needs to be changed in schema that description is no longer a multi-language option
    },
    data: {
      text: deviceForm.markdown.text,
    },
  });

  /////////// Device //////////////
  // update device values: image, validation
  const updateDevice = await prisma.device.update({
    where: {
      id: deviceForm.id,
    },
    data: {
      contact: deviceForm.contact,
      website: deviceForm.website,
      image: deviceForm.image,
      validation: deviceForm.validation,
    },
  });

  /////////// Sensors //////////////
  // delete, update or create sensors of devices
  deviceForm.deletedSensors.forEach(async (sensor) => {
    console.log(sensor.sensor);
    console.log(sensor.exists);
    if (sensor.exists === true) {
      const disconnectSensor = await prisma.sensor.update({
        where: {
          id: sensor.sensor,
        },
        data: {
          devices: {
            disconnect: {
              id: deviceForm.id,
            },
          },
        },
      });
    }
  });

  deviceForm.sensor.forEach(async (sensor) => {
    if (sensor.exists === false) {
      const connectDevice = await prisma.sensor.update({
        where: {
          id: sensor.sensor,
        },
        data: {
          devices: {
            connect: {
              id: deviceForm.id,
            },
          },
        },
      });
    }
  });
};

module.exports.deleteDevice = async function (deviceForm, role) {
  if (role != "expert" && role != "admin") {
    console.log("User has no verification rights!");
    deviceForm.validation = false;
  }

  console.log(deviceForm);

  deviceForm.sensor.forEach(async (sensor) => {
    const disconnectDevice = await prisma.sensor.update({
      where: {
        id: sensor.sensor,
      },
      data: {
        devices: {
          disconnect: {
            id: deviceForm.id,
          },
        },
      },
    });
  });

  const deletetranslationItems = await prisma.translationItem.deleteMany({
    where: {
      translationId: {
        in: deviceForm.translationIds,
      },
    },
  });

  const deletetranslations = await prisma.translation.deleteMany({
    where: {
      id: {
        in: deviceForm.translationIds,
      },
    },
  });

  const deleteDevice = await prisma.device.delete({
    where: {
      id: deviceForm.id,
    },
  });
};



//create new device
module.exports.createNewDevice = async function (deviceForm, role) {
  if (role != "expert" && role != "admin") {
    console.log("User has no verification rights!");
    deviceForm.validation = false;
  }
  console.log(deviceForm);

  const labelTranslation = await prisma.translation.create({data: {}})
  let sensorIds = null;
  if(deviceForm.sensor) {
    sensorIds = deviceForm.sensor.map(sensor => {return {"id": sensor.sensor}});
  }
  console.log("SENSORIDS", sensorIds)


  // map and create labels
  if(deviceForm.label.length > 0) {
    const mappedLabel = deviceForm.label.map(label => {return {languageCode: label.lang, text: label.value, translationId: labelTranslation.id}});
    const labels = await prisma.translationItem.createMany({data: mappedLabel})
  }

  // map and create description
  const descTranslation = await prisma.translation.create({data: {}})
  if(deviceForm.description) {
    const mappedDescription = [{languageCode: 'en', text: deviceForm.description.text, translationId: descTranslation.id}];
    const descriptions = await prisma.translationItem.createMany({data: mappedDescription})
  }

  // map and create markdown
  const markdownTranslation = await prisma.translation.create({data: {}})
  if(deviceForm.markdown) {
    const mappedMarkdown = [{languageCode: 'en', text: deviceForm.markdown.text, translationId: markdownTranslation.id}];
    const markdowns = await prisma.translationItem.createMany({data: mappedMarkdown})
  }

  // generate slug from english label
  let deviceSlug;
  deviceForm.label.forEach(async (label) => {
    if (label.lang == 'en') {
      deviceSlug = await helperFunctions.slugifyModified(label.value);
    }  
  });

  // create device
  const device = await prisma.device.create({ data: {
    slug: deviceSlug,
    label: {
      connect: {id: labelTranslation.id}
    },
    description: {
      connect: {id: descTranslation.id}
    },
    markdown: {
      connect: {id: markdownTranslation.id}
    },
    website: deviceForm.website,
    contact: deviceForm.contact,
    validation: deviceForm.validation,
    image: deviceForm.image,
    sensors: {
      connect: sensorIds
    }
  }})

  return device;
};

module.exports.convertDeviceToJson = function (device) {
  return new Device(device);
};
module.exports.convertDevicesToJson = function (devices) {
  return devices.map((dev) => new Devices(dev));
};

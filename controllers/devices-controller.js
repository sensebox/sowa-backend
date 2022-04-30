const config = require("config");
const Device = require("../models/Device");
const Devices = require("../models/Devices");

const prisma = require("../lib/prisma");
const { getSensorsForPhenomenon } = require("./sensors-controller");

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

  // const result = await prisma.device.findMany({
  //   select: {
  //     markdown: true,
  //     label: {
  //       select: {
  //         item: {
  //           where: {
  //             languageCode: lang || {contains : ''}
  //           }
  //         },
  //       },
  //     },
  //     description: {
  //       select: {
  //         item: {
  //           select: {
  //             text: true,
  //             language: {
  //               select: {
  //                 code: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     sensors: true,
  //     validation: true,
  //   }
  // });

  return result;
};

//get history of a device
module.exports.getDeviceHistory = function (iri) {
  var senphurl = "http://sensors.wiki/SENPH#";
  var bindingsText = `
  SELECT ?device ?dateTime ?user
                    WHERE {
                      ?device rdf:type s:device.
                      OPTIONAL{
                        ?device s:editDate ?dateTime
                      }
                      OPTIONAL{
                        ?device s:editBy ?user
                      }   
                      FILTER(regex(str(?device), ?iri, "i" ))
                    }`;
  return historyClient
    .query(bindingsText)
    .bind("iri", senphurl + iri + "_")
    .execute()
    .then((res) => {
      console.log(res.results.bindings);
      return res.results.bindings;
    })
    .catch(function (error) {
      console.dir(arguments, { depth: null });
      console.log("Oh no, error!");
      console.log(error);
    });
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

  const result = await prisma.device.findUnique({
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
      markdown: {
        select: {
          item: languageFilter,
        },
      },
      image: true,
      sensors: {
        select: {
          id: true,
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

//get a single historic device version identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
module.exports.getHistoricDevice = function (iri) {
  var senphurl = "http://sensors.wiki/SENPH#";

  return historyClient
    .query(
      SPARQL`
    Select Distinct ?label ?description ?website ?image ?contact ?sensor ?sensorLabel ?validation
                     WHERE {
                        {
                            ${{ s: iri }} rdfs:label ?label
                        }
                        UNION 
                        {   
                            ${{ s: iri }} rdfs:comment ?description
                        }
                        UNION
                        {
                            ${{ s: iri }} s:website ?website.
                        }  
                        UNION
                        {
                            ${{ s: iri }} s:image ?image.
                        } 
                        UNION
                        {
                            ${{ s: iri }} s:hasContact ?contact.
                        }   
                        UNION
                        {
                            ${{ s: iri }} s:hasSensor ?sensor.
                        }   
                        UNION
                        {
                            ${{ s: iri }} s:isValid ?validation.
                        }  
                     }
                Group BY ?label ?description ?website ?image ?contact ?sensor ?sensorLabel ?validation
                ORDER BY ?sensor
          `
    )
    .execute()
    .then((res) => {
      console.log(res);
      res.results.bindings.push({
        iri: {
          type: "uri",
          value: senphurl + iri,
        },
      });
      console.log(res.results.bindings);
      return res.results.bindings;
    })
    .catch(function (error) {
      console.dir(arguments, { depth: null });
      console.log("Oh no, error!");
      console.log(error);
    });
};

module.exports.getSensorsOfDevice = function (iri) {
  var senphurl = "http://sensors.wiki/SENPH#";
  console.log("IRI", iri);
  return client
    .query(
      SPARQL`
                     SELECT ?sensor ?label ?description ?sensorElement ?image
                     WHERE {
                        ?sensor s:isSensorOf ${{ s: iri }}.
                        ?sensor rdfs:label ?label.
                        ?sensor rdfs:comment ?description.
                        ?sensor s:hasElement ?sensorElement.
                        ?sensor s:image ?image.
                    }`
    )
    .execute({ format: { resource: "sensor" } })
    .then(async (res) => {
      let mappedRes = [];
      for (let binding of res.results.bindings) {
        let allsensorElement = [];
        if (binding.sensorElement) {
          for (let sensorElement of binding.sensorElement) {
            let sensorElementValue = await this.getSensorElement(
              sensorElement.value
            );
            sensorElementValue.forEach((value) => {
              if (value) {
                let sensorElement = {
                  phenomenon: value.phenomenon.value,
                  unit: value.unit.value,
                  acc: value.accuracy ? value.accuracy.value : undefined,
                };
                allsensorElement.push(sensorElement);
              }
            });
          }
          binding.sensorElement = allsensorElement;
        }
        mappedRes.push(binding);
      }
      return mappedRes;
    })
    .catch(function (error) {
      console.dir(arguments, { depth: null });
      console.log("Oh no, error!");
      console.log(error);
    });
};

//TODO: maybe move this function to sensors
module.exports.getAllSensorsOfAllDevices = function () {
  var senphurl = "http://sensors.wiki/SENPH#";
  return client
    .query(
      SPARQL`
                     SELECT ?sensor ?label ?description ?sensorElement ?image
                     WHERE {
                        ?sensor rdf:type s:sensor.
                        ?sensor rdfs:label ?label.
                        ?sensor rdfs:comment ?description.
                        ?sensor s:hasElement ?sensorElement.
                        ?sensor s:image ?image.
                    }`
    )
    .execute({ format: { resource: "sensor" } })
    .then(async (res) => {
      let mappedRes = [];
      for (let binding of res.results.bindings) {
        let allsensorElement = [];
        if (binding.sensorElement) {
          for (let sensorElement of binding.sensorElement) {
            let sensorElementValue = await this.getSensorElement(
              sensorElement.value
            );
            sensorElementValue.forEach((value) => {
              if (value) {
                let sensorElement = {
                  phenomenon: value.phenomenon.value,
                  unit: value.unit.value,
                  acc: value.accuracy ? value.accuracy.value : undefined,
                };
                allsensorElement.push(sensorElement);
              }
            });
          }
          binding.sensorElement = allsensorElement;
        }
        mappedRes.push(binding);
      }
      return mappedRes;
    })
    .catch(function (error) {
      console.dir(arguments, { depth: null });
      console.log("Oh no, error!");
      console.log(error);
    });
};

module.exports.getSensorElement = function (iri) {
  console.log(iri);
  //still missing: ?domains rdfs:label ?domainsLabel.
  // var senphurl = 'http://sensors.wiki/SENPH#';

  var bindingsText = `
  Select Distinct ?phenomenon ?unit ?accuracy
                   WHERE {   
                    ?iri s:canMeasure ?phenomenon.
                    ?iri s:hasAccuracyUnit ?unit.
                    ?iri s:accuracyValue ?accVal.
                   }
        `;
  return client
    .query(bindingsText)
    .bind({ iri: { value: iri, type: "uri" } })
    .execute()
    .then((res) => {
      console.log("BINDINGS", res.results.bindings);
      return res.results.bindings;
    })
    .catch(function (error) {
      console.dir(arguments, { depth: null });
      console.log("Oh no, error!");
      console.log(error);
    });
};

// //update/add a new device @inputs required: label + language, description + language; optional: website, image, contact, compatible sensor
// module.exports.updateDevice = function (device) {
//   var senphurl = 'http://sensors.wiki/SENPH#';
//   console.log(device);
//   var bindingsText = 'INSERT DATA {' +
//     '?deviceURI rdf:type     s:device.' +
//     '?deviceURI rdfs:label   ?deviceLabel. ' +
//     '?deviceURI rdfs:comment ?desc.' +
//     (device.website ? '?deviceURI s:website ?website.' : '') +
//     (device.image ? '?deviceURI s:image ?image.' : '') +
//     (device.contact ? '?deviceURI s:hasContact ?contact.' : '') +
//     (device.sensor ? '?deviceURI s:hasSensor ?sensor.' : '') +
//     '}';
//   return client
//     .query(bindingsText)
//     .bind({
//       deviceURI: { value: senphurl + device.uri, type: 'uri' },
//       deviceLabel: { value: device.name.label, lang: device.name.lang },
//       desc: { value: device.description.comment, lang: device.description.lang },
//       website: { value: device.website, type: 'string' },
//       image: { value: device.image, type: 'string' },
//       contact: { value: device.contact, type: 'string' },
//       sensor: { value: senphurl + device.sensor, type: 'uri' }
//     })
//     .execute()
//     .then(Promise.resolve(console.log("everthing ok")))
//     .catch(function (error) {
//       console.log(error);
//     });
// }

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

  // var senphurl = 'http://sensors.wiki/SENPH#';
  // console.log(device);
  // if (role != 'expert' && role != 'admin') {
  //   console.log("User has no verification rights!");
  //   device.validation = false;
  // }
  // // create SPARQL Query:
  // var bindingsText = 'DELETE {?a ?b ?c}' +
  //   'INSERT {' +
  //   '?deviceURI rdf:type     s:device.' +
  //   '?deviceURI rdfs:comment ?desc.' +
  //   '?deviceURI s:website ?website.' +
  //   '?deviceURI s:image ?image.' +
  //   '?deviceURI s:hasContact ?contact.' +
  //   '?deviceURI s:isValid ?validation.' +
  //   '?deviceURI s:markdown ?markdown.';

  // // create insert ;line for each sensor
  // device.sensor.forEach(element => {
  //   var string = '?deviceURI s:hasSensor s:' + element.sensorUri.slice(senphurl.length) + '. ';
  //   bindingsText = bindingsText.concat(string)
  // });
  // device.label.forEach(element => {
  //   bindingsText = bindingsText.concat(
  //     '?deviceURI rdfs:label ' + JSON.stringify(element.value) + '@' + element.lang + '. '
  //   );
  // });
  // // add WHERE statement
  // bindingsText = bindingsText.concat('} WHERE {?a ?b ?c. FILTER (?a = ?deviceURI || ?c = ?deviceURI)}');
  // console.log(bindingsText);
  // return client
  //   .query(bindingsText)
  //   // bind values to variable names
  //   .bind({
  //     deviceURI: { value: senphurl + device.uri, type: 'uri' },
  //     // +++ FIXME +++ language hardcoded, make it dynamic
  //     desc: { value: device.description, lang: "en" },
  //     website: device.website,
  //     image: { value: device.image, type: 'string' },
  //     contact: device.contact,
  //     validation: { value: device.validation, type: 'boolean' },
  //     markdown: {value: device.markdown, type: 'string'}
  //   })
  //   .execute()
};

module.exports.deleteDevice = async function (deviceForm, role) {
  if (role != "expert" && role != "admin") {
    console.log("User has no verification rights!");
    deviceForm.validation = false;
  }

  console.log(deviceForm);

  deviceForm.sensor.forEach(async (sensor) => {
    const disconnectDevice = prisma.sensor.update({
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

//create new version of a device in history db
module.exports.createHistoryDevice = function (device, user) {
  var date = Date.now();
  device["dateTime"] = date;
  var isoDate = new Date(date).toISOString();
  // console.log(device);
  // console.log(isoDate);
  if (user.role != "expert" && user.role != "admin") {
    console.log("User has no verification rights!");
    device.validation = false;
  }
  var senphurl = "http://sensors.wiki/SENPH#";

  // create SPARQL Query:
  var bindingsText =
    "INSERT DATA {" +
    "?deviceURI rdf:type     s:device." +
    "?deviceURI rdfs:comment ?desc." +
    "?deviceURI s:website ?website." +
    "?deviceURI s:image ?image." +
    "?deviceURI s:hasContact ?contact." +
    "?deviceURI s:isValid ?validation." +
    "?deviceURI s:editDate ?dateTime." +
    "?deviceURI s:editBy ?userName.";

  // create insert ;line for each sensor
  device.sensor.forEach((element) => {
    var string =
      "?deviceURI s:hasSensor s:" +
      element.sensorUri.slice(senphurl.length) +
      ". ";
    bindingsText = bindingsText.concat(string);
  });
  device.label.forEach((element) => {
    bindingsText = bindingsText.concat(
      "?deviceURI rdfs:label " +
        JSON.stringify(element.value) +
        "@" +
        element.lang +
        ". "
    );
  });
  // add WHERE statement
  bindingsText = bindingsText.concat("}");
  console.log(bindingsText);

  return (
    historyClient
      .query(bindingsText)
      // bind values to variable names
      .bind({
        deviceURI: {
          value: senphurl + device.uri + "_" + device.dateTime,
          type: "uri",
        },
        // +++ FIXME +++ language hardcoded, make it dynamic
        desc: { value: device.description, lang: "en" },
        website: device.website,
        image: device.image,
        contact: device.contact,
        validation: { value: device.validation, type: "boolean" },
        dateTime: {
          value: isoDate,
          type: "http://www.w3.org/2001/XMLSchema#dateTime",
        },
        userName: user.name,
      })
      .execute()
  );
};

//create new device
module.exports.createNewDevice = async function (deviceForm, role) {
  if (role != "expert" && role != "admin") {
    console.log("User has no verification rights!");
    deviceForm.validation = false;
  }
  console.log(deviceForm);

  const labelTranslation = await prisma.translation.create({data: {}})
  const descTranslation = await prisma.translation.create({data: {}})
  let sensorIds = null;
  if(deviceForm.sensor) {
    sensorIds = deviceForm.sensor.map(sensor => {return {"id": sensor.sensor}});
  }
  console.log("SENSORIDS", sensorIds)

  if(deviceForm.label.length > 0) {
    const mappedLabel = deviceForm.label.map(label => {return {languageCode: label.lang, text: label.value, translationId: labelTranslation.id}});
    const labels = await prisma.translationItem.createMany({data: mappedLabel})
  }

  const device = await prisma.device.create({ data: {
    label: {
      connect: {id: labelTranslation.id}
    },
    website: deviceForm.website,
    contact: deviceForm.contact,
    validation: deviceForm.validation,
    image: deviceForm.image,
    sensors: {
      connect: sensorIds
    }
  }})

  // if(sensor.sensorElement.length > 0) {
  //   const mappedElements = sensor.sensorElement.map(element => {return {
  //     phenomenonId: element.phenomenon,
  //     accuracy: element.accuracyValue,
  //     unitId: element.unitOfAccuracy,
  //     sensorId: sensorItem.id
  //   }});
  //   const elements = await prisma.element.createMany({data: mappedElements})
  // }

  return device;
};

module.exports.convertDeviceToJson = function (device) {
  return new Device(device);
};
module.exports.convertDevicesToJson = function (devices) {
  return devices.map((dev) => new Devices(dev));
};

// //get a single device identified by its iri @returns the device's labels, descriptions, website, image, contact and compatible sensors
// module.exports.addDevice = function (device) {
//   var senphurl = 'http://sensors.wiki/SENPH#';
//   console.log(device);

//   // create SPARQL Query:
//   'INSERT {' +
//     '?deviceURI rdf:type     s:device.' +
//     '?deviceURI rdfs:label   ?deviceLabel. ' +
//     '?deviceURI rdfs:comment ?desc.' +
//     (device.website ? '?deviceURI s:website ?website.' : '') +
//     (device.image ? '?deviceURI s:image ?image.' : '') +
//     (device.contact ? '?deviceURI s:hasContact ?contact.' : '');
//   // create insert ;line for each sensor
//   device.sensor.forEach(element => {
//     var string = '?deviceURI s:hasSensor s:' + element.sensorUri.slice(senphurl.length) + '. ';
//     bindingsText = bindingsText.concat(string)
//   });
//   // add WHERE statement
//   bindingsText = bindingsText.concat('}');
//   console.log(bindingsText);
//   return client
//     .query(bindingsText)
//     // bind values to variable names
//     .bind({
//       deviceURI: { value: senphurl + device.uri, type: 'uri' },
//       // +++ FIXME +++ language hardcoded, make it dynamic
//       deviceLabel: { value: device.name, lang: "en" },
//       // +++ FIXME +++ language hardcoded, make it dynamic
//       desc: { value: device.description, lang: "en" },
//       website: { value: device.website, type: 'string' },
//       image: { value: device.image, type: 'string' },
//       contact: { value: device.contact, type: 'string' },
//     })
//     .execute()
//     .then(Promise.resolve(console.log("evertyhing ok")))
//     .catch(function (error) {
//       console.log(error);
//     });
// }

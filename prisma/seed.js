const PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient();

const languageData = require('./seeds/language.json')
const deviceData = require('./seeds/device.json')
const translationData = require('./seeds/translation.json')
const translationItemData = require('./seeds/translationItem.json')
const sensorData = require('./seeds/sensor.json');
const phenomenonData = require('./seeds/phenomenon.json');
const unitData = require('./seeds/unit.json');
const elementData = require('./seeds/element.json');
const rovData = require('./seeds/rov.json');
const domainData = require('./seeds/domain.json');

async function main() {
  console.log("Start seeding ...");

  for (const u of languageData) {
    const language = await prisma.language.upsert({
      where: {
          code: u.code
      }, update: {
          code: u.code
      }, create: u
    })
    console.log(`Created language with code: ${language.code}`)
  }
  for (const u of translationData) {
    const translation = await prisma.translation.upsert({
      where: {
        id: u.id
      },
      update: {
        ...u,
      },
      create: u
    })
    console.log(`Created translation with id: ${translation.id}`)
  }

  for (const u of translationItemData) {
    const translationItem = await prisma.translationItem.upsert({
      where: {
        translationId_languageCode: {
          translationId: u.translationId,
          languageCode: u.languageCode
        }
      },
      update: {
        ...u
      },
      create: u
    });
    console.log(`Created translationItem with id: ${translationItem.id}`)
  }

  for (const u of deviceData) {
    const device = await prisma.device.upsert({
      where: {
        id: u.id,
      },
      update: {
        ...u
      },
      create: u,
    });
    console.log(`Created device with id: ${device.id}`)
  }

  for (const u of sensorData) {
    const {id, deviceConnectId, ...rest} = u;
    const device = await prisma.sensor.upsert({
      where: {
        id: id,
      },
      create: {
        manufacturer: rest.manufacturer,
        lifePeriod: rest.lifePeriod,
        devices: {
          connect: {
            id: deviceConnectId,
          },
        },
      },
      update: {
        manufacturer: rest.manufacturer,
        lifePeriod: rest.lifePeriod,
        devices: {
          connect: {
            id: deviceConnectId,
          },
        },
      },
    });
    console.log(`Created sensor with id: ${device.id}`);
  }

  for (const u of phenomenonData) {
    const device = await prisma.phenomenon.upsert({
      where: {
        id: u.id,
      },
      update: {
        ...u
      },
      create: u,
    });
    console.log(`Created phenomenon with id: ${device.id}`);
  }

  for (const u of unitData) {
    const device = await prisma.unit.upsert({
      where: {
        id: u.id
      },
      update: {
        ...u
      },
      create: u
    });
    console.log(`Created unit with id: ${device.id}`);
  }

  for (const u of elementData) {
    const device = await prisma.element.upsert({
      where: {
        id: u.id,
      },
      update: {
        ...u
      },
      create: u,
    });
    console.log(`Created element with id: ${device.id}`);
  }

  for (const u of rovData) {
    const device = await prisma.rangeOfValues.upsert({
      where: {
        id: u.id
      },
      update: {
        ...u
      },
      create: u
    });
    console.log(`Created rov with id: ${device.id}`);
  }

  for (const u of domainData) {
    const { id, ...rest } = u;
    const device = await prisma.domain.upsert({
      where: {
        id: id
      },
      update: rest,
      create: rest
    });
    console.log(`Created domain with id: ${device.id}`);
  }


  console.log("Seeding finished.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
const PrismaClient = require('@prisma/client').PrismaClient;
const slugify = require('slugify')

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
const helperFunctions = require('../helper/helperFunctions');


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
    var labelEn = await prisma.translationItem.findMany({where: {translationId: u.labelId, languageCode: 'en'}})
    var slug = helperFunctions.slugifyModified(labelEn[0].text);
    const withSlug = {...u, slug: slug};
    const {id, ...rest} = withSlug;
    console.log(rest)

    const device = await prisma.device.upsert({
      where: {
        id: id,
      },
      update: {
        ...rest
      },
      create: rest,
    });
    console.log(`Created device with id: ${device.id}`)
  }

  for (const u of sensorData) {
    console.log(u.label.connect.id)
    var labelEn = await prisma.translationItem.findMany({where: {translationId: u.label.connect.id, languageCode: 'en'}})
    var slug = helperFunctions.slugifyModified(labelEn[0].text);
    const withSlug = {...u, slug: slug};
    const {id, ...rest} = withSlug;

    const sensor = await prisma.sensor.upsert({
      where: {
        id: id,
      },
      create: {
        ...rest
      },
      update: rest,
    });
    console.log(`Created sensor with id: ${sensor.id}`);
  }

  for (const u of phenomenonData) {
    var labelEn = await prisma.translationItem.findMany({where: {translationId: u.labelId, languageCode: 'en'}})
    var slug = helperFunctions.slugifyModified(labelEn[0].text);
    const withSlug = {...u, slug: slug};
    const {id, ...rest} = withSlug;

    const phenomenon = await prisma.phenomenon.upsert({
      where: {
        id: id,
      },
      update: {
        ...rest
      },
      create: rest,
    });
    console.log(`Created phenomenon with id: ${phenomenon.id}`);
  }

  for (const u of unitData) {

    var labelEn = u.name;
    var slug = helperFunctions.slugifyModified(labelEn);
    const withSlug = {...u, slug: slug};
    const {id, ...rest} = withSlug;

    const unit = await prisma.unit.upsert({
      where: {
        id: id
      },
      update: {
        ...rest
      },
      create: rest
    });
    console.log(`Created unit with id: ${unit.id}`);
  }

  for (const u of elementData) {
    const element = await prisma.element.upsert({
      where: {
        id: u.id,
      },
      update: {
        ...u
      },
      create: u,
    });
    console.log(`Created element with id: ${element.id}`);
  }

  for (const u of rovData) {
    const rov = await prisma.rangeOfValues.upsert({
      where: {
        id: u.id
      },
      update: {
        ...u
      },
      create: u
    });
    console.log(`Created rov with id: ${rov.id}`);
  }

  for (const u of domainData) {
    var labelEn = await prisma.translationItem.findMany({where: {translationId: u.label.connect.id, languageCode: 'en'}})
    var slug = helperFunctions.slugifyModified(labelEn[0].text);
    const withSlug = {...u, slug: slug};
    const { id, ...rest } = withSlug;

    const domain = await prisma.domain.upsert({
      where: {
        id: id
      },
      update: {
        ...rest,
      },
      create: rest
    });
    console.log(`Created domain with id: ${domain.id}`);
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
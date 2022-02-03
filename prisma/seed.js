const PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient();

const languageData = require('./seeds/language.json')
const deviceData = require('./seeds/device.json')
const translationData = require('./seeds/translation.json')
const translationItemData = require('./seeds/translationItem.json')

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
    const translation = await prisma.translation.create({
      data: u      
    })
    console.log(`Created translation with id: ${translation.id}`)
  }

  for (const u of translationItemData) {
    const translationItem = await prisma.translationItem.create({
      data: u      
    })
    console.log(`Created translationItem with id: ${translationItem.id}`)
  }

  for (const u of deviceData) {
    const device = await prisma.device.create({
      data: u      
    })
    console.log(`Created device with id: ${device.id}`)
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
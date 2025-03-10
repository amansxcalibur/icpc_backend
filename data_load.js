const fs = require("fs");
const Papa = require("papaparse");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath, "utf8");

    Papa.parse(fileContent, {
      header: true, // Treat the first row as headers
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
      error: (error) => reject(error),
    });
  });
}

async function seedDatabase() {
  try {
    console.log("Parsing CSV files...");
    
    const teams = await parseCSV("./public/data/teams.csv");
    for (const team of teams){
        const institution = await prisma.institution.upsert({
            where: { name: team.instName},
            update: {},
            create: {name: team.instName}
        });

        let coach = JSON.parse(team.Coach.replace(/'/g, '"'));
        const newCoach = await prisma.coach.create({
          data: { name: coach[0] }
       });
        console.log(coach[0])

        const newteam = await prisma.team.upsert({
          where: { id: JSON.parse(team.id) },
          update: {},
          create: {
              id: JSON.parse(team.id),
              name: team.name,
              institutionId: institution.id,
              isWomenOnly: team.isWomenOnly || false,
              coachId: newCoach.id
          }
        });

        console.log("team done")

        const teamContestants = JSON.parse((team.Contestants).replace(/'/g, '"'))

        for (const contestantName of teamContestants) {

          const newContestant = await prisma.contestant.create({
              data: { name: contestantName }
          });
  
          await prisma.teamMembers.upsert({
              where: { teamId_contestantId: { teamId: JSON.parse(team.id), contestantId: newContestant.id } },
              update: {},
              create: {
                  teamId: JSON.parse(team.id),
                  contestantId: newContestant.id
              }
          });
        }
        console.log("all done")
        console.log()
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();

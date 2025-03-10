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

async function seedTeamScores() {
  try {
    console.log("Parsing CSV file...");

    // Read selected teams' data (Selection Round)
    const entries = await parseCSV("./public/data/ICPC Selected Teams for Amritapuri Regionals 2024.csv");

    for (const entry of entries) {
      const teamId = parseInt(entry.teamId);
      if (isNaN(teamId)) {
        console.warn(`Skipping invalid teamId: ${entry.teamId}`);
        continue;
      }

      const team = await prisma.team.findUnique({ where: { id: teamId } });
      if (!team) {
        console.warn(`Skipping non-existent team: ${entry.teamName} (ID: ${teamId})`);
        continue;
      }

      const contest = await prisma.contest.findFirst({
        where: {
          year: 2024,
          type: "Selection Round",
          site: entry.site,
        },
      });

      if (!contest) {
        console.error(`No Selection Round contest found for site: ${entry.site}`);
        continue;
      }

      console.log(contest)

      await prisma.teamScores.upsert({
        where: {
          contestId_teamId: {contestId: contest.id, teamId: team.id}
        },
        update: {},
        create: {
          rank: null,
          contestId: JSON.parse(contest.id),
          teamId: JSON.parse(team.id),
          totalTime: null,
          problemsSolved: null,
          penalty: null,
        },
      });

      console.log(`Inserted ${team.name} into Selection Round at ${entry.site}`);
    }

    console.log("Selection Round team scores seeded successfully!");
  } catch (error) {
    console.error("Error inserting team scores:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTeamScores();

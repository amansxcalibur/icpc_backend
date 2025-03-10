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
    const entries = await parseCSV("./public/data/ICPC Amritapuri Regionals 2024 _ Final Ranklist.csv");

    for (const entry of entries) {
      const team = await prisma.team.findFirst({ where: { name: entry.teamName } });
      if (!team) {
        console.warn(`Skipping non-existent team: ${entry.teamName}`);
        continue;
      }

      // Fetch the selection round entry for the same team
      const selectionRoundEntry = await prisma.teamScores.findFirst({
        where: {
          teamId: team.id,
          contest: {
            year: 2024,
            type: "Selection Round",
          },
        },
        include: {
          contest: true, // Fetch the related contest to get the site
        },
      });

      if (!selectionRoundEntry) {
        console.warn(`Skipping team ${team.name}, no Selection Round entry found.`);
        continue;
      }

      const contest = await prisma.contest.findFirst({
        where: {
          year: 2024,
          type: "Final Round",
          site: selectionRoundEntry.contest.site, // Match the site
        },
      });

      if (!contest) {
        console.error(`No Final Round contest found for site: ${selectionRoundEntry.contest.site}`);
        continue;
      }

      await prisma.teamScores.upsert({
        where: {
          contestId_teamId: { contestId: contest.id, teamId: team.id },
        },
        update: {},
        create: {
          contestId: contest.id,
          teamId: team.id,
          rank: parseInt(entry.rank) || null,
          totalTime: entry.totalTime || "00:00:00",
          problemsSolved: parseInt(entry.problemsSolved) || 0,
          penalty: parseInt(entry.penalty) || 0,
        },
      });

      console.log(`Inserted ${team.name} into Final Round with site: ${contest.site}`);
    }

    console.log("Final Round team scores seeded successfully!");
  } catch (error) {
    console.error("Error inserting team scores:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTeamScores();
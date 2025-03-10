const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// import prisma from "./client.js";

async function initializeContests() {
  try {
    const sites = ["Bengaluru", "Coimbatore", "Kollam"];

    for (const site of sites) {
      await prisma.contest.create({
        data: {
          year: 2024,
          type: "Selection Round",
          site: site,
        },
      });

      await prisma.contest.create({
        data: {
          year: 2024,
          type: "Final Round",
          site: site,
        },
      });

      console.log(`Inserted contests at ${site}`);
    }

    console.log("All contests initialized!");
  } catch (error) {
    console.error("Error initializing contests:", error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeContests();

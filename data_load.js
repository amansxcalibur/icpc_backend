const fs = require("fs");
const Papa = require("papaparse");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Function to parse CSV file using PapaParse
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
    // console.log("here you go ",teams);
    //institutes
    for (const team of teams){
        const institution = await prisma.institution.upsert({
            where: { name: team.instName},
            update: {},
            create: {name: team.instName}
        });

        // let coach = team.Coach;
        // coach = coach.replace(/'/g, '"')
        // coach = JSON.parse(coach)
        // for (const ncoach of coach){ console.log(ncoach, coach, coach[0])}
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
              coachId: newCoach.id // Link the team to the coach
          }
        });

        console.log("team done")

        const teamContestants = JSON.parse((team.Contestants).replace(/'/g, '"'))

        for (const contestantName of teamContestants) {
          // Upsert Contestant
          const newContestant = await prisma.contestant.create({
              data: { name: contestantName }
          });
  
          // Create TeamMembers entry
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
        // console.log("her",{id: team.id,
        //   name: team.name,
        //   institutionId: institution.id,
        //   isWomenOnly: team.isWomenOnly==undefined?false:true})
        
        // let teamContestants = team.Contestants;
        // teamContestants = teamContestants.replace(/'/g, '"')
        // teamContestants = JSON.parse(teamContestants)
        // for (const contestant of teamContestants){
        //   console.log(contestant,",")
        //   // add to contestant table
        //   // add to TeamMembers table
        //   const newContestant = await prisma.Contestants.upsert();
        //   const newTeamMember = await prisma.teamMembers.upsert();
        // }
        console.log()

        

    }
    // const contests = await parseCSV("contests.csv");
    // const teamContests = await parseCSV("team_contests.csv");

    // console.log("Inserting Institutions...");
    // for (const team of teams) {
    //   await prisma.institution.upsert({
    //     where: { name: team.institution },
    //     update: {},
    //     create: { name: team.institution },
    //   });
    // }

    // console.log("Inserting Teams...");
    // for (const team of teams) {
    //   const institution = await prisma.institution.findUnique({
    //     where: { name: team.institution },
    //   });

    //   await prisma.team.upsert({
    //     where: { id: team.teamId },
    //     update: {},
    //     create: {
    //       id: team.teamId,
    //       name: team.teamName,
    //       institutionId: institution.id,
    //       isWomenOnly: team.isWomanOnly.toLowerCase() === "true", // Convert string to boolean
    //     },
    //   });
    // }

    // console.log("Inserting Contests...");
    // for (const contest of contests) {
    //   await prisma.contest.upsert({
    //     where: { id: parseInt(contest.id) },
    //     update: {},
    //     create: {
    //       id: parseInt(contest.id),
    //       year: parseInt(contest.year),
    //       type: contest.type,
    //       site: contest.site,
    //     },
    //   });
    // }

    // console.log("Inserting Team-Contest Relationships...");
    // for (const tc of teamContests) {
    //   await prisma.teamContest.create({
    //     data: {
    //       contestId: parseInt(tc.contestId),
    //       teamId: tc.teamId,
    //       finalScore: tc.finalScore ? parseFloat(tc.finalScore) : null,
    //     },
    //   });
    // }

    // console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();

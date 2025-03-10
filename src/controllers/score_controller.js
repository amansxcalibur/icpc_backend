const prisma = require("../services/client");

// expects http://localhost:5000/api/scores/final-ranklist?year=2024&type=Final%20Round

const getFinalRanklist = async (req, res) => {
  try {
    const { year, type } = req.query;

    if (!year || !type) {
      return res.status(400).json({ error: "Missing year or type parameter" });
    }

    // many contest in a year(diff sites)
    const contests = await prisma.contest.findMany({
      where: {
        year: parseInt(year),
        type: type,
      },
    });

    if (contests.length === 0) {
      return res.status(404).json({ error: "No contests found" });
    }

    const contestIds = contests.map(contest => contest.id);

    const teamScores = await prisma.teamScores.findMany({
      where: { contestId: { in: contestIds } },
      include: {
        team: {
          select: { name: true, institution: { select: { name: true } } },
        },
        contest: { select: { site: true } },
      },
      orderBy: [{ rank: "asc" }],
    });

    return res.json(teamScores);
  } catch (error) {
    console.error("Error fetching final ranklist:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getFinalRanklist };

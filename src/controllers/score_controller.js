const prisma = require("../services/client");

// expects http://localhost:5000/api/scores/final-ranklist?year=2024&type=Final%20Round

async function getFinalRanklist(req, res) {
    try {
        const { year, type } = req.query;
        if (!year || !type) {
            return res.status(400).json({ error: "Year and type are required" });
        }

        const contest = await prisma.contest.findFirst({
            where: { year: parseInt(year), type },
        });

        if (!contest) {
            return res.status(404).json({ error: "Contest not found" });
        }

        const teamScores = await prisma.teamScores.findMany({
            where: { contestId: contest.id },
            include: {
                team: {
                    select: { name: true, institution: { select: { name: true } } },
                },
            },
            orderBy: { rank: "asc" },
        });

        return res.json({ contest, teamScores });
    } catch (error) {
        console.error("Error fetching final ranklist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { getFinalRanklist };

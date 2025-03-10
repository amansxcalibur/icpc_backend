// import { PrismaClient } from "@prisma/client";

// let prisma = new PrismaClient();

// export default prisma;

const { PrismaClient } = require('@prisma/client')
let prisma = new PrismaClient();
module.exports = prisma;
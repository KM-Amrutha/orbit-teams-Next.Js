import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter,
});


//Databse helper function

export async function checkDatabaseConnection() : Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    // console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw false;
  } 
}
import {Role} from '@prisma/client';
import { hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";


async function main() {
    console.log("Seeding database...");
    // Create teams
    const teams = await Promise.all([
        prisma.team.create({
            data: {
                name: "engineering",
                description:"software developement team",
                code: "ENG-2026",
            },
        }),
        prisma.team.create({
            data: {
                name: "Marketing",
                description: "Marketing and sales team",
                code: "MKT-2026",
            },
        }),
          prisma.team.create({
            data: {
                name: "Operation",
                description: "Bussiness operations team",
                code: "OPS-2026",
            },
        }),
    ]);
    // create sample users 
    const sampleUsers =[
        {
            name:"John developer",
            email:"john.developer@example.com",
            team: teams[0],
            role:Role.MANAGER,
        },
        {
            name:"Jane  Designer",
            email:"jane.designer@example.com",
            team: teams[0],
            role:Role.USER,
        },
        {
            name:"Bob marketer",
            email:"bob.marketer@example.com",
            team: teams[1],
            role:Role.MANAGER,   
        },
        {
            name:"Alice sales",
            email:"alice.sales@example.com",
            team: teams[1],
            role:Role.USER,   
        }
    ];
    for (const userData of sampleUsers){
        await prisma.user.create({
            data: {
                email: userData.email,
                 name: userData.name,
                 password: await hashPassword("123456"), // Hash the password before storing 
                 role: userData.role,  
                teamId: userData.team.id,  
            }
        });
    }
    console.log("Database seeding completed successfully.");
}

main()
    .catch((e) => {
        console.error("Seeding failed",e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
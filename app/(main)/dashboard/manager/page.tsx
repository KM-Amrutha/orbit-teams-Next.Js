import ManagerDashboard from "@/app/components/dashboard/ManagerDashboard";
import { checkUserPermission,getCurrentUser } from "@/app/lib/auth";
import {prisma} from "@/app/lib/db"
import { transformUsers } from "@/app/lib/util";
import {Role, User} from "@/app/types";
import { redirect } from "next/navigation";

const ManagerPage = async ()=>{
    const user = await getCurrentUser();
    if(!user || !checkUserPermission(user,Role.MANAGER)){
        redirect("/unauthorized");
    }

    // fetch managers own team members

    const prismaMyTeamMembers = user.teamId ?
   await prisma.user.findMany({
        where:{
            teamId:user.teamId,
            role:{ not:Role.ADMIN}
        },
    
        include:{
            team:true
        },
    }):[];

    // Fetch All team mebers( cross-team view - exclude sensitive fileds)
    const prismaAllTeamMembers = await prisma.user.findMany({
          where:{
            role:{not:Role.ADMIN}
          },
          include:{
            team:{
                select:{
                    id:true,
                    name:true,
                    code:true,
                    description:true
                }
            },
        },
            orderBy:{
                teamId:"desc"
            }
        
    })
    const myTeamMembers = transformUsers(prismaMyTeamMembers);
    const allTeamMembers = transformUsers(prismaAllTeamMembers);
    
return (
     <ManagerDashboard
      myTeamMembers={myTeamMembers as User[]} 
      allTeamMembers={allTeamMembers as User[]} 
      currentUser = {user} 
      />
    );
};

export default ManagerPage;
import { getCurrentUser } from "@/app/lib/auth";
import {redirect} from "next/navigation";
import {Role} from "@/app/types"

const DashboardLayout = async()=>{
const user = await getCurrentUser();

if(!user){
    redirect("/login")
}
// redirect based on role
switch(user.role){


    case Role.ADMIN:
     redirect("/dashboard/admin");
     case Role.MANAGER:
     redirect("/dashboard/manager");
     case Role.USER:
     redirect("/dashboard/user");
    default:
    redirect("/dashboard/user")
}


};

export default DashboardLayout
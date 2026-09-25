import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
    try{
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "You are not authenticated." }, { status: 401 });
        }
        return NextResponse.json({ user });

    } catch (error) {
        console.error("error in me", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }


}

import { generateToken, verifyPassword } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';


export async function POST (request: NextRequest) {
    try {
        const { email, password } = await request.json();
        // validate required fileds
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' }, 
                { status: 400 });
        }
        // existing user check
        const userFromDb = await prisma.user.findUnique({
            where: { email },
            include: { team: true }
        }); 
        
      if(!userFromDb){
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const isValidPassword = await verifyPassword(password, userFromDb.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

// generate Token for user
  const token = generateToken(userFromDb.id);
    const response = NextResponse.json({
        user:{
            id: userFromDb.id,
            name: userFromDb.name,
            email: userFromDb.email,
            role: userFromDb.role,
            teamId: userFromDb.teamId,
            team: userFromDb.team,
            token,
        }

        });
        // set cookie 
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
     return response;


    } catch(error){
        console.error('Login Failed', error);
        return NextResponse.json(
            { error: 'Internal server error', message: 'Something went wrong' },
            { status: 500 }
        );
    }

}
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './db';
import { User, Role } from '../types';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
}

export const generateToken = (userId: string): string => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  return token;
}

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };    
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export const getCurrentUser = async ():Promise<User | null> => {
try{
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      if (!token) return null;

      const decode = verifyToken(token);
      
      const userFormDb = await prisma.user.findUnique({
        where: {
          id: decode?.userId,}
    });
    if(!userFormDb) return null;
    const {password, ...user} = userFormDb;
    return user as User;

}
 catch(error){
  console.error('Error fetching current user:', error);
  return null;

}
}

export const checkUserPermission = (user:User,requiredRole:Role) :boolean =>{
   const roleHirearchy = {
    [Role.GUEST]: 0,
    [Role.USER]: 1,
    [Role.MANAGER]: 2,
    [Role.ADMIN]: 3,
  };    
  return roleHirearchy[user.role] >= roleHirearchy[requiredRole];
   }


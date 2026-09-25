SELECT id,
       email,
       password,
       name,
       role,
       "teamId",
       "createdAt",
       "updatedAt"
FROM public.users
LIMIT 1000;
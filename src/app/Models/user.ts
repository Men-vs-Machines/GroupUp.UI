import {z} from 'zod';

export const UserSchema = z.object({ 
  displayName: z.string(),
  password: z.string().min(6),
  wishList: z.array(z.string()).optional(),
  id: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;
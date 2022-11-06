import {User, UserSchema} from "./user";
import {z} from 'zod';

export const GroupSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  users: z.array(UserSchema).optional()
});

export type Group = z.infer<typeof GroupSchema>;

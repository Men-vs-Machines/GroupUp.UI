import { z} from 'zod';

export const GroupSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  userIds: z.array(z.string()).optional()
});

export type Group = z.infer<typeof GroupSchema>;

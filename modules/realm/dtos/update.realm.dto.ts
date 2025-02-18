import { z } from 'zod';

export const UpdateRealmDtoSchema = z.object({
  id: z.string(), 
  name: z.string().min(1, "Name is required"), 
  description: z.string().nullable(),  
});

export type UpdateRealmDto = z.infer<typeof UpdateRealmDtoSchema>;

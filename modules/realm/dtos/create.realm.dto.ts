import { z } from 'zod';

export const CreateRealmDtoSchema = z.object({
  name: z.string().min(1, "Name is required"),  
  description: z.string().min(1, "Description cannot be empty"), 
});

export type CreateRealmDto = z.infer<typeof CreateRealmDtoSchema>;

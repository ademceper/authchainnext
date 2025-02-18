import { z } from 'zod';

export const RealmResultDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RealmResultDto = z.infer<typeof RealmResultDtoSchema>;

import { z } from "zod";

export const RealmUpdateRequest = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  realmType: z.string().optional(),
  updatedBy: z.string().optional(),
  expiresAt: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().optional()
  ),
  metadata: z.unknown().optional(),
  isActive: z.boolean().optional(),
});

export type RealmUpdateRequestType = z.infer<typeof RealmUpdateRequest>;

import { z } from "zod";

export const RealmCreateRequest = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().optional(),
  realmType: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  expiresAt: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().optional()
  ),
  isActive: z.boolean().default(true),
});


export type RealmCreateRequestType = z.infer<typeof RealmCreateRequest>;

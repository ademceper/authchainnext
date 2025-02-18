import { z } from 'zod';

export const UpdateClientDtoSchema = z.object({
  id: z.string(), 
  clientId: z.string().min(1, "Client ID is required"), 
  clientSecret: z.string().min(1, "Client Secret is required"),
  redirectUris: z.array(z.string().url()).min(1, "At least one redirect URI is required"),
  grantTypes: z.array(z.enum(["AUTHORIZATION_CODE", "CLIENT_CREDENTIALS", "PASSWORD", "IMPLICIT"])).min(1, "At least one grant type is required"), 
  responseTypes: z.array(z.enum(["code", "token", "id_token"])).min(1, "At least one response type is required"), 
  pkceRequired: z.boolean().default(true), 
  realmId: z.string().min(1, "Realm ID is required"), 
});

export type UpdateClientDto = z.infer<typeof UpdateClientDtoSchema>;

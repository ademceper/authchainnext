import { z } from 'zod';

export const ClientResultDtoSchema = z.object({
  id: z.string(), 
  clientId: z.string(), 
  clientSecret: z.string(), 
  redirectUris: z.array(z.string().url()), 
  grantTypes: z.array(z.enum(["authorization_code", "client_credentials", "password", "implicit"])), 
  responseTypes: z.array(z.enum(["code", "token", "id_token"])), 
  pkceRequired: z.boolean(), 
  createdAt: z.date(),
  updatedAt: z.date(), 
  realmId: z.string(), 
  realm: z.object({ 
    id: z.string(), 
    name: z.string(),
    description: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(), 
  }),
  consent: z.array(z.object({ 
    userId: z.string(),
    consentDate: z.date(),
  })),
  authorizedUsers: z.array(z.object({ 
    userId: z.string(), 
    userEmail: z.string().email(), 
  })),
  accessTokens: z.array(z.object({ 
    tokenId: z.string(), 
    issuedAt: z.date(),
    expiresAt: z.date(),
  })),
  idTokens: z.array(z.object({ 
    tokenId: z.string(), 
    issuedAt: z.date(), 
    expiresAt: z.date(), 
  })),
});

export type ClientResultDto = z.infer<typeof ClientResultDtoSchema>;

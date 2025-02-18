import { prisma } from "@/prisma/prismaClient";
import { CreateClientDto } from "./dtos/create.client.dto";
import { UpdateClientDto } from "./dtos/update.client.dto";
import { ClientResultDtoSchema } from "./dtos/client.result.dto"; 

export class ClientService {
  static async getAllClients() {
    const clients = await prisma.client.findMany();
    const clientDtos = clients.map((client) => ClientResultDtoSchema.parse(client));
    return clientDtos;
  }

  static async getClientById(id: string) {
    const client = await prisma.client.findUnique({
      where: { id: id },
    });
    if (!client) throw new Error("Client not found");
    return ClientResultDtoSchema.parse(client);
  }

  static async createClient(data: CreateClientDto) {
    try {
      await prisma.client.create({
        data: {
          clientId: data.clientId,
          clientSecret: data.clientSecret,
          redirectUris: data.redirectUris,
          grantTypes: data.grantTypes,
          responseTypes: data.responseTypes,
          pkceRequired: data.pkceRequired,
          realmId: data.realmId,
        },
      });

      return { success: true, message: "Client created successfully." }; 
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Creation failed: ${error.message}`);
      }
      throw new Error("An unknown error occurred during creation.");
    }
  }

  static async updateClient(data: UpdateClientDto) {
    try {
      await prisma.client.update({
        where: { id: data.id },
        data: {
          clientId: data.clientId,
          clientSecret: data.clientSecret,
          redirectUris: data.redirectUris,
          grantTypes: data.grantTypes,
          responseTypes: data.responseTypes,
          pkceRequired: data.pkceRequired,
        },
      });

      return { success: true, message: "Client updated successfully." }; 
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Update failed: ${error.message}`);
      }
      throw new Error("An unknown error occurred during update.");
    }
  }

  static async deleteClient(id: string) {
    const client = await prisma.client.findUnique({ where: { id: id } });
    if (!client) throw new Error("Client not found");
    await prisma.client.delete({ where: { id: id } });
    return { success: true, message: "Client deleted successfully." };
  }
}

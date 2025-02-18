import { CreateClientDto } from '@/modules/client/dtos/create.client.dto';
import { HttpService } from './httpService';
import { Client } from '@prisma/client';
import { UpdateClientDto } from '@/modules/client/dtos/update.client.dto';
import { ServiceError } from './httpService';

class ClientService {
  static async getAllClients(): Promise<Client[]> {
    try {
      const response = await HttpService.get<{ success: boolean, data: Client[] }>("/api/clients");
      if (response.success) {
        return response.data; 
      } else {
        throw new ServiceError(500, "Failed to fetch clients: API response was not successful.");
      }
    } catch (error) {
      if (error instanceof ServiceError) {
        console.error("Service error occurred while fetching clients:", error.message);
      } else {
        console.error("Failed to fetch clients:", error);
      }
      throw new ServiceError(500, "Could not load clients.");
    }
  }

  static async getClientById(id: string): Promise<Client> {
    try {
      const response = await HttpService.get<{ success: boolean, data: Client }>(`/api/client/${id}`);
      if (response.success) {
        return response.data; 
      } else {
        throw new ServiceError(500, `Failed to fetch client with id ${id}: API response was not successful.`);
      }
    } catch (error) {
      if (error instanceof ServiceError) {
        console.error(`Service error occurred while fetching client with id ${id}:`, error.message);
      } else {
        console.error(`Failed to fetch client with id ${id}:`, error);
      }
      throw new ServiceError(500, "Could not fetch client by id.");
    }
  }

  static async createClient(data: CreateClientDto): Promise<{ success: boolean, message: string }> {
    try {
      const response = await HttpService.post<{ success: boolean, message: string }>("/api/clients", data);
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new ServiceError(500, "Failed to create client: API response was not successful.");
      }
    } catch (error) {
      if (error instanceof ServiceError) {
        console.error("Service error occurred while creating client:", error.message);
      } else {
        console.error("Failed to create client:", error);
      }
      throw new ServiceError(500, "Could not create client.");
    }
  }

  static async updateClient(data: UpdateClientDto): Promise<{ success: boolean, message: string }> {
    try {
      const response = await HttpService.put<{ success: boolean, message: string }>(`/api/clients/${data.id}`, data);
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new ServiceError(500, `Failed to update client with id ${data.id}: API response was not successful.`);
      }
    } catch (error) {
      if (error instanceof ServiceError) {
        console.error(`Service error occurred while updating client with id ${data.id}:`, error.message);
      } else {
        console.error(`Failed to update client with id ${data.id}:`, error);
      }
      throw new ServiceError(500, "Could not update client.");
    }
  }

  static async deleteClient(id: string): Promise<{ success: boolean, message: string }> {
    try {
      const response = await HttpService.delete<{ success: boolean }>(`/api/clients/${id}`);
      if (response.success) {
        return { success: true, message: "Client deleted successfully." };
      } else {
        throw new ServiceError(500, `Failed to delete client with id ${id}: API response was not successful.`);
      }
    } catch (error) {
      if (error instanceof ServiceError) {
        console.error(`Service error occurred while deleting client with id ${id}:`, error.message);
      } else {
        console.error(`Failed to delete client with id ${id}:`, error);
      }
      throw new ServiceError(500, "Could not delete client.");
    }
  }
}

export { ClientService };

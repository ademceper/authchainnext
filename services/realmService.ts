import { CreateRealmDto } from '@/modules/realm/dtos/create.realm.dto';
import { HttpService } from './httpService';
import { Realm } from '@prisma/client';
import { UpdateRealmDto } from '@/modules/realm/dtos/update.realm.dto';
import { ServiceError } from './httpService';

class RealmService {
  static async getAllRealms(): Promise<Realm[]> {
    try {
      const response = await HttpService.get<{ success: boolean, data: Realm[] }>("/api/realms");
      if (response.success) {
        return response.data; 
      } else {
        throw new ServiceError(500, "Failed to fetch realms: API response was not successful.");
      }
    } catch (error) {
      if (error instanceof ServiceError) {
        console.error("Service error occurred while fetching realms:", error.message);
      } else {
        console.error("Failed to fetch realms:", error);
      }
      throw new ServiceError(500, "Could not load realms.");
    }
  }

  static async getRealmById(id: string): Promise<Realm> {
    try {
      const response = await HttpService.get<{ success: boolean, data: Realm }>(`/api/realms/${id}`);
      if (response.success) {
        return response.data; 
      } else {
        throw new ServiceError(500, `Failed to fetch realm with id ${id}: API response was not successful.`);
      }
    } catch (error) {
      if (error instanceof ServiceError) {
        console.error(`Service error occurred while fetching realm with id ${id}:`, error.message);
      } else {
        console.error(`Failed to fetch realm with id ${id}:`, error);
      }
      throw new ServiceError(500, "Could not fetch realm by id.");
    }
  }

  static async createRealm(data: CreateRealmDto): Promise<{ success: boolean, message: string }> {
    try {
      const response = await HttpService.post<{ success: boolean, message: string }>("/api/realms", data);
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new ServiceError(500, "Failed to create realm: API response was not successful.");
      }
    } catch (error) {
      if (error instanceof ServiceError) {
        console.error("Service error occurred while creating realm:", error.message);
      } else {
        console.error("Failed to create realm:", error);
      }
      throw new ServiceError(500, "Could not create realm.");
    }
  }

  static async updateRealm(data: UpdateRealmDto): Promise<{ success: boolean, message: string }> {
    try {
      const response = await HttpService.put<{ success: boolean, message: string }>(`/api/realms/${data.id}`, data);
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new ServiceError(500, `Failed to update realm with id ${data.id}: API response was not successful.`);
      }
    } catch (error) {
      if (error instanceof ServiceError) {
        console.error(`Service error occurred while updating realm with id ${data.id}:`, error.message);
      } else {
        console.error(`Failed to update realm with id ${data.id}:`, error);
      }
      throw new ServiceError(500, "Could not update realm.");
    }
  }

  static async deleteRealm(id: string): Promise<{ success: boolean, message: string }> {
    try {
      const response = await HttpService.delete<{ success: boolean }>(`/api/realms/${id}`);
      if (response.success) {
        return { success: true, message: "Realm deleted successfully." };
      } else {
        throw new ServiceError(500, `Failed to delete realm with id ${id}: API response was not successful.`);
      }
    } catch (error) {
      if (error instanceof ServiceError) {
        console.error(`Service error occurred while deleting realm with id ${id}:`, error.message);
      } else {
        console.error(`Failed to delete realm with id ${id}:`, error);
      }
      throw new ServiceError(500, "Could not delete realm.");
    }
  }
}

export { RealmService };

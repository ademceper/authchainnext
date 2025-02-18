import { prisma } from "@/prisma/prismaClient";
import { CreateRealmDto } from "./dtos/create.realm.dto";
import { UpdateRealmDto } from "./dtos/update.realm.dto";
import { RealmResultDtoSchema } from "./dtos/realm.result.dto";

export class RealmService {
  static async getAllRealms() {
    const realms = await prisma.realm.findMany();
    const realmDtos = realms.map((realm) => RealmResultDtoSchema.parse(realm));
    return realmDtos;
  }

  static async getRealmById(id: string) {
    const realm = await prisma.realm.findUnique({
      where: { id: id },
    });
    if (!realm) throw new Error("Realm not found");
    return RealmResultDtoSchema.parse(realm);
  }

  static async createRealm(data: CreateRealmDto) {
    try {
      await prisma.realm.create({
        data: {
          name: data.name,
          description: data.description,
        },
      });

      return { success: true, message: "Realm created successfully." }; 
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Creation failed: ${error.message}`);
      }
      throw new Error("An unknown error occurred during creation.");
    }
  }

  static async updateRealm(data: UpdateRealmDto) {
    try {
      await prisma.realm.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
        },
      });

      return { success: true, message: "Realm updated successfully." }; 
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Update failed: ${error.message}`);
      }
      throw new Error("An unknown error occurred during update.");
    }
  }

  static async deleteRealm(id: string) {
    const realm = await prisma.realm.findUnique({ where: { id: id } });
    if (!realm) throw new Error("Realm not found");
    await prisma.realm.delete({ where: { id: id } });
    return { success: true, message: "Realm deleted successfully." };
  }
}

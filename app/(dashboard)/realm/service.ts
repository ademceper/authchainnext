"use server"

import { Prisma, PrismaClient } from "@prisma/client";
import { RealmCreateRequest, RealmCreateRequestType } from "./models/realm.create.request";
import { RealmUpdateRequestType } from "./models/realm.update.request";
const prisma = new PrismaClient();

export async function getRealms(
  pagination: { page: number; limit: number },
  name?: string,
  isActive?: boolean,
  orderBy?: { field: keyof Prisma.RealmOrderByWithRelationInput; direction: 'asc' | 'desc' }
) {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;
  const take = limit;
  const whereCondition: Prisma.RealmWhereInput = {};

  if (name) {
    whereCondition.name = {
      contains: name,
      mode: 'insensitive',
    };
  }

  if (typeof isActive === 'boolean') {
    whereCondition.isActive = isActive;
  }

  const orderByCondition: Prisma.RealmOrderByWithRelationInput = {};

  if (orderBy) {
    orderByCondition[orderBy.field] = orderBy.direction;
  } else {
    orderByCondition.createdAt = 'desc'; 
  }

  const [realms, total] = await Promise.all([
    prisma.realm.findMany({
      where: whereCondition,
      skip,
      take,
      orderBy: orderByCondition, 
    }),
    prisma.realm.count({
      where: whereCondition,
    }),
  ]);


  return {
    items: realms,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getRealmById(id: string) {
  const realm = await prisma.realm.findUnique({
    where: { id },
  });
  if (!realm) throw new Error("Realm not found");
  return realm;
}

export async function createRealm(data: RealmCreateRequestType) {
  try {
    const validatedData = RealmCreateRequest.parse(data);
    const existingRealm = await prisma.realm.findUnique({
      where: { name: validatedData.name },
    });

    if (existingRealm) {
      return {
        success: false,
        message: "A realm with this name already exists. Please choose a different name.",
      };
    }

    await prisma.realm.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        realmType: validatedData.realmType,
        createdBy: validatedData.createdBy,
        updatedBy: validatedData.updatedBy,
        expiresAt: validatedData.expiresAt,
        isActive: validatedData.isActive,
      },
    });

    return { success: true, message: "Realm created successfully." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred.",
    };
  }
}

export async function updateRealm(data: RealmUpdateRequestType) {
  const { id, metadata, name, ...updateData } = data;

  if (name) {
    const existingRealm = await prisma.realm.findFirst({
      where: {
        name, 
        id: { not: id }, 
      },
    });

    if (existingRealm) {
      return {
        success: false,
        message: "This name is already in use by another realm. Please choose a different name.",
      };
    }
  }

  await prisma.realm.update({
    where: { id },
    data: {
      ...updateData,
      name, 
      metadata: metadata !== undefined ? (metadata as Prisma.InputJsonValue) : undefined,
    },
  });

  return { success: true, message: "Realm updated successfully." };
}

export async function deleteRealm(ids: string | string[], softDelete = false, isActive = false) {
  if (Array.isArray(ids)) {
    if (softDelete) {
      await prisma.realm.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false },
      });
      return { success: true, message: `${ids.length} realm(s) deactivated successfully.` };
    } else {
      await prisma.realm.deleteMany({
        where: { id: { in: ids } },
      });
      return { success: true, message: `${ids.length} realm(s) permanently deleted.` };
    }
  } else {
    if (softDelete) {
      await prisma.realm.update({
        where: { id: ids },
        data: { isActive: false },
      });
      if (isActive) {
        await prisma.realm.update({
          where: { id: ids },
          data: { isActive: true },
        });
        return { success: true, message: "Realm activated successfully." };
      }
      return { success: true, message: "Realm deactivated successfully." };
    } else {
      await prisma.realm.delete({
        where: { id: ids },
      });
      return { success: true, message: "Realm permanently deleted." };
    }
  }

}

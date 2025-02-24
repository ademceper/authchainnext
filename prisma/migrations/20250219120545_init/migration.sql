/*
  Warnings:

  - You are about to drop the column `realmId` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refreshToken]` on the table `OAuthToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activityType` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AuthorizationCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerEmail` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `OAuthToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grantType` to the `OAuthToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OAuthToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'USER', 'MODERATOR', 'GUEST');

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_realmId_fkey";

-- AlterTable
ALTER TABLE "AccessToken" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expirationReason" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "isRevoked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "activityType" TEXT NOT NULL,
ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "AuthorizationCode" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "isRevoked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "accessTokenLifetime" INTEGER NOT NULL DEFAULT 3600,
ADD COLUMN     "allowOfflineAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "allowedCorsOrigins" TEXT[],
ADD COLUMN     "allowedScopes" TEXT[],
ADD COLUMN     "authorizationEncryptedResponseAlg" TEXT,
ADD COLUMN     "authorizationSignedResponseAlg" TEXT,
ADD COLUMN     "backchannelLogoutSessionRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "backchannelLogoutUri" TEXT,
ADD COLUMN     "customClaims" JSONB,
ADD COLUMN     "defaultAcrValues" TEXT[],
ADD COLUMN     "description" TEXT,
ADD COLUMN     "deviceCodeLifetime" INTEGER NOT NULL DEFAULT 300,
ADD COLUMN     "enableAuthorizationCodeGrant" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableClientCredentialsGrant" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableDeviceCodeGrant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enableDynamicRegistration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enableImplicitGrant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enablePasswordGrant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enableRefreshTokenGrant" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableRefreshTokenRotation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enforceMTLS" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enforceSignedRequests" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "firstParty" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "idTokenEncryptedResponseAlg" TEXT,
ADD COLUMN     "idTokenLifetime" INTEGER NOT NULL DEFAULT 3600,
ADD COLUMN     "idTokenSignedResponseAlg" TEXT,
ADD COLUMN     "introspectionEncryptedResponseAlg" TEXT,
ADD COLUMN     "introspectionSignedResponseAlg" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "jwksUri" TEXT,
ADD COLUMN     "logoUri" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "ownerEmail" TEXT NOT NULL,
ADD COLUMN     "postLogoutRedirectUris" TEXT[],
ADD COLUMN     "refreshTokenLifetime" INTEGER NOT NULL DEFAULT 1209600,
ADD COLUMN     "requireClientSecret" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "requireConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requirePkceForPublicClients" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "requireProofKeyForCodeExchange" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sectorIdentifierUri" TEXT,
ADD COLUMN     "softwareId" TEXT,
ADD COLUMN     "softwareVersion" TEXT,
ADD COLUMN     "tokenEndpointAuthMethod" TEXT NOT NULL DEFAULT 'client_secret_basic',
ADD COLUMN     "trusted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trustedIssuer" TEXT,
ADD COLUMN     "userInfoEncryptedResponseAlg" TEXT,
ADD COLUMN     "userInfoSignedResponseAlg" TEXT;

-- AlterTable
ALTER TABLE "Consent" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "revoked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "IDToken" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expirationReason" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "isRevoked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "OAuthToken" ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "grantType" TEXT NOT NULL,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastUsedAt" TIMESTAMP(3),
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "revokedReason" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "realmId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Realm" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "realmType" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "isRevoked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastUsedAt" TIMESTAMP(3),
ADD COLUMN     "location" TEXT,
ADD COLUMN     "mfaMethod" TEXT,
ADD COLUMN     "mfaUsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "revokedReason" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastFailedLogin" TIMESTAMP(3),
ADD COLUMN     "lastLoginIp" TEXT,
ADD COLUMN     "lastLoginUserAgent" TEXT,
ADD COLUMN     "lockReason" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profileImageUrl" TEXT,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "realmId" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RolePermissions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RolePermissions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "_RolePermissions_B_index" ON "_RolePermissions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthToken_refreshToken_key" ON "OAuthToken"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "AuthorizationCode" ADD CONSTRAINT "AuthorizationCode_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolePermissions" ADD CONSTRAINT "_RolePermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolePermissions" ADD CONSTRAINT "_RolePermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

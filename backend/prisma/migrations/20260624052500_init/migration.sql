-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESPONDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ChatSender" AS ENUM ('CLIENT', 'LAWYER');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('BOOKED', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "state" TEXT,
    "language" TEXT NOT NULL DEFAULT 'English',
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "urgency" "Urgency" NOT NULL DEFAULT 'MEDIUM',
    "priorConsult" BOOLEAN NOT NULL DEFAULT false,
    "documents" TEXT,
    "status" "CaseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseNote" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "sender" "ChatSender" NOT NULL,
    "body" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slot" (
    "id" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "durationMin" INTEGER NOT NULL DEFAULT 15,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "reason" TEXT,
    "caseRef" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'BOOKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Case_reference_key" ON "Case"("reference");

-- CreateIndex
CREATE INDEX "Case_status_idx" ON "Case"("status");

-- CreateIndex
CREATE INDEX "Case_category_idx" ON "Case"("category");

-- CreateIndex
CREATE INDEX "Case_createdAt_idx" ON "Case"("createdAt");

-- CreateIndex
CREATE INDEX "CaseNote_caseId_idx" ON "CaseNote"("caseId");

-- CreateIndex
CREATE INDEX "ChatMessage_caseId_createdAt_idx" ON "ChatMessage"("caseId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_published_createdAt_idx" ON "BlogPost"("published", "createdAt");

-- CreateIndex
CREATE INDEX "Slot_startsAt_idx" ON "Slot"("startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_slotId_key" ON "Appointment"("slotId");

-- AddForeignKey
ALTER TABLE "CaseNote" ADD CONSTRAINT "CaseNote_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

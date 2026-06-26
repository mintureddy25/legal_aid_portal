/*
  Warnings:

  - You are about to drop the column `kind` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Feedback` table. All the data in the column will be lost.
  - Added the required column `serviceRating` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `websiteRating` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "kind",
DROP COLUMN "rating",
ADD COLUMN     "serviceRating" INTEGER NOT NULL,
ADD COLUMN     "websiteRating" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "FeedbackKind";

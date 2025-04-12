/*
  Warnings:

  - The primary key for the `Manager` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "board" DROP CONSTRAINT "board_manager_id_fkey";

-- AlterTable
ALTER TABLE "Manager" DROP CONSTRAINT "Manager_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Manager_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Manager_id_seq";

-- AlterTable
ALTER TABLE "board" ALTER COLUMN "manager_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "board" ADD CONSTRAINT "board_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Manager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

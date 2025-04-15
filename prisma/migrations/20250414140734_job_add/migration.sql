-- AlterTable
ALTER TABLE "board_files" ADD COLUMN     "job_id" INTEGER;

-- CreateIndex
CREATE INDEX "board_files_job_id_idx" ON "board_files"("job_id");

-- AddForeignKey
ALTER TABLE "board_files" ADD CONSTRAINT "board_files_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

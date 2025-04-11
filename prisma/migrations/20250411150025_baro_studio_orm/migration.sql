-- CreateTable
CREATE TABLE "Manager" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board" (
    "board_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notice_yn" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT,
    "manager_id" INTEGER NOT NULL,

    CONSTRAINT "board_pkey" PRIMARY KEY ("board_id")
);

-- CreateTable
CREATE TABLE "board_files" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "url" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "board_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "board_files_storagePath_key" ON "board_files"("storagePath");

-- CreateIndex
CREATE INDEX "board_files_post_id_idx" ON "board_files"("post_id");

-- AddForeignKey
ALTER TABLE "board" ADD CONSTRAINT "board_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Manager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_files" ADD CONSTRAINT "board_files_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "board"("board_id") ON DELETE CASCADE ON UPDATE CASCADE;

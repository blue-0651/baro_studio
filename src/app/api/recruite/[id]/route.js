import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

let supabaseAdmin;
if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

const EDITOR_IMAGE_BUCKET_NAME = "post-images";
const ATTACHMENT_BUCKET_NAME = "baro-studio";

export async function GET(request, context) {
  const { params } = context;
  const { id } = await params;

  try {
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "Invalid Job ID provided." },
        { status: 400 }
      );
    }

    const jobId = parseInt(id, 10);

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        files: {
          select: {
            id: true,
            filename: true,
            url: true,
            storagePath: true,
            uploadedAt: true,
            mimeType: true,
            sizeBytes: true,
          },
          orderBy: { uploadedAt: "asc" },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { message: "Job posting not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, context) {
  const { params } = context;
  const { id } = await params;
  const jobId = parseInt(id, 10);
  if (isNaN(jobId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Job ID provided." },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request format (JSON parsing failed).",
      },
      { status: 400 }
    );
  }

  const {
    title,
    experience,
    location,
    employmentType,
    deadline,
    isAlwaysRecruiting,
    content,
    newAttachments,
    deletedFileIds,
  } = body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return NextResponse.json(
      { success: false, message: "Job title is required." },
      { status: 400 }
    );
  }
  if (
    !experience ||
    typeof experience !== "string" ||
    experience.trim() === ""
  ) {
    return NextResponse.json(
      { success: false, message: "Experience level is required." },
      { status: 400 }
    );
  }
  if (!location || typeof location !== "string" || location.trim() === "") {
    return NextResponse.json(
      { success: false, message: "Location is required." },
      { status: 400 }
    );
  }
  if (
    !employmentType ||
    typeof employmentType !== "string" ||
    employmentType.trim() === ""
  ) {
    return NextResponse.json(
      { success: false, message: "Employment type is required." },
      { status: 400 }
    );
  }
  if (!isAlwaysRecruiting && !deadline) {
    return NextResponse.json(
      {
        success: false,
        message: "Please specify a deadline or select 'Always Recruiting'.",
      },
      { status: 400 }
    );
  }
  if (deadline && typeof deadline === "string") {
    try {
      if (isNaN(new Date(deadline).getTime())) throw new Error("Invalid date");
    } catch (dateError) {
      return NextResponse.json(
        { success: false, message: "Invalid deadline date format." },
        { status: 400 }
      );
    }
  } else if (deadline !== null) {
    if (!isAlwaysRecruiting) {
      return NextResponse.json(
        { success: false, message: "Invalid deadline date format." },
        { status: 400 }
      );
    }
  }

  if (deletedFileIds && deletedFileIds.length > 0 && !supabaseAdmin) {
    console.error(
      `[API PUT /api/recruite/${jobId}] Supabase Admin client missing for file deletion.`
    );
    return NextResponse.json(
      {
        success: false,
        message: "Server configuration error: Cannot process file deletions.",
      },
      { status: 500 }
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      if (
        deletedFileIds &&
        Array.isArray(deletedFileIds) &&
        deletedFileIds.length > 0
      ) {
        const numericDeletedFileIds = deletedFileIds
          .map(Number)
          .filter((id) => !isNaN(id));

        if (numericDeletedFileIds.length > 0) {
          const filesToDelete = await tx.file.findMany({
            where: {
              id: { in: numericDeletedFileIds },
              jobId: jobId,
            },
            select: { id: true, storagePath: true },
          });

          if (filesToDelete.length > 0) {
            const storagePathsToDelete = filesToDelete
              .map((f) => f.storagePath)
              .filter((path) => !!path);

            if (storagePathsToDelete.length > 0) {
              const { error: deleteError } = await supabaseAdmin.storage
                .from(ATTACHMENT_BUCKET_NAME)
                .remove(storagePathsToDelete);
              if (deleteError) {
                console.error(
                  `[API PUT /api/recruite/${jobId}] Storage file deletion error:`,
                  deleteError
                );
                throw new Error(
                  `Error deleting files from storage: ${deleteError.message}`
                );
              }
            }

            const idsToDeleteInDb = filesToDelete.map((f) => f.id);
            await tx.file.deleteMany({
              where: { id: { in: idsToDeleteInDb } },
            });
          }
        }
      }

      const updatedJob = await tx.job.update({
        where: { id: jobId },
        data: {
          title: title.trim(),
          experience: experience.trim(),
          location: location.trim(),
          employmentType: employmentType.trim(),
          deadline: deadline ? new Date(deadline) : null,
          isAlwaysRecruiting: isAlwaysRecruiting,
          content: content,
        },
      });

      if (
        newAttachments &&
        Array.isArray(newAttachments) &&
        newAttachments.length > 0
      ) {
        const attachmentData = newAttachments.map((file) => ({
          filename: file.filename,
          url: file.url,
          storagePath: file.storagePath,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
          jobId: jobId,
        }));
        await tx.file.createMany({ data: attachmentData });
      }

      return await tx.job.findUnique({
        where: { id: jobId },
        include: {
          files: {
            orderBy: { uploadedAt: "asc" },
          },
        },
      });
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    let message = "An unknown error occurred while updating the job posting.";
    let status = 500;

    if (error.code === "P2025") {
      message = "Job posting to update not found.";
      status = 404;
    } else if (error instanceof Error) {
      console.error(`[API PUT /api/recruite/${jobId}] Update error:`, error);
      message = error.message;
    } else {
      console.error(
        `[API PUT /api/recruite/${jobId}] Unknown update error:`,
        error
      );
    }

    return NextResponse.json(
      { success: false, message: message },
      { status: status }
    );
  }
}

export async function DELETE(request, context) {
  const { params } = context;
  const { id } = await params;
  const jobId = parseInt(id, 10);
  if (isNaN(jobId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Job ID provided." },
      { status: 400 }
    );
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Server configuration error: Cannot process file/image deletions.",
      },
      { status: 500 }
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      const jobToDelete = await tx.job.findUnique({
        where: { id: jobId },
        select: {
          content: true,
          files: {
            select: { storagePath: true },
          },
        },
      });

      if (!jobToDelete) {
        throw new Error("P2025");
      }

      const attachmentPaths = jobToDelete.files
        .map((f) => f.storagePath)
        .filter((path) => !!path);

      const editorImagePaths = [];
      if (jobToDelete.content && supabaseUrl) {
        const storageBaseUrl = `${supabaseUrl}/storage/v1/object/public/${EDITOR_IMAGE_BUCKET_NAME}/`;
        const regex = new RegExp(
          `<img[^>]+src=["']${storageBaseUrl.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}([^"']+)["'][^>]*>`,
          "gi"
        );
        let match;
        while ((match = regex.exec(jobToDelete.content)) !== null) {
          if (match[1]) {
            editorImagePaths.push(match[1]);
          }
        }
      }

      if (attachmentPaths.length > 0) {
        const { error: attachmentDeleteError } = await supabaseAdmin.storage
          .from(ATTACHMENT_BUCKET_NAME)
          .remove(attachmentPaths);
        if (attachmentDeleteError) {
          console.error(
            `[API DELETE /api/recruite/${jobId}] Attachment deletion error:`,
            attachmentDeleteError
          );
          throw new Error(
            `Error deleting attachments from storage: ${attachmentDeleteError.message}`
          );
        }
      }

      if (editorImagePaths.length > 0) {
        const { error: editorImageDeleteError } = await supabaseAdmin.storage
          .from(EDITOR_IMAGE_BUCKET_NAME)
          .remove(editorImagePaths);
        if (editorImageDeleteError) {
          console.error(
            `[API DELETE /api/recruite/${jobId}] Editor image deletion error:`,
            editorImageDeleteError
          );
          throw new Error(
            `Error deleting editor images from storage: ${editorImageDeleteError.message}`
          );
        }
      }

      await tx.job.delete({
        where: { id: jobId },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Job posting and associated files/images deleted successfully.",
    });
  } catch (error) {
    let message = "An unknown error occurred while deleting the job posting.";
    let status = 500;

    if (error.message === "P2025" || error.code === "P2025") {
      message = "Job posting to delete not found.";
      status = 404;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      { success: false, message: message },
      { status: status }
    );
  }
}

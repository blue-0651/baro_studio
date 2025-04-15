import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: [{ isNotice: "desc" }, { createdAt: "desc" }],
      select: {
        boardId: true,
        title: true,
        isNotice: true,
        createdAt: true,
        manager: {
          select: {
            id: true,
          },
        },
      },
    });

    const formattedPosts = posts.map((post, i) => ({
      ...post,
      no: i + 1,
    }));

    return NextResponse.json({
      success: true,
      data: formattedPosts,
    });
  } catch (error) {
    console.error("Error fetching board posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch board posts" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { title, content, isNotice, managerId, newAttachments } = body;

    if (!title || typeof isNotice === "undefined" || !managerId) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, isNotice, and manager ID are required",
        },
        { status: 400 }
      );
    }

    const managerExists = await prisma.manager.findUnique({
      where: { id: managerId },
    });
    if (!managerExists) {
      return NextResponse.json(
        { success: false, error: `Manager with id ${managerId} not found.` },
        { status: 400 }
      );
    }

    if (newAttachments && !Array.isArray(newAttachments)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid attachments format. Expected an array.",
        },
        { status: 400 }
      );
    }

    const postData = {
      title: title,
      content: content || null,
      isNotice: isNotice,
      managerId: managerId,
    };

    const result = await prisma.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: postData,
      });

      if (newAttachments && newAttachments.length > 0) {
        console.log(`Creating ${newAttachments.length} file records...`);

        const createFilePromises = newAttachments.map((fileData) =>
          tx.file.create({
            data: {
              filename: fileData.filename,
              storagePath: fileData.storagePath,
              url: fileData.url || null,
              mimeType: fileData.mimeType || null,
              sizeBytes: fileData.sizeBytes || null,
              postId: newPost.boardId,
            },
          })
        );
        const createdFiles = await Promise.all(createFilePromises);
        console.log("Files created:", createdFiles);
      }

      return newPost;
    });

    console.log("Transaction completed successfully. Result:", result);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error creating board post:", error);
    let errorMessage = "Failed to create board post";
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

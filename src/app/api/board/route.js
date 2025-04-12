import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: [{ isNotice: "desc" }, { createdAt: "desc" }],
      include: {
        manager: {
          select: {
            id: true,
          },
        },
        files: {
          select: {
            id: true,
            filename: true,
            url: true,
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

    if (!body.title || !body.managerId) {
      return NextResponse.json(
        { success: false, error: "Title and manager ID are required" },
        { status: 400 }
      );
    }

    const postData = {
      title: body.title,
      content: body.content || null,
      isNotice: body.isNotice || false,
      managerId: body.managerId,
    };

    const result = await prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: postData,
      });

      // 첨부파일이 있는 경우 처리
      //storage 이어보자
      /*
      if (body.files && Array.isArray(body.files) && body.files.length > 0) {
        const filePromises = body.files.map((file) =>
          tx.file.create({
            data: {
              filename: file.filename,
              storagePath: file.storagePath,
              url: file.url || null,
              mimeType: file.mimeType || null,
              sizeBytes: file.sizeBytes || null,
              postId: post.boardId,
            },
          })
        );

        await Promise.all(filePromises);
      }
    */
      return post;
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error creating board post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create board post" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

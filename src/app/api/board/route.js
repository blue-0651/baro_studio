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

    // <<< 프론트엔드에서 보낸 필드명(attachments) 사용
    const { title, content, isNotice, managerId, attachments } = body;

    // 필수 데이터 검증 (isNotice 는 false 일 수 있으므로 typeof 로 확인)
    if (!title || typeof isNotice === "undefined" || !managerId) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, isNotice, and manager ID are required",
        },
        { status: 400 }
      );
    }

    // managerId 존재 여부 확인 (선택적이지만 권장)
    const managerExists = await prisma.manager.findUnique({
      where: { id: managerId },
    });
    if (!managerExists) {
      return NextResponse.json(
        { success: false, error: `Manager with id ${managerId} not found.` },
        { status: 400 }
      );
    }

    // attachments 형식 검증 (선택적)
    if (attachments && !Array.isArray(attachments)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid attachments format. Expected an array.",
        },
        { status: 400 }
      );
    }

    console.log("Received post data in API:", {
      title,
      isNotice,
      managerId,
      attachments,
    });

    // 게시글 데이터 준비
    const postData = {
      title: title,
      content: content || null, // content가 없으면 null
      isNotice: isNotice,
      managerId: managerId,
    };

    // --- Prisma 트랜잭션 시작 ---
    const result = await prisma.$transaction(async (tx) => {
      // 1. 게시글 생성
      console.log("Creating post in transaction...");
      const newPost = await tx.post.create({
        data: postData,
      });
      console.log("Post created:", newPost);

      // 2. 첨부파일 정보가 있으면 File 레코드 생성 (주석 해제 및 수정)
      // <<< body.files 대신 attachments 사용
      if (attachments && attachments.length > 0) {
        console.log(`Creating ${attachments.length} file records...`);

        // map을 사용하여 각 첨부파일 데이터로 File 생성 Promise 배열 생성
        const createFilePromises = attachments.map((fileData) =>
          tx.file.create({
            data: {
              filename: fileData.filename,
              storagePath: fileData.storagePath, // Supabase 경로 저장
              url: fileData.url || null, // Public URL (선택적)
              mimeType: fileData.mimeType || null,
              sizeBytes: fileData.sizeBytes || null,
              postId: newPost.boardId, // <<< 생성된 게시글 ID 연결 (스키마 필드명 확인!)
            },
          })
        );
        // 모든 File 생성 Promise 실행
        const createdFiles = await Promise.all(createFilePromises);
        console.log("Files created:", createdFiles);

        // 생성된 게시글 정보와 파일 정보 함께 반환 (선택적)
        // 트랜잭션 결과는 마지막 작업의 결과 또는 명시적 return 값
        // 게시글과 파일 정보를 함께 반환하려면 아래처럼 구조화
        // 이 예제에서는 게시글 정보만 반환하도록 함 (필요에 따라 수정)
        // return { ...newPost, files: createdFiles };
      }

      // 트랜잭션의 최종 결과로 생성된 게시글 정보 반환
      return newPost;
    });
    // --- 트랜잭션 종료 ---

    console.log("Transaction completed successfully. Result:", result);

    // 성공 응답 반환 (트랜잭션 결과 또는 필요한 정보 포함)
    return NextResponse.json({
      success: true,
      data: result, // 트랜잭션에서 반환된 게시글 정보
    });
  } catch (error) {
    console.error("Error creating board post:", error);
    let errorMessage = "Failed to create board post";
    if (error instanceof Error) errorMessage = error.message;
    // Prisma 에러 등 추가 처리 가능
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

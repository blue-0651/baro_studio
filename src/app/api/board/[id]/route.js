import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient, SupabaseClient } from "@supabase/supabase-js"; // Supabase 클라이언트

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
let supabaseAdmin = null;
if (supabaseUrl && supabaseServiceKey) {
  // URL과 서비스 키가 모두 있을 때만 클라이언트 생성 시도
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
} else {
  console.error(
    "Supabase Admin Client 초기화 실패: URL 또는 Service Key가 환경 변수에 없습니다."
  );
}

const ATTACHMENT_BUCKET_NAME = "baro-studio";
const EDITOR_IMAGE_BUCKET_NAME = "post-images";

export async function GET(request, context) {
  const { params } = context;

  try {
    const resolvedParams = await params;

    if (!resolvedParams || typeof resolvedParams.id === "undefined") {
      return NextResponse.json(
        { message: "잘못된 요청 파라미터입니다." },
        { status: 400 }
      );
    }
    const { id } = resolvedParams;
    console.log("Extracted ID:", id);

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "유효하지 않은 게시물 ID입니다." },
        { status: 400 }
      );
    }

    const postId = parseInt(id, 10);

    const post = await prisma.post.findUnique({
      where: {
        boardId: postId,
      },
      include: {
        manager: {
          select: { id: true },
        },
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

    if (!post) {
      return NextResponse.json(
        { message: "게시물을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { message: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
export async function PUT(request, { params }) {
  const boardId = parseInt(params.id, 10);
  if (isNaN(boardId)) {
    console.log(`유효하지 않은 ID: ${params.id}`);
    return NextResponse.json(
      { success: false, message: "유효하지 않은 게시물 ID입니다." },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "잘못된 요청 형식입니다 (JSON 파싱 실패)." },
      { status: 400 }
    );
  }

  const { title, content, isNotice, newAttachments, deletedFileIds } = body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return NextResponse.json(
      { success: false, message: "제목을 입력해주세요." },
      { status: 400 }
    );
  }

  if (deletedFileIds && deletedFileIds.length > 0 && !supabaseAdmin) {
    return NextResponse.json(
      {
        success: false,
        message: "서버 설정 오류로 인해 파일 삭제를 처리할 수 없습니다.",
      },
      { status: 500 }
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 파일 삭제 처리
      if (
        deletedFileIds &&
        Array.isArray(deletedFileIds) &&
        deletedFileIds.length > 0
      ) {
        const filesToDelete = await tx.file.findMany({
          where: { id: { in: deletedFileIds.map(Number) }, postId: boardId },
          select: { id: true, storagePath: true, filename: true },
        });

        if (filesToDelete.length > 0) {
          const storagePathsToDelete = filesToDelete
            .map((f) => f.storagePath)
            .filter(Boolean);

          if (storagePathsToDelete.length > 0) {
            const { error: deleteError } = await supabaseAdmin.storage
              .from(ATTACHMENT_BUCKET_NAME)
              .remove(storagePathsToDelete);
            if (deleteError) {
              throw new Error(
                `스토리지 파일 삭제 중 오류 발생: ${deleteError.message}`
              );
            }
          }

          const idsToDeleteInDb = filesToDelete.map((f) => f.id);
          const deleteDbResult = await tx.file.deleteMany({
            where: { id: { in: idsToDeleteInDb } },
          });
        }
      }

      // 게시글 기본 정보 업데이트
      await tx.post.update({
        where: { boardId: boardId },
        data: {
          title: title.trim(),
          content: content,
          isNotice: isNotice,
        },
      });

      // 새로 추가된 첨부파일 정보 DB에 저장
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
          postId: boardId,
        }));
        await tx.file.createMany({ data: attachmentData });
      }

      //  트랜잭션의 최종 결과로 업데이트된 게시글 정보 반환
      return await tx.post.findUnique({
        where: { boardId: boardId },
        include: {
          files: { orderBy: { uploadedAt: "asc" } },
          manager: { select: { id: true } },
        },
      });
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "게시글 수정 중 알 수 없는 오류가 발생했습니다.";
    return NextResponse.json(
      { success: false, message: message },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  const boardId = parseInt(params.id, 10);
  if (isNaN(boardId)) {
    return NextResponse.json(
      { success: false, message: "유효하지 않은 게시물 ID입니다." },
      { status: 400 }
    );
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      {
        success: false,
        message: "서버 설정 오류로 파일 삭제를 처리할 수 없습니다.",
      },
      { status: 500 }
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      const postToDelete = await tx.post.findUnique({
        where: { boardId: boardId },
        select: {
          content: true,
          files: {
            select: { storagePath: true, filename: true },
          },
        },
      });

      if (!postToDelete) {
        throw new Error("P2025");
      }

      // 파일 경로 수집
      const attachmentPaths = postToDelete.files
        .map((f) => f.storagePath)
        .filter(Boolean);
      const editorImagePaths = [];

      // 2. 에디터 내용에서 이미지 경로 추출
      if (postToDelete.content && supabaseUrl) {
        // 스토리지 기본 URL 구성
        const storageBaseUrl = `${supabaseUrl}/storage/v1/object/public/${EDITOR_IMAGE_BUCKET_NAME}/`;
        // 정규식: <img src="스토리지기본URL(경로)" 형태 찾기, 경로는 그룹 1로 캡처
        // 정규식 내 특수문자 이스케이프 (\$&) 및 플래그(gi: 전역, 대소문자 무시) 사용
        const regex = new RegExp(
          `<img[^>]+src=["']${storageBaseUrl.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}([^"']+)["'][^>]*>`,
          "gi"
        );

        let match;
        while ((match = regex.exec(postToDelete.content)) !== null) {
          if (match[1]) {
            editorImagePaths.push(match[1]);
          }
        }
      }

      // 스토리지에서 첨부파일 삭제
      if (attachmentPaths.length > 0) {
        const { error: attachmentDeleteError } = await supabaseAdmin.storage
          .from(ATTACHMENT_BUCKET_NAME)
          .remove(attachmentPaths);
        if (attachmentDeleteError) {
          throw new Error(
            `첨부파일 스토리지 삭제 오류: ${attachmentDeleteError.message}`
          );
        }
      }

      // 스토리지에서 에디터 이미지 삭제
      if (editorImagePaths.length > 0) {
        const { error: editorImageDeleteError } = await supabaseAdmin.storage
          .from(EDITOR_IMAGE_BUCKET_NAME)
          .remove(editorImagePaths);
        if (editorImageDeleteError) {
          throw new Error(
            `에디터 이미지 스토리지 삭제 오류: ${editorImageDeleteError.message}`
          );
        }
        console.log(`[ID: ${boardId}] 에디터 이미지 스토리지 삭제 성공`);
      }

      await tx.post.delete({
        where: { boardId: boardId },
      });
    });

    console.log(`DELETE /api/board/${boardId} 성공`);
    return NextResponse.json({
      success: true,
      message: "게시글 및 관련 파일이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    if (error.message === "P2025" || error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "삭제할 게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    const message =
      error instanceof Error
        ? error.message
        : "게시글 삭제 중 알 수 없는 오류가 발생했습니다.";
    return NextResponse.json(
      { success: false, message: message },
      { status: 500 }
    );
  }
}

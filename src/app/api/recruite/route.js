import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: [{ createdAt: "desc" }],
    });

    const formattedJobs = jobs.map((job, i) => ({
      ...job,
      no: i + 1,
    }));

    return NextResponse.json({
      success: true,
      data: formattedJobs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch board jobs" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      title,
      experience,
      location,
      employmentType,
      deadline,
      isAlwaysRecruiting,
      content,
      newAttachments,
    } = body;

    if (
      !title ||
      !experience ||
      !location ||
      !employmentType ||
      typeof isAlwaysRecruiting === "undefined"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Title, experience, location, employment type, and always recruiting status are required.",
        },
        { status: 400 }
      );
    }

    if (!isAlwaysRecruiting && !deadline) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Either a deadline must be provided or 'Always Recruiting' must be true.",
        },
        { status: 400 }
      );
    }

    if (newAttachments && !Array.isArray(newAttachments)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid newAttachments format. Expected an array.",
        },
        { status: 400 }
      );
    }

    const jobData = {
      title: title.trim(),
      experience: experience.trim(),
      location: location.trim(),
      employmentType: employmentType.trim(),
      deadline: !isAlwaysRecruiting && deadline ? new Date(deadline) : null,
      isAlwaysRecruiting: isAlwaysRecruiting,
      content: content || null,
    };

    const result = await prisma.$transaction(async (tx) => {
      const newJob = await tx.job.create({
        data: jobData,
      });

      if (newAttachments && newAttachments.length > 0) {
        const fileCreationData = newAttachments.map((fileData) => ({
          filename: fileData.filename,
          storagePath: fileData.storagePath,
          url: fileData.url || null,
          mimeType: fileData.mimeType || null,
          sizeBytes: fileData.sizeBytes || null,
          jobId: newJob.id,
          postId: null,
        }));

        await tx.file.createMany({
          data: fileCreationData,
        });
      }

      return newJob;
    });

    return NextResponse.json({
      success: true,
      message: "Job posting created successfully.",
      jobId: result.id, // 새로 생성된 Job ID 반환
      data: result, // 필요 시 전체 Job 데이터 반환
    });
  } catch (error) {
    let errorMessage = "Failed to create job posting.";
    let statusCode = 500;

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  } finally {
    await prisma.$disconnect();
    console.log("Prisma client disconnected.");
  }
}

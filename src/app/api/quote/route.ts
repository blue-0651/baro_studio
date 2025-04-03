import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const selectedService = formData.get("selectedService") as string;
    const lastName = formData.get("lastName") as string;
    const firstName = formData.get("firstName") as string;
    const company = formData.get("company") as string;
    const email = formData.get("email") as string;
    const requestInfo = formData.get("requestInfo") as string;
    const files = formData.getAll("files") as File[];

    if (!selectedService || !lastName || !firstName || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    let attachments: Attachment[] = [];
    if (files && files.length > 0) {
      attachments = await Promise.all(
        files.map(async (file): Promise<Attachment> => {
          const buffer = await file.arrayBuffer();
          return {
            filename: file.name,
            content: Buffer.from(buffer),
            contentType: file.type,
          };
        })
      );
    }

    let fileDetailsText = "첨부파일 없음";
    if (files && files.length > 0) {
      fileDetailsText = files
        .map(
          (file) => `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
        )
        .join("\n");
    }

    const mailOptions = {
      from: `"내 프로젝트 이름" <${process.env.GMAIL_EMAIL}>`,
      to: process.env.QUOTE_RECIPIENT_EMAIL,
      subject: `[${company || ""}] 새로운 견적 요청`,
      html: `
                <h1>새로운 견적 요청</h1>
                <p><strong>선택 서비스 :</strong> ${selectedService}</p>
                <p><strong>성:</strong> ${lastName}</p>
                <p><strong>이름:</strong> ${firstName}</p>
                <p><strong>회사명:</strong> ${company}</p>
                <p><strong>이메일:</strong> ${email}</p>
                <p><strong>요청 사항:</strong></p>
                <pre>${requestInfo || "없음"}</pre>
                
            `,
      attachments: attachments,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Quote request submitted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    let errorMessage = "Failed to submit quote request.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Failed to submit quote request", error: errorMessage },
      { status: 500 }
    );
  }
}

/* get요청 사용할 수 도 있음
export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
*/

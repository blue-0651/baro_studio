import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const selectedService = formData.get("selectedService") as string;
    const serviceName = formData.get("serviceName") as string;
    const lastName = formData.get("lastName") as string;
    const firstName = formData.get("firstName") as string;
    const company = formData.get("company") as string;
    const email = formData.get("email") as string;
    const requestInfo = formData.get("requestInfo") as string || "추가 정보 없음";

    const uploadedFiles = formData.getAll("files") as File[];

    if (!selectedService || !lastName || !firstName || !email) {
      return NextResponse.json(
        { message: "필수 항목이 누락되었습니다" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let attachments: Attachment[] = [];

    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        attachments.push({
          filename: file.name,
          content: buffer,
          contentType: file.type || 'application/octet-stream'
        });
      }
    }

    let fileDetailsHTML = "<p><strong>첨부 파일:</strong> 없음</p>";

    if (uploadedFiles && uploadedFiles.length > 0) {
      fileDetailsHTML = `
        <p><strong>첨부 파일 (${uploadedFiles.length}):</strong></p>
        <ul>
          ${uploadedFiles.map(file =>
        `<li>${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</li>`
      ).join('')}
        </ul>
      `;
    }

    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: process.env.QUOTE_RECIPIENT_EMAIL || process.env.GMAIL_EMAIL,
      subject: `[${company}] 새로운 견적 요청 - ${serviceName || selectedService}`,
      html: `
      <div style="font-family: 'Arial', sans-serif; color: #333; max-width: 600px;">
        <h2 style="color: #4CAF50; border-bottom: 2px solid #eee; padding-bottom: 10px;">📩 견적 요청서</h2>

        <div style="margin-top: 20px;">
          <h3 style="color: #333;"> 요청 서비스 정보</h3>
          <p><strong>서비스명:</strong> ${serviceName || selectedService}</p>
        </div>

        <div style="margin-top: 20px;">
          <h3 style="color: #333;"> 고객 정보</h3>
          <p><strong>이름:</strong> ${lastName} ${firstName}</p>
          <p><strong>회사명:</strong> ${company || "없음"}</p>
          <p><strong>이메일:</strong> <a href="mailto:${email}">${email}</a></p>
        </div>

        <div style="margin-top: 20px;">
          <h3 style="color: #333;"> 요청 사항</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
            ${requestInfo.replace(/\n/g, '<br>')}
          </div>
        </div>

        <div style="margin-top: 20px;">
          <h3 style="color: #333;"> 첨부 파일</h3>
          ${uploadedFiles.length > 0 ? `
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 8px; background-color: #f0f0f0;">파일명</th>
                  <th style="text-align: left; padding: 8px; background-color: #f0f0f0;">크기</th>
                </tr>
              </thead>
              <tbody>
                ${uploadedFiles.map(file => `
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${file.name}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${(file.size / 1024 / 1024).toFixed(2)} MB</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : "<p>첨부 파일 없음</p>"}
        </div>

      </div>
    `,

      attachments: attachments,
    };

    const result = await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: "견적 요청이 성공적으로 제출되었습니다!",
        messageId: result.messageId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("요청 처리 중 오류:", error);

    let errorMessage = "견적 요청 제출에 실패했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
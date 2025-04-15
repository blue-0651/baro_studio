// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // TypeScript에서는 import 사용

// Prisma 클라이언트 인스턴스 생성
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding for updating admin password...`);

  const adminId: string = "baroAdmin"; // 업데이트할 관리자 ID (타입 명시)
  const plainPassword: string = "baro123"; // 업데이트할 새 비밀번호 (타입 명시)

  // --- 중요 보안 경고 ---
  // 실제 운영 환경에서는 훨씬 강력한 비밀번호를 사용하고,
  // 이 스크립트 실행 후에는 평문 비밀번호('baro123')를 코드에서 제거하세요.
  // --------------------

  try {
    // 1. 관리자 존재 확인 (선택 사항)
    const existingManager = await prisma.manager.findUnique({
      where: { id: adminId },
    });

    if (!existingManager) {
      console.error(
        `Error: Manager with id "${adminId}" not found. Cannot update password.`
      );
      // 필요시 생성 로직 추가
      // console.log(`Manager not found, creating one...`);
      // const hashedPasswordOnCreate = await bcrypt.hash(plainPassword, 10);
      // await prisma.manager.create({ data: { id: adminId, password: hashedPasswordOnCreate } });
      // console.log(`Manager "${adminId}" created.`);
      return;
    }
    console.log(`Found manager "${adminId}". Hashing new password...`);

    // 2. 새 비밀번호 해싱
    const saltRounds: number = 10; // 솔트 라운드 (타입 명시)
    const hashedPassword: string = await bcrypt.hash(plainPassword, saltRounds);
    console.log(`Password hashed successfully.`);

    // 3. 관리자 비밀번호 업데이트
    const updatedManager = await prisma.manager.update({
      where: { id: adminId },
      data: {
        password: hashedPassword, // 해시된 비밀번호로 업데이트
      },
    });
    console.log(
      `Password for manager "${updatedManager.id}" updated successfully.`
    );
  } catch (error) {
    console.error(
      `Error during seeding password update for "${adminId}":`,
      error
    );
    process.exit(1);
  } finally {
    // try/catch 블록과 관계없이 항상 실행됨
    await prisma.$disconnect();
    console.log("Prisma client disconnected after seeding.");
  }
}

// 스크립트 실행
main()
  .catch((e) => {
    console.error("Unhandled error in main seed execution:", e);
    process.exit(1);
  })
  .finally(async () => {
    // main 함수 내부의 finally에서 이미 처리하므로 여기서는 불필요할 수 있음
    // 하지만 안전을 위해 남겨둘 수 있음
    // await prisma.$disconnect();
  });

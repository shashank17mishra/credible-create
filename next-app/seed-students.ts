import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

const mockStudents = [
  {
    name: "Anshuman",
    email: "anshuman@example.com",
    role: "STUDENT",
    enrolledCourse: "Aerospace & Drone Engineering",
  },
  {
    name: "Harshit",
    email: "harshit@example.com",
    role: "STUDENT",
    enrolledCourse: "Robotics & Cybernetics Cohort",
  },
  {
    name: "Suhani",
    email: "suhani@example.com",
    role: "STUDENT",
    enrolledCourse: "Artificial Intelligence Masterclass",
  },
  {
    name: "Shashank Student",
    email: "shashank.student@example.com",
    role: "STUDENT",
    enrolledCourse: "IoT & Cyber-Physical Systems",
  },
  {
    name: "Saurabh",
    email: "saurabh@example.com",
    role: "STUDENT",
    enrolledCourse: "Robotics & Cybernetics Cohort",
  },
  {
    name: "Rajesh",
    email: "rajesh@example.com",
    role: "STUDENT",
    enrolledCourse: "Aerospace & Drone Engineering",
  }
];

const mockCerts = [
  {
    credentialCode: "CC-101",
    recipientName: "Harshit",
    courseTitle: "Robotics & Cybernetics Cohort",
    issueDate: new Date("2026-06-15T00:00:00Z"),
  },
  {
    credentialCode: "CC-102",
    recipientName: "Suhani",
    courseTitle: "Artificial Intelligence Masterclass",
    issueDate: new Date("2026-07-01T00:00:00Z"),
  },
  {
    credentialCode: "CC-103",
    recipientName: "Anshuman",
    courseTitle: "Aerospace & Drone Engineering",
    issueDate: new Date("2026-07-10T00:00:00Z"),
  }
];

async function main() {
  console.log("Seeding mock student records...");
  
  for (const student of mockStudents) {
    const record = await prisma.user.upsert({
      where: { email: student.email },
      update: {
        name: student.name,
        role: student.role,
        enrolledCourse: student.enrolledCourse,
      },
      create: {
        name: student.name,
        email: student.email,
        role: student.role,
        enrolledCourse: student.enrolledCourse,
        passwordHash: "", // Not needed for certificate registry
      }
    });
    console.log(`- Seeded student: ${record.name} (${record.enrolledCourse})`);
  }

  console.log("Seeding mock certificates...");
  for (const cert of mockCerts) {
    const record = await prisma.certificate.upsert({
      where: { credentialCode: cert.credentialCode },
      update: {
        recipientName: cert.recipientName,
        courseTitle: cert.courseTitle,
        issueDate: cert.issueDate,
        published: true,
      },
      create: {
        credentialCode: cert.credentialCode,
        recipientName: cert.recipientName,
        courseTitle: cert.courseTitle,
        issueDate: cert.issueDate,
        published: true,
      }
    });
    console.log(`- Seeded certificate: ${record.credentialCode} for ${record.recipientName}`);
  }
  
  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

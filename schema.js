// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model School {
  id            String       @id @default(cuid())
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  name          String
  contactPerson String
  code          String       @unique @db.Char(4)
  address       String?
  phoneNumber   String?
  image         String?
  email         String       @unique
  websiteUrl    String?
  users         User[]
  teachers      Teacher[]
  staff         Staff[]
  students      Student[]
  grades        Grade[]
  events        Event[]
  fees          Fee[]
  schoolStats   SchoolStats?
  schoolType    SchoolType
}

// Enum for School type
enum SchoolType {
  BASIC_SCHOOL
  HIGH_SCHOOL
  VOCATIONAL_COLLEGE
  TRADE_SCHOOL
  GOVERNMENT
  PRIVATE

}

// Enum for Onboarding Status
enum OnboardingStatus {
  PENDING
  REJECTED
  COMPLETED
}

model SchoolStats {
  id                   String   @id @default(cuid())
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  totalStudents        Int      @default(0)
  totalTeachers        Int      @default(0)
  totalStaff           Int      @default(0)
  totalFeesPaid        Float    @default(0)
  totalFeesOutstanding Float    @default(0)
  averageAttendance    Float    @default(0)
  school               School   @relation(fields: [schoolId], references: [id])
  schoolId             String   @unique
}

model User {
  id        String    @id @default(cuid())
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  email     String    @unique
  password  String
  firstName String
  lastName  String
  isAdmin   Boolean   @default(false)
  school    School    @relation(fields: [schoolId], references: [id])
  schoolId  String
  lastLogin DateTime?

  @@index([schoolId])
}

model Teacher {
  id                String             @id @default(cuid())
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  firstName         String
  lastName          String
  email             String             @unique
  phoneNumber       String?
  subject           String?
  school            School             @relation(fields: [schoolId], references: [id])
  schoolId          String
  grades            Grade[]
  attendanceRecords AttendanceRecord[]

  @@index([schoolId])
}

model Staff {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  firstName   String
  lastName    String
  email       String   @unique
  phoneNumber String?
  position    String
  school      School   @relation(fields: [schoolId], references: [id])
  schoolId    String

  @@index([schoolId])
}

model Student {
  id                String             @id @default(cuid())
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  firstName         String
  lastName          String
  dateOfBirth       DateTime
  gender            String
  address           String?
  phoneNumber       String?
  email             String?            @unique
  enrollmentDate    DateTime
  grade             Grade              @relation(fields: [gradeId], references: [id])
  gradeId           String
  school            School             @relation(fields: [schoolId], references: [id])
  schoolId          String
  fees              Fee[]
  attendanceRecords AttendanceRecord[]
  academicRecords   AcademicRecord[]

  @@index([schoolId, gradeId])
}

model Grade {
  id        String    @id @default(cuid())
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  name      String
  level     Int
  teacher   Teacher   @relation(fields: [teacherId], references: [id])
  teacherId String
  students  Student[]
  school    School    @relation(fields: [schoolId], references: [id])
  schoolId  String

  @@index([schoolId, teacherId])
}

model Fee {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  amount      Float
  dueDate     DateTime
  isPaid      Boolean  @default(false)
  description String?
  student     Student  @relation(fields: [studentId], references: [id])
  studentId   String
  school      School   @relation(fields: [schoolId], references: [id])
  schoolId    String

  @@index([schoolId, studentId, isPaid])
}

model Event {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  title       String
  description String?
  startDate   DateTime
  endDate     DateTime
  location    String?
  school      School   @relation(fields: [schoolId], references: [id])
  schoolId    String

  @@index([schoolId, startDate])
}

model AttendanceRecord {
  id        String   @id @default(cuid())
  date      DateTime
  isPresent Boolean
  student   Student  @relation(fields: [studentId], references: [id])
  studentId String
  teacher   Teacher  @relation(fields: [teacherId], references: [id])
  teacherId String

  @@unique([date, studentId])
  @@index([studentId, date])
}

model AcademicRecord {
  id        String  @id @default(cuid())
  subject   String
  score     Float
  term      String
  year      Int
  student   Student @relation(fields: [studentId], references: [id])
  studentId String

  @@index([studentId, year, term])
}

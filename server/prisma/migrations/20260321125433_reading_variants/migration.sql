-- AlterTable
ALTER TABLE "ExamAttempt" ADD COLUMN     "questionIds" TEXT NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "taskType" TEXT,
ADD COLUMN     "variantSet" TEXT;

export interface User {
  id: string
  name: string
  email: string
  role: 'STUDENT' | 'ADMIN'
  createdAt?: string
}

export interface Exam {
  id: string
  title: string
  titleEn?: string
  description?: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'CONSTITUTION'
  category: 'LANGUAGE' | 'CONSTITUTION' | 'PRACTICE'
  timeLimit: number
  passingScore: number
  isPublished: boolean
  createdAt?: string
  _count?: { questions: number; attempts?: number }
}

export interface Option {
  id: string
  content: string
  isCorrect?: boolean
  order: number
}

export interface Question {
  id: string
  examId: string
  type: 'MULTIPLE_CHOICE' | 'MULTI_SELECT' | 'TRUE_FALSE' | 'FILL_BLANK' | 'TEXT_INPUT'
  skill: 'READING' | 'LISTENING' | 'WRITING' | 'SPEAKING' | 'GRAMMAR'
  content: string
  passage?: string
  audioUrl?: string
  imageUrl?: string
  points: number
  order: number
  explanation?: string
  taskType?: 'P1_MATCH' | 'P2_DEF_MATCH' | 'P3_DIALOGUE' | 'P4_TRUE_FALSE' | 'P5_NOTICES' | 'W1_FILL' | 'W2_SELECT' | 'W3_FORM' | 'W4_FREE' | 'L1_MCQ' | 'L2_MCQ' | 'L3_MCQ' | 'L4_FILL' | 'S_SPEAK' | null
  variantSet?: string | null
  options: Option[]
}

export interface AttemptAnswer {
  id: string
  questionId: string
  selectedOption?: string
  textAnswer?: string
  isCorrect?: boolean
  question?: Question
}

export interface ExamAttempt {
  id: string
  examId: string
  userId?: string
  score?: number
  passed?: boolean
  startedAt: string
  completedAt?: string
  timeSpent?: number
  exam: Exam
  answers?: AttemptAnswer[]
}

export type SkillArea = 'READING' | 'LISTENING' | 'WRITING' | 'SPEAKING' | 'GRAMMAR'
export type ExamLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'CONSTITUTION'

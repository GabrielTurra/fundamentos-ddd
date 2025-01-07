import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export interface QuestionCommentsRepository {
  create(questionComment: QuestionComment): Promise<void>;
  delete(answer: QuestionComment): Promise<void>;
  findById(id: string): Promise<QuestionComment | null>;
}

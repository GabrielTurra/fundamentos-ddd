import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>;
  delete(answer: AnswerComment): Promise<void>;
  findById(id: string): Promise<AnswerComment | null>;
}

import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>;
}

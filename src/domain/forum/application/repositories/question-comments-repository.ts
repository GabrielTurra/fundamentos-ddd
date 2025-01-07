import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export interface QuestionCommentsRepository {
  create(questionComment: QuestionComment): Promise<void>;
}

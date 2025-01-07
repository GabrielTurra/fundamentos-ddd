import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export interface QuestionCommentsRepository {
  create(questionComment: QuestionComment): Promise<void>;
  // save(question: Question): Promise<void>;
  // delete(question: Question): Promise<void>;
  // findBySlug(slug: string): Promise<Question | null>;
  // findById(id: string): Promise<Question | null>;
  // findManyRecent(params: PaginationParams): Promise<Question[]>;
}

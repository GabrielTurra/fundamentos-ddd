import type { Question } from '@/domain/forum/enterprise/entities/question';
import type { QuestionsRepository } from '../repositories/questions-repository';
import { left, right, type Either } from '@/core/errors/either';
import { ResourceNotFoundError } from '@/core/errors/global-errors/resource-not-found-error';

type FetchQuestionBySlugUseCaseRequest = {
  slug: string;
};

type FetchQuestionBySlugUseCaseResponse = Either<ResourceNotFoundError, { question: Question }>;

export class FetchQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug
  }: FetchQuestionBySlugUseCaseRequest): Promise<FetchQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}

import type { Question } from '@/domain/forum/enterprise/entities/question';
import type { QuestionsRepository } from '../repositories/questions-repository';
import { right, type Either } from '@/core/errors/either';

type FetchRecentQuestionsUseCaseRequest = {
  page: number;
};

type FetchRecentQuestionsUseCaseResponse = Either<null, { questions: Question[] }>;

export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({
      page
    });

    return right({ questions });
  }
}

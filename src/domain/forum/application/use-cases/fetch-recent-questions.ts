import type { Question } from '@/domain/forum/enterprise/entities/question';
import type { QuestionsRepository } from '../repositories/questions-repository';

type FetchRecentQuestionsUseCaseRequest = {
  page: number;
};

interface FetchRecentQuestionsUseCaseResponse {
  questions: Question[];
}

export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({
      page
    });

    return { questions };
  }
}

import type { Question } from '@/domain/forum/enterprise/entities/question';
import type { QuestionsRepository } from '../repositories/questions-repository';

type FetchQuestionBySlugUseCaseRequest = {
  slug: string;
};

interface FetchQuestionBySlugUseCaseResponse {
  question: Question;
}

export class FetchQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug
  }: FetchQuestionBySlugUseCaseRequest): Promise<FetchQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) {
      throw new Error('Question not found!');
    }

    return { question };
  }
}

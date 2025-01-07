import type { Answer } from '@/domain/forum/enterprise/entities/answer';
import type { AnswersRepository } from '../repositories/answers-repository';

type FetchQuestionAnswersUseCaseRequest = {
  questionId: string;
  page: number;
};

interface FetchQuestionAnswersUseCaseResponse {
  answers: Answer[];
}

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page });

    return { answers };
  }
}

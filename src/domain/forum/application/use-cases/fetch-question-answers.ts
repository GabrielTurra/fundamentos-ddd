import type { Answer } from '@/domain/forum/enterprise/entities/answer';
import type { AnswersRepository } from '../repositories/answers-repository';
import { right, type Either } from '@/core/errors/either';

type FetchQuestionAnswersUseCaseRequest = {
  questionId: string;
  page: number;
};

type FetchQuestionAnswersUseCaseResponse = Either<null, { answers: Answer[] }>;

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page });

    return right({ answers });
  }
}

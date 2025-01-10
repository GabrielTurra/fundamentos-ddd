import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import type { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { right, type Either } from '@/core/errors/either';

type FetchAnswerCommentsUseCaseRequest = {
  answerId: string;
  page: number;
};

type FetchAnswerCommentsUseCaseResponse = Either<null, { answerComments: AnswerComment[] }>;

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, {
      page
    });

    return right({ answerComments });
  }
}

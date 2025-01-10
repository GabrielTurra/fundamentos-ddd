import type { AnswersRepository } from '../repositories/answers-repository';
import { left, right, type Either } from '@/core/errors/either';
import { ResourceNotFoundError } from '@/core/errors/global-errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/global-errors/not-allowed-error';

type DeleteAnswerUseCaseRequest = {
  answerId: string;
  authorId: string;
};

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.answersRepository.delete(answer);

    return right({});
  }
}

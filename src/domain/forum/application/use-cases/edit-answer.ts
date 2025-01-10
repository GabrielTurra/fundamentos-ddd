import type { Answer } from '@/domain/forum/enterprise/entities/answer';
import type { AnswersRepository } from '../repositories/answers-repository';
import { left, right, type Either } from '@/core/errors/either';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

type EditAnswerUseCaseRequest = {
  authorId: string;
  answerId: string;
  content: string;
};

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answer: Answer }
>;

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
    content
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    answer.content = content;

    await this.answersRepository.save(answer);

    return right({ answer });
  }
}

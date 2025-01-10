import { type Either, left, right } from '@/core/errors/either';
import type { QuestionsRepository } from '../repositories/questions-repository';
import { ResourceNotFoundError } from '@/core/errors/global-errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/global-errors/not-allowed-error';

type DeleteQuestionUseCaseRequest = {
  questionId: string;
  authorId: string;
};

type DeleteQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionsRepository.delete(question);

    return right({});
  }
}

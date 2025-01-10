import { type Either, left, right } from '@/core/errors/either';
import type { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { NotAllowedError } from './errors/not-allowed-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

type DeleteQuestionCommentUseCaseRequest = {
  questionCommentId: string;
  authorId: string;
};

type DeleteQuestionCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionCommentId,
    authorId
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== questionComment.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionCommentsRepository.delete(questionComment);

    return right({});
  }
}

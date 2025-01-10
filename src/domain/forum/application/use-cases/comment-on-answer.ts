import type { AnswersRepository } from '../repositories/answers-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import type { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/global-errors/resource-not-found-error';
import { left, right, type Either } from '@/core/errors/either';

type CommentOnAnswerUseCaseRequest = {
  authorId: string;
  answerId: string;
  content: string;
};

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  { answerComment: AnswerComment }
>;

export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository
  ) {}

  async execute({
    authorId,
    answerId,
    content
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      answerId: answer.id,
      authorId: new UniqueEntityID(authorId),
      content
    });

    await this.answerCommentsRepository.create(answerComment);

    return right({
      answerComment
    });
  }
}

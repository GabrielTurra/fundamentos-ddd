import type { QuestionCommentsRepository } from '../repositories/question-comments-repository';

type DeleteQuestionCommentUseCaseRequest = {
  questionCommentId: string;
  authorId: string;
};

type DeleteQuestionCommentUseCaseResponse = {};

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionCommentId,
    authorId
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) {
      throw new Error('Question Comment not found!');
    }

    if (authorId !== questionComment.authorId.toString()) {
      throw new Error('Not allowed!');
    }

    await this.questionCommentsRepository.delete(questionComment);

    return {};
  }
}

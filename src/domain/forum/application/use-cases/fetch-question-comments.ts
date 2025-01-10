import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import type { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { right, type Either } from '@/core/errors/either';

type FetchQuestionCommentsUseCaseRequest = {
  questionId: string;
  page: number;
};

type FetchQuestionCommentsUseCaseResponse = Either<null, { questionComments: QuestionComment[] }>;

export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments = await this.questionCommentsRepository.findManyByQuestionId(
      questionId,
      { page }
    );

    return right({ questionComments });
  }
}

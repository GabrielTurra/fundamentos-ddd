import { Answer } from '@/domain/forum/enterprise/entities/answer';
import type { AnswersRepository } from '../repositories/answers-repository';

type DeleteAnswerUseCaseRequest = {
  answerId: string;
  authorId: string;
};

type DeleteAnswerUseCaseResponse = {};

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      throw new Error('Answer not found!');
    }

    if (authorId !== answer.authorId.toString()) {
      throw new Error('Not allowed!');
    }

    await this.answersRepository.delete(answer);

    return {};
  }
}

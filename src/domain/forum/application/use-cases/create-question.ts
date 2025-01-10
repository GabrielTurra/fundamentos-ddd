import { Question } from '@/domain/forum/enterprise/entities/question';
import type { QuestionsRepository } from '../repositories/questions-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { right, type Either } from '@/core/errors/either';

type CreateQuestionUseCaseRequest = {
  authorId: string;
  title: string;
  content: string;
};

type CreateQuestionUseCaseResponse = Either<null, { question: Question }>;

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content
    });

    await this.questionsRepository.create(question);

    return right({ question });
  }
}

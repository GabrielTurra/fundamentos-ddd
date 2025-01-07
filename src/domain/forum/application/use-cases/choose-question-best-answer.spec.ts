import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository';
import { makeQuestion } from '@/test/factories/make-question';
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository';
import { makeAnswer } from '@/test/factories/make-answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new ChooseQuestionBestAnswerUseCase(inMemoryQuestionsRepository, inMemoryAnswersRepository);
  });

  it('should be able to choose question best answer', async () => {
    const newQuestion = makeQuestion();
    await inMemoryQuestionsRepository.create(newQuestion);

    const newAnswer = makeAnswer({
      questionId: newQuestion.id
    });

    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newQuestion.authorId.toString()
    });

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(newAnswer.id);
  });

  it('should not be able to choose question best answer from another author', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-allowed-id')
    });
    await inMemoryQuestionsRepository.create(newQuestion);

    const newAnswer = makeAnswer({
      questionId: newQuestion.id
    });

    await inMemoryAnswersRepository.create(newAnswer);

    expect(() => {
      return sut.execute({
        answerId: newAnswer.id.toString(),
        authorId: 'author-not-allowed-id'
      });
    }).rejects.toBeInstanceOf(Error);
  });
});

import { makeAnswer } from '@/test/factories/make-answer';
import { EditAnswerUseCase } from './edit-answer';
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(inMemoryAnswersRepository);
  });

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer({
      content: 'On created content'
    });

    await inMemoryAnswersRepository.create(newAnswer);

    expect(inMemoryAnswersRepository.items[0].content).toEqual(
      'On created content'
    );
    expect(inMemoryAnswersRepository.items[0].id).toEqual(newAnswer.id);

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId: newAnswer.id.toString(),
      content: 'Edited Content'
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'Edited Content'
    });
  });

  it('should not be able to edit a answer from another author', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    });

    await inMemoryAnswersRepository.create(newAnswer);

    expect(() => {
      return sut.execute({
        authorId: 'author-2',
        answerId: newAnswer.id.toString(),
        content: 'Should Not Pass Content'
      });
    }).rejects.toBeInstanceOf(Error);
  });
});

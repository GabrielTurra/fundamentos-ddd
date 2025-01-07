import { makeAnswer } from '@/test/factories/make-answer';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { DeleteAnswerUseCase } from './delete-answer';
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    });

    await inMemoryAnswersRepository.create(newAnswer);

    expect(inMemoryAnswersRepository.items).toHaveLength(1);
    expect(inMemoryAnswersRepository.items[0].id).toEqual(newAnswer.id);

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-1'
    });

    expect(inMemoryAnswersRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a answer from another author', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    });

    await inMemoryAnswersRepository.create(newAnswer);

    expect(() => {
      return sut.execute({
        answerId: newAnswer.id.toString(),
        authorId: 'author-2'
      });
    }).rejects.toBeInstanceOf(Error);
  });
});

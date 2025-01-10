import { makeAnswer } from '@/test/factories/make-answer';
import { DeleteAnswerUseCase } from './delete-answer';
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/global-errors/not-allowed-error';
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
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
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a answer from another author', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    });

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-2'
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});

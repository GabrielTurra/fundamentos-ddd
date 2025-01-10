import { makeAnswer } from '@/test/factories/make-answer';
import { EditAnswerUseCase } from './edit-answer';
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed-error';
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository';
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachment';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    sut = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository);
  });

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer({
      content: 'On created content'
    });

    await inMemoryAnswersRepository.create(newAnswer);

    expect(inMemoryAnswersRepository.items[0].content).toEqual('On created content');
    expect(inMemoryAnswersRepository.items[0].id).toEqual(newAnswer.id);

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1')
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2')
      })
    );

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId: newAnswer.id.toString(),
      content: 'Edited Content',
      attachmentsIds: ['1', '3']
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'Edited Content'
    });

    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') })
    ]);
  });

  it('should not be able to edit a answer from another author', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    });

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: newAnswer.id.toString(),
      content: 'Should Not Pass Content',
      attachmentsIds: []
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});

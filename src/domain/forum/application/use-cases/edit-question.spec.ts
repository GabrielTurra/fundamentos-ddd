import { makeQuestion } from '@/test/factories/make-question';
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment';
import { EditQuestionUseCase } from './edit-question';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed-error';
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );

    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository
    );
  });

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion({
      title: 'On created title',
      content: 'On created content'
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    expect(inMemoryQuestionsRepository.items[0].title).toEqual('On created title');
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(newQuestion.id);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1')
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2')
      })
    );

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId: newQuestion.id.toString(),
      title: 'Edited Title',
      content: 'Edited Content',
      attachmentsIds: ['1', '3']
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'Edited Title',
      content: 'Edited Content'
    });

    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') })
    ]);
  });

  it('should not be able to edit a question from another author', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1')
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: newQuestion.id.toString(),
      title: 'Should Not Pass Title',
      content: 'Should Not Pass Content',
      attachmentsIds: []
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});

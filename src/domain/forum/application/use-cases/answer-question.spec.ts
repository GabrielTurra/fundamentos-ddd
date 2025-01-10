import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerQuestionUseCase } from './answer-question';
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository';
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerQuestionUseCase;

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'New Answer Content',
      attachmentsIds: ['1', '2']
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswersRepository.items[0].id).toEqual(result.value?.answer.id);

    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2);

    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') })
    ]);
  });
});

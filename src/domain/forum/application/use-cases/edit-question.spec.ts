import { makeQuestion } from '@/test/factories/make-question';
import { EditQuestionUseCase } from './edit-question';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion({
      title: 'On created title',
      content: 'On created content'
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    expect(inMemoryQuestionsRepository.items[0].title).toEqual('On created title');
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(newQuestion.id);

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId: newQuestion.id.toString(),
      title: 'Edited Title',
      content: 'Edited Content'
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'Edited Title',
      content: 'Edited Content'
    });
  });

  it('should not be able to edit a question from another author', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1')
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    expect(() => {
      return sut.execute({
        authorId: 'author-2',
        questionId: newQuestion.id.toString(),
        title: 'Should Not Pass Title',
        content: 'Should Not Pass Content'
      });
    }).rejects.toBeInstanceOf(Error);
  });
});

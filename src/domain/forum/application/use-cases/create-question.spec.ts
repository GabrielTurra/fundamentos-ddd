import { CreateQuestionUseCase } from './create-question';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to create an question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'New Question Title',
      content: 'New Question Content'
    });

    expect(question.title).toEqual('New Question Title');
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(question.id);
  });
});

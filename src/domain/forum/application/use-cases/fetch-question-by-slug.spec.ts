import { FetchQuestionBySlugUseCase } from './fetch-question-by-slug';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { makeQuestion } from '@/test/factories/make-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: FetchQuestionBySlugUseCase;

describe('Fetch Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new FetchQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to fetch a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question')
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      slug: 'example-question'
    });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.question.id).toEqual(newQuestion.id);
      expect(result.value.question.title).toEqual(newQuestion.title);
    }
  });
});

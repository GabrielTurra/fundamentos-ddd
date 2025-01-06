import { CreateQuestionUseCase } from './create-question';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';

const fakeQuestionsRepository: QuestionsRepository = {
  create: async (questions: Question) => {
    return;
  }
};

test('create an question', async () => {
  const createQuestionUseCase = new CreateQuestionUseCase(fakeQuestionsRepository);

  const { question } = await createQuestionUseCase.execute({
    authorId: '1',
    title: 'New Question Title',
    content: 'New Question Content'
  });

  expect(question.title).toEqual('New Question Title');
});

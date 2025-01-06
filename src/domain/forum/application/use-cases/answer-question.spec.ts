import { AnswerQuestionUseCase } from './answer-question';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

const fakeAnswersRepository: AnswersRepository = {
  create: async (answers: Answer) => {
    return;
  }
};

test('create an answer', async () => {
  const answerQuestionUseCase = new AnswerQuestionUseCase(fakeAnswersRepository);

  const answer = await answerQuestionUseCase.execute({
    instructorId: '1',
    questionId: '1',
    content: 'New Answer'
  });

  expect(answer.content).toEqual('New Answer');
});

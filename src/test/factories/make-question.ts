import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question, type QuestionProps } from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

import { faker } from '@faker-js/faker';

export function makeQuestion(override: Partial<QuestionProps> = {}, id?: UniqueEntityID) {
  const title = faker.lorem.sentence();

  const question = Question.create(
    {
      authorId: new UniqueEntityID(`${faker.number.int()}`),
      content: faker.lorem.text(),
      title,
      slug: Slug.create(title),
      ...override
    },
    id
  );

  return question;
}

import { faker } from '@faker-js/faker';
import { test, expect } from './fixtures';
import { postSchema, postsSchema } from './api/schemas';

test.describe('Posts API', { tag: '@smoke' }, () => {
  test('GET /posts returns a non-empty list of posts', async ({ postsApi }) => {
    const response = await postsApi.getAll();

    await expect(response).toBeOK();
    expect(response.headers()['content-type']).toContain('application/json');

    const posts = postsSchema.parse(await response.json());
    expect(posts.length).toBeGreaterThan(0);
  });

  test('GET /posts/:id returns a single post', async ({ postsApi }) => {
    const response = await postsApi.getById(1);

    expect(response.status()).toBe(200);

    const post = postSchema.parse(await response.json());
    expect(post.id).toBe(1);
  });

  test('GET /posts/:id returns 404 for a non-existent post', async ({ postsApi }) => {
    const response = await postsApi.getById(999999);

    expect(response.status()).toBe(404);
  });

  test('POST /posts creates a new post', async ({ postsApi }) => {
    const payload = {
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      userId: faker.number.int({ min: 1, max: 10 }),
    };

    const response = await postsApi.create(payload);

    expect(response.status()).toBe(201);

    const created = postSchema.parse(await response.json());
    expect(created).toEqual(expect.objectContaining(payload));
  });

  test('GET /posts filtered by userId only returns that user\'s posts', async ({ postsApi }) => {
    const response = await postsApi.getAll({ userId: 1 });

    await expect(response).toBeOK();

    const posts = postsSchema.parse(await response.json());
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(post.userId).toBe(1);
    }
  });
});

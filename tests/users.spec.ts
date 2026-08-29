import { test, expect } from './fixtures';
import { userSchema, usersSchema } from './api/schemas';

test.describe('Users API', { tag: '@smoke' }, () => {
  test('GET /users returns a list of users', async ({ usersApi }) => {
    const response = await usersApi.getAll();

    await expect(response).toBeOK();

    const users = usersSchema.parse(await response.json());
    expect(users.length).toBeGreaterThan(0);
    console.log(users);
  });

  test('GET /users/:id returns a user with a valid email', async ({ usersApi }) => {
    const response = await usersApi.getById(1);

    await expect(response).toBeOK();

    const user = userSchema.parse(await response.json());
    expect(user.id).toBe(1);
  });

  test('GET /users/:id returns 404 for a non-existent user', async ({ usersApi }) => {
    const response = await usersApi.getById(999999);

    expect(response.status()).toBe(404);
  });
});

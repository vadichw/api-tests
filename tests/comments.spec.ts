import { test, expect } from './fixtures';
import { commentsSchema } from './api/schemas';

test.describe('Comments API', { tag: '@smoke' }, () => {
  test('GET /posts/:id/comments returns comments for that post', async ({ commentsApi }) => {
    const response = await commentsApi.getByPostId(1);

    await expect(response).toBeOK();

    const comments = commentsSchema.parse(await response.json());
    expect(comments.length).toBeGreaterThan(0);
    for (const comment of comments) {
      expect(comment.postId).toBe(1);
    }
  });

  test('GET /comments?postId= filters comments by post', async ({ commentsApi }) => {
    const response = await commentsApi.getAll({ postId: 1 });

    await expect(response).toBeOK();

    const comments = commentsSchema.parse(await response.json());
    expect(comments.length).toBeGreaterThan(0);
    for (const comment of comments) {
      expect(comment.postId).toBe(1);
      expect(comment.email).toContain('@');
    }
  });
});

import { test as base } from '@playwright/test';
import { PostsApiClient } from './api/posts-api-client';
import { UsersApiClient } from './api/users-api-client';
import { CommentsApiClient } from './api/comments-api-client';

interface ApiFixtures {
  postsApi: PostsApiClient;
  usersApi: UsersApiClient;
  commentsApi: CommentsApiClient;
}

export const test = base.extend<ApiFixtures>({
  postsApi: async ({ request }, use) => {
    await use(new PostsApiClient(request));
  },
  usersApi: async ({ request }, use) => {
    await use(new UsersApiClient(request));
  },
  commentsApi: async ({ request }, use) => {
    await use(new CommentsApiClient(request));
  },
});

export { expect } from '@playwright/test';

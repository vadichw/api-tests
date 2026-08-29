import { BaseApiClient } from './base-api-client';

export interface CreatePostPayload {
  title: string;
  body: string;
  userId: number;
}

export class PostsApiClient extends BaseApiClient {
  getAll(filter?: { userId?: number }) {
    return this.request.get('/posts', { params: filter });
  }

  getById(id: number) {
    return this.request.get(`/posts/${id}`);
  }

  create(payload: CreatePostPayload) {
    return this.request.post('/posts', { data: payload });
  }
}

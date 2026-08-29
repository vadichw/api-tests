import { BaseApiClient } from './base-api-client';

export class CommentsApiClient extends BaseApiClient {
  getAll(filter?: { postId?: number }) {
    return this.request.get('/comments', { params: filter });
  }

  getByPostId(postId: number) {
    return this.request.get(`/posts/${postId}/comments`);
  }
}

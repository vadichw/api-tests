import { BaseApiClient } from './base-api-client';

export class UsersApiClient extends BaseApiClient {
  getAll() {
    return this.request.get('/users');
  }

  getById(id: number) {
    return this.request.get(`/users/${id}`);
  }
}

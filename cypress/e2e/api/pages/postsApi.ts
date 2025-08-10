// Posts API page-object style wrapper

export interface PostCreatePayload {
  title: string;
  body: string;
  userId: number;
}

export interface Post extends PostCreatePayload {
  id: number;
}

export class PostsApi {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://jsonplaceholder.typicode.com') {
    this.baseUrl = baseUrl;
  }

  create(payload: PostCreatePayload) {
    return cy.request<Post>({
      method: 'POST',
      url: `${this.baseUrl}/posts`,
      body: payload,
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      failOnStatusCode: true,
    });
  }
}

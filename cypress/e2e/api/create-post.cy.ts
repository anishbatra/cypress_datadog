// API test for POST /posts using POM-style PostsApi wrapper
import { PostsApi } from './pages/postsApi';

describe('API: POST /posts', () => {
  const postsApi = new PostsApi();

  it('creates a new post and returns expected fields', () => {
    // @ts-ignore
    cy.allure().feature('Posts API').story('Create Post').severity('minor');
    const payload = { title: 'foo', body: 'bar', userId: 1 };
    postsApi.create(payload).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.include(payload);
      expect(response.body).to.have.property('id');
      expect(response.body.id).to.be.a('number');
    });
  });
});

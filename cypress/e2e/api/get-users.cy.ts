// API test for GET /users using POM-style UsersApi wrapper
import { UsersApi } from './pages/usersApi';

describe('API: GET /users', () => {
  const usersApi = new UsersApi();

  it('returns a list of users with expected fields', () => {
    // @ts-ignore
    cy.allure().feature('Users API').story('List Users').severity('normal');
    usersApi.list().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('application/json');
      expect(response.body).to.be.an('array').and.to.have.length.greaterThan(0);
      const user = response.body[0];
      expect(user).to.have.all.keys('id','name','username','email','address','phone','website','company');
      expect(user.id).to.be.a('number');
      expect(user.email).to.match(/@/);
    });
  });
});

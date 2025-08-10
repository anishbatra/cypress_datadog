// Users API page-object style wrapper
// Encapsulates calls related to /users endpoint

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: any; 
  phone: string;
  website: string;
  company: any;
}

export class UsersApi {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://jsonplaceholder.typicode.com') {
    this.baseUrl = baseUrl;
  }

  list() {
    return cy.request<User[]>({
      method: 'GET',
      url: `${this.baseUrl}/users`,
      failOnStatusCode: true,
    });
  }
}

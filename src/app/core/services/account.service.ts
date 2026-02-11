import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccountService {
  API = 'http://localhost:3000/api/accounts';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.API);
  }

  create(data: any) {
    return this.http.post(this.API, data);
  }

  getById(id: string) {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  update(id: string, data: any) {
    return this.http.put(`${this.API}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }
}

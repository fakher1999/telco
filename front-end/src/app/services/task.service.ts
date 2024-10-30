import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private url = 'http://127.0.0.1:3000/task';

  constructor(private http: HttpClient) { }

  // Create a method to get the headers with the Bearer token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Set the Authorization header with the Bearer token
      'Content-Type': 'application/json'   // Optional: Set the content type if necessary
    });
  }

  getAll(): Observable<any> {
    return this.http.get<any>(this.url + '/all', { headers: this.getHeaders() });
  }

  getTaskById(id: any): Observable<any> {
    return this.http.get<any>(this.url + '/getbyid/'+id, { headers: this.getHeaders() });
  }

  unusedTasks(): Observable<any> {
    return this.http.get<any>(this.url + '/unused-tasks', { headers: this.getHeaders() });
  }

  save(date: FormData): Observable<any> {
    return this.http.post(this.url + '/save', date, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(this.url + '/' + id, { headers: this.getHeaders() });
  }

  update(id: any, date: FormData): Observable<any> {
    return this.http.put(this.url + '/update/' + id, date, { headers: this.getHeaders() });
  }

  calculatePrice(target: any): Observable<any> {
    return this.http.post(this.url + '/calculate-price', target, { headers: this.getHeaders() });
  }

  getAvailbleCustomer(target: any): Observable<any> {
    return this.http.post(this.url + '/Customer/search', target, { headers: this.getHeaders() });
  }

  
searchTags(staticTags,query: string): Observable<string[]> {
  // Return static values filtered by the query if needed
  const filteredTags = staticTags.filter(tag => tag.includes(query));
  return of(filteredTags);
}

  getAllTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/tags/`, { headers: this.getHeaders() });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ConfirmeTaskService {
  private apiUrl = 'http://localhost:3000/quizzes';
  private apiUrlTasks = 'http://localhost:3000/task';

  constructor(private http: HttpClient) {}
  // Create a method to get the headers with the Bearer token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Set the Authorization header with the Bearer token
      'Content-Type': 'application/json'   // Optional: Set the content type if necessary
    });
  }


  getQuizzes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getQuizById(quizId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${quizId}`,{ headers: this.getHeaders() });
  }

  updateQuiz(quizId: string, quizData: any, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${quizId}`, { ...quizData, password }, { headers: this.getHeaders() });
  }

  createQuiz(quizData: any, taskId: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { ...quizData, taskId, password }, { headers: this.getHeaders() });
  }

  confirmeTask(taskId: any , password: any) {
    return this.http.put(`${this.apiUrlTasks}/confime/${taskId}`, { password }, { headers: this.getHeaders() });
    
  }

  deleteQuiz(id: string, password: string): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/${id}`, { body: { password } ,  headers: this.getHeaders()  });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RapportService {
  private apiUrl = 'http://localhost:3000'; // Adjust as needed

  constructor(private http: HttpClient) {}

  
  // Create a method to get the headers with the Bearer token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Set the Authorization header with the Bearer token
      'Content-Type': 'application/json'   // Optional: Set the content type if necessary
    });
  }
  
  createRapport(taskId: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/rapports`, { taskId, content },{ headers: this.getHeaders() });
  }

  getRapports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rapports`,{ headers: this.getHeaders() });
  }

  addDiscussion(rapportId: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/rapports/${rapportId}/discussions`, { content }, { headers: this.getHeaders() });
  }

  updateStatus(rapportId: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/rapports/${rapportId}/status`, { status }, { headers: this.getHeaders() });
  }
  
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://127.0.0.1:3000/dashboard-analytics';

  constructor(private http: HttpClient) {}
  // Create a method to get the headers with the Bearer token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Set the Authorization header with the Bearer token
      'Content-Type': 'application/json'   // Optional: Set the content type if necessary
    });
  }

  getDashboardAnalytics(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getMonthlyStats(year?: number): Observable<any> {
    const params = year ? { year: year.toString() } : {};
    return this.http.get<any>(this.apiUrl + '/monthly-statistics', { params , headers: this.getHeaders() });
  }
  
  getFinanceStats(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/monthly-stats', { headers: this.getHeaders() });
  }
}

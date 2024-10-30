// agent.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = 'http://127.0.0.1:3000/agents';

  constructor(private http: HttpClient) {}

  getAllAgents(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getAgentById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createAgent(agent: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"/create", agent);
  }

  updateAgent(id: string, agent: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, agent);
  }

  deleteAgent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

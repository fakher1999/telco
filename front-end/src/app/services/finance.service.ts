import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private apiUrl = 'http://localhost:3000/finance';

  constructor(private http: HttpClient) {}

  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/invoice`, invoiceData);
  }

  getProjectInvoices(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/project/${projectId}`);
  }

  payInvoice(invoiceId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/pay/${invoiceId}`, {});
  }

  getSummary(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/summary`).pipe(
      tap(data => console.log('Data fetched from getSummary:', data)),
      catchError(this.handleError('getSummary', []))
    );
  }

  getTotalAmount(): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/summary`).pipe(
      map(invoices => invoices.reduce((sum, invoice) => sum + invoice.amount, 0)),
      tap(total => console.log('Total amount:', total)),
      catchError(this.handleError<number>('getTotalAmount', 0))
    );
  }

  getUnpaidInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/unpaid`).pipe(
      tap(data => console.log('Raw data received from getUnpaidInvoices:', data)),
      map(invoices => invoices.map(invoice => ({
        financeId: invoice._id || 'N/A',
        projectName: invoice || 'No Project Name',
        userId: invoice.user ? invoice.user._id : 'No User ID',
        userName: invoice.user ? `${invoice.user.firstName} ${invoice.user.lastName}` : 'Unknown User',
        amount: invoice.amount || 0,
        status: invoice.status || 'N/A',
        date: invoice.date || 'no Date'

      }))),
      catchError(this.handleError('getUnpaidInvoices', []))
    );
  }

  getPaidInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paid`).pipe(
      tap(data => console.log('Raw data received from getPaidInvoices:', data)),
      map(invoices => invoices.map(invoice => ({
        financeId: invoice._id || 'N/A',
        projectName: invoice || 'No Project Name',
        userId: invoice.user ? invoice.user._id : 'No User ID',
        userName: invoice.user ? `${invoice.user.firstName} ${invoice.user.lastName}` : 'Unknown User',
        amount: invoice.totalAmount || 0,
        status: invoice.status || 'N/A',
        date: invoice.date || 'no Date'

      }))),
      catchError(this.handleError('getPaidInvoices', []))
    );
  }
  
  

  getInvoiceById(invoiceId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${invoiceId}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

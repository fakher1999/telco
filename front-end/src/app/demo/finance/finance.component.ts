import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceService } from 'src/app/services/finance.service';
import { UserService } from 'src/app/services/user.service';
import { TaskService } from 'src/app/services/task.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CardComponent,
    SharedModule,
    HttpClientModule
  ],
  providers: [FinanceService,UserService,TaskService,]  // Provide the service here

})
export class FinanceComponent implements OnInit {
  isModalOpen = false;
  filteredFinances: any[] = [];
  historyInvoices: any[] = [];
  summaryData: any[] = [];
  unpaidInvoices: any[] = [];
  paidInvoices: any[] = [];
  users: any[] = [];
  projects: any[] = [];
  financeForm: FormGroup;
  selectedTab: string = 'all';

  summary: { totalPaid: number, totalUnpaid: number, totalAmount: number } = {
    totalPaid: 0,
    totalUnpaid: 0,
    totalAmount: 0
  };

  displayedColumns: string[] = ['projectName', 'userName', 'amount', 'status', 'action'];

  constructor(
    private financeService: FinanceService,
    private userService: UserService,
    private projectService: TaskService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.financeForm = this.fb.group({
      projectId: ['', Validators.required],
      userId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      status: ['unpaid', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadProjects();
    this.loadSummary();
    this.loadUnpaidInvoices();
    this.loadPaidInvoices();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (users: any) => this.users = users,
      error: (error: any) => console.error('Error loading users', error)
    });
  }

  loadProjects() {
    this.projectService.getAll().subscribe({
      next: (projects: any) => this.projects = projects,
      error: (error: any) => console.error('Error loading projects', error)
    });
  }

  onSubmit() {
    if (this.financeForm.valid) {
      this.financeService.createInvoice(this.financeForm.value).subscribe({
        next: () => {
          this.showSuccess('Invoice created successfully');
          this.financeForm.reset({ status: 'unpaid' });
          this.reloadInvoices();
          this.closeModal();
        },
        error: () => this.showError('Failed to create invoice')
      });
    }
  }

  reloadInvoices(): void {
    this.loadSummary();
    this.loadUnpaidInvoices();
    this.loadPaidInvoices();
  }

  loadSummary(): void {
    this.financeService.getSummary().subscribe({
      next: (data: any[]) => {
        this.summaryData = data;
        this.calculateSummary();
      },
      error: (err) => {
        console.error('Error loading summary:', err);
        this.showError('Failed to load summary');
      }
    });
  }

  loadUnpaidInvoices(): void {
    this.financeService.getUnpaidInvoices().subscribe({
      next: (data: any[]) => {
        this.unpaidInvoices = data;
        this.filterFinances();
        this.calculateSummary();
      },
      error: () => this.showError('Failed to load unpaid invoices')
    });
  }

  loadPaidInvoices(): void {
    this.financeService.getPaidInvoices().subscribe({
      next: (data: any[]) => {
        this.paidInvoices = data;
        this.filterFinances();
        this.calculateSummary();
      },
      error: () => this.showError('Failed to load paid invoices')
    });
  }

  payInvoice(invoiceId: string): void {
  this.financeService.payInvoice(invoiceId).subscribe({
    next: () => {
      this.showSuccess('Invoice paid successfully');
      this.reloadInvoices();
    },
    error: () => this.showError('Failed to pay invoice')
  });
}


  onTabChange(tab: string) {
    this.selectedTab = tab;
    this.filterFinances();
  }

  filterFinances(filters: { userId?: string, status?: string } = {}) {
    if (this.selectedTab === 'all') {
      this.filteredFinances = this.allInvoices.filter(invoice => {
        return (!filters.userId || invoice.userId === filters.userId) &&
               (!filters.status || (filters.status === 'Paid' ? invoice.totalPaid > 0 : invoice.totalPaid === 0));
      });
    } else if (this.selectedTab === 'paid') {
      this.filteredFinances = this.paidInvoices;
    } else if (this.selectedTab === 'unpaid') {
      this.filteredFinances = this.unpaidInvoices;
    } else if (this.selectedTab === 'history') {
      this.filteredFinances = this.historyInvoices;
    }
  }
  

  get allInvoices() {
    return [...this.unpaidInvoices, ...this.paidInvoices];
  }

  private calculateSummary() {
    this.summary.totalAmount = this.allInvoices.reduce((acc, invoice) => acc + invoice.amount, 0);
    this.summary.totalPaid = this.paidInvoices.reduce((acc, invoice) => acc + invoice.amount, 0);
    this.summary.totalUnpaid = this.unpaidInvoices.reduce((acc, invoice) => acc + invoice.amount, 0);
    console.log('Calculated summary:', this.summary);
  }
  

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}


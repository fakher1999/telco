import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { FinanceService } from '../../services/finance.service';
import { CardComponent } from "../../theme/shared/components/card/card.component";
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule here

@Component({
  selector: 'app-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'], // Fixed styleUrls property
  standalone: true,
  imports: [CardComponent,SharedModule, CommonModule, RouterOutlet, CanvasJSAngularChartsModule,HttpClientModule],
  providers: [FinanceService]  // Provide the service here

})
export class ChartsComponent implements OnInit {
  chart: any;
  isButtonVisible = false;
  options: any = {};
  unpaidAmount: number = 0;
  paidAmount: number = 0;
  chartOptions: any;

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    this.fetchChartData();
  }

  fetchChartData(): void {
    // Fetch paid invoices and calculate the total paid amount
    this.financeService.getPaidInvoices().subscribe(
      (paidInvoices: any[]) => {
        this.paidAmount = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
        this.updateChart();
      },
      error => console.error('Error fetching paid invoices:', error)
    );

    // Fetch unpaid invoices and calculate the total unpaid amount
    this.financeService.getUnpaidInvoices().subscribe(
      (unpaidInvoices: any[]) => {
        this.unpaidAmount = unpaidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
        this.updateChart();
      },
      error => console.error('Error fetching unpaid invoices:', error)
    );
  }

  updateChart(): void {
    // Update the chart with the new data points for paid and unpaid amounts
    if (this.chart) {
      this.chart.options = {
        animationEnabled: true,
        theme: "light2",
        title: {
          text: "Paid and Unpaid Tasks"
        },
        data: [{
          type: "pie",
          name: "Tasks",
          startAngle: 90,
          cursor: "pointer",
          showInLegend: true,
          legendMarkerType: "square",
          dataPoints: [
            { y: this.paidAmount, name: "Paid", color: "#FF0000" },
            { y: this.unpaidAmount, name: "Unpaid", color: "#50b432" }
          ]
        }]
      };
      this.chart.render();
    }
  }

  getChartInstance(chart: any): void {
    this.chart = chart;
    this.updateChart();
  }

  handleClick($event: MouseEvent) {
    // Implement click handling functionality properly
    console.log('Unpaid Amount:', this.unpaidAmount);
    console.log('Paid Amount:', this.paidAmount);
  }
}

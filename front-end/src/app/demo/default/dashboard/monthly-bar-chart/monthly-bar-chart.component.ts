import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {
  NgApexchartsModule,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexAxisChartSeries,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexTheme,
  ApexGrid
} from 'ng-apexcharts';
import { HttpClientModule } from '@angular/common/http';
import { AnalyticsService } from 'src/app/services/analytics.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  colors: string[];
  stroke: ApexStroke;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  theme: ApexTheme;
};

@Component({
  selector: 'app-monthly-bar-chart',
  standalone: true,
  imports: [
    SharedModule,
    NgApexchartsModule,
    HttpClientModule
  ],
  providers: [AnalyticsService],
  templateUrl: './monthly-bar-chart.component.html',
  styleUrl: './monthly-bar-chart.component.scss'
})
export class MonthlyBarChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  chartOptions!: Partial<ChartOptions>;
  private analyticsData: any;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    // Initial chart configuration
    this.initializeChart();
    
    // Fetch data from service
    this.analyticsService.getMonthlyStats().subscribe({
      next: (data) => {
        this.analyticsData = data;
        this.updateChartData('week'); // Initial load with weekly data
      },
      error: (error) => {
        console.error('Error fetching analytics:', error);
        // Load default data as fallback
        setTimeout(() => {
        this.updateChartData('week');

        }, 3000)
      }
    });
  }

  private initializeChart() {
    document.querySelector('.chart-income.week')?.classList.add('active');
    this.chartOptions = {
      chart: {
        height: 450,
        type: 'area',
        toolbar: {
          show: false
        },
        background: 'transparent'
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#1677ff', '#0050b3'],
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          style: {
            colors: Array(12).fill('#8c8c8c')
          }
        },
        axisBorder: {
          show: true,
          color: '#f0f0f0'
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: ['#8c8c8c']
          }
        }
      },
      grid: {
        strokeDashArray: 0,
        borderColor: '#f5f5f5'
      },
      theme: {
        mode: 'light'
      }
    };
  }

  private updateChartData(value: string) {
    if (this.analyticsData) {
      console.log(' this.analyticsData' ,  this.analyticsData)
      // Use real data if available
      this.chartOptions.series = [
        {
          name: 'Tasks',
          data: value === 'month' ? this.analyticsData.monthly.tasks : this.analyticsData.weekly.tasks
        },
        {
          name: 'Paid Amount',
          data: value === 'month' ? this.analyticsData.monthly.paid : this.analyticsData.weekly.paid
        }
      ];
    } else {
      // Fallback to default data
      this.chartOptions.series = [
        {
          name: 'Tasks',
          data: value === 'month' ? 
            [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35] : 
            [31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: 'Paid Amount',
          data: value === 'month' ? 
            [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41] : 
            [11, 32, 45, 32, 34, 52, 41]
        }
      ];
    }
  }

  toggleActive(value: string) {
    this.updateChartData(value);
    
    const xaxis = { ...this.chartOptions.xaxis };
    xaxis.categories = value === 'month'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    xaxis.tickAmount = value === 'month' ? 11 : 7;
    
    this.chartOptions = { ...this.chartOptions, xaxis };
    
    // Update active classes
    if (value === 'month') {
      document.querySelector('.chart-income.month')?.classList.add('active');
      document.querySelector('.chart-income.week')?.classList.remove('active');
    } else {
      document.querySelector('.chart-income.week')?.classList.add('active');
      document.querySelector('.chart-income.month')?.classList.remove('active');
    }
  }
}
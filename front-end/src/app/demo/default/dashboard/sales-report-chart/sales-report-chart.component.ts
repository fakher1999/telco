// angular import
import { Component, OnInit, ViewChild } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import {
  NgApexchartsModule,
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexGrid,
  ApexTooltip,
  ApexLegend,
  ApexDataLabels
} from 'ng-apexcharts';
import { AnalyticsService } from 'src/app/services/analytics.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  colors: string[];
  stroke: ApexStroke;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-sales-report-chart',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './sales-report-chart.component.html',
  styleUrl: './sales-report-chart.component.scss'
})
export class SalesReportChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  chartOptions: Partial<ChartOptions>;
  weeklyTotal: number = 0;

  constructor(private analyticsService: AnalyticsService) {
    this.chartOptions = {
      chart: {
        type: 'bar',
        height: 430,
        toolbar: {
          show: false
        },
        background: 'transparent'
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          borderRadius: 4
        }
      },
      stroke: {
        show: true,
        width: 8,
        colors: ['transparent']
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        show: true,
        fontFamily: `'Public Sans', sans-serif`,
        offsetX: 10,
        offsetY: 10,
        labels: {
          useSeriesColors: false
        },
        markers: {
          width: 10,
          height: 10,
          radius: 50
        },
        itemMargin: {
          horizontal: 15,
          vertical: 5
        }
      },
      series: [
        {
          name: 'Paid Amount',
          data: []
        },
        {
          name: 'Unpaid Amount',
          data: []
        }
      ],
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: Array(12).fill('#222')
          }
        }
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function(value) {
            return `$${value.toLocaleString()}`;
          }
        }
      },
      colors: ['#1677ff', '#faad14'], // Blue for paid, Orange for unpaid
      grid: {
        borderColor: '#f5f5f5'
      }
    };
  }

  ngOnInit() {
    this.loadFinanceData();
  }

  private loadFinanceData() {
    this.analyticsService.getFinanceStats().subscribe({
      next: (data) => {
        this.chartOptions.series = data.series;
        this.chartOptions.xaxis = {
          ...this.chartOptions.xaxis,
          categories: data.categories
        };
        this.weeklyTotal = data.weeklyTotal;
      },
      error: (error) => {
        console.error('Error loading finance data:', error);
      }
    });
  }
}
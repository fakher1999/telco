// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import tableData from 'src/fake-data/default-data.json';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MonthlyBarChartComponent } from './monthly-bar-chart/monthly-bar-chart.component';
import { IncomeOverviewChartComponent } from './income-overview-chart/income-overview-chart.component';
import { AnalyticsChartComponent } from './analytics-chart/analytics-chart.component';
import { SalesReportChartComponent } from './sales-report-chart/sales-report-chart.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
// icons
import { IconService } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MonthlyBarChartComponent,
    IncomeOverviewChartComponent,
    AnalyticsChartComponent,
    HttpClientModule,
    SalesReportChartComponent
  ],
  providers: [AnalyticsService] , // Provide the service here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DefaultComponent {
  // constructor
  constructor(private iconService: IconService,private analyticsService: AnalyticsService) {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }

  recentOrder = tableData;

  AnalyticEcommerce = [
    {
      title: 'Total Tasks',
      amount: '4,42,236',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: '',
      percentage: '',
      color: '',
      number: ''
    },
    {
      title: 'Total Users',
      amount: '78,250',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'rise',
      percentage: '70.5%',
      color: 'text-primary',
      number: '8,900'
    },
    {
      title: 'Total Order',
      amount: '18,800',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'fall',
      percentage: '27.4%',
      color: 'text-warning',
      number: '1,943'
    },
    {
      title: 'Total Sales',
      amount: '$35,078',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'fall',
      percentage: '27.4%',
      color: 'text-warning',
      number: '$20,395'
    }
  ];

  ngOnInit() {
    this.analyticsService.getDashboardAnalytics()
      .subscribe({
        next: (data) => {
          this.AnalyticEcommerce = data;
        },
        error: (error) => {
          console.error('Error fetching analytics:', error);
        }
      });
  }
  transaction = [
    {
      background: 'text-success bg-light-success',
      icon: 'gift',
      title: 'Order #002434',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '78%'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'message',
      title: 'Order #984947',
      time: '5 August, 1:45 PM',
      amount: '- $302',
      percentage: '8%'
    },
    {
      background: 'text-danger bg-light-danger',
      icon: 'setting',
      title: 'Order #988784',
      time: '7 hours ago',
      amount: '- $682',
      percentage: '16%'
    }
  ];
}
